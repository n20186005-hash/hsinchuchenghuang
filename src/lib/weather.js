// 氣象資料服務（伺服器端）
// 職責：提資料 → 正規化 → 佇伺服器端做短期快取 → 出力予頁面抑 API。
// 前端頁面干焦看會著正規化後的結果，袂直接連外部的資料服務。

import { buildAdvice, windText, uvInfo, humidityText, beaufort } from './advice.js';

const FORECAST_ENDPOINT = 'https://api.open-meteo.com/v1/forecast';
const AIR_ENDPOINT = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const MARINE_ENDPOINT = 'https://marine-api.open-meteo.com/v1/marine';

const TZ = 'Asia/Taipei';
const CACHE_TTL_MS = 10 * 60 * 1000; // 伺服器端記憶體快取：10 分
const REQUEST_TIMEOUT_MS = 8000;

// 市區（城隍廟）佮最近的海岸參考點（南寮漁港外海）
export const SITE_POINT = { lat: 24.804381, lon: 120.9656054, name: '新竹市北區' };
export const COAST_POINT = { lat: 24.8475, lon: 120.9240, name: '南寮漁港外海' };

// 資料來源的標示（頁面顯示用，中立敘述，無提服務名稱佮計費方式）
export const WEATHER_SOURCE = {
  label: '歐洲中期天氣預報中心（ECMWF）等數值天氣預報模式',
  shortLabel: 'ECMWF 等數值模式',
};

/* ------------------------------------------------------------------ */
/* WMO 天氣代碼對照                                                     */
/* ------------------------------------------------------------------ */
const WMO = {
  0: { desc: '晴朗', icon: 'clear' },
  1: { desc: '晴時多雲', icon: 'mostly-clear' },
  2: { desc: '多雲', icon: 'partly-cloudy' },
  3: { desc: '陰天', icon: 'overcast' },
  45: { desc: '有霧', icon: 'fog' },
  48: { desc: '霧凇', icon: 'fog' },
  51: { desc: '毛毛雨', icon: 'drizzle' },
  53: { desc: '毛毛雨', icon: 'drizzle' },
  55: { desc: '較大的毛毛雨', icon: 'drizzle' },
  56: { desc: '凍毛雨', icon: 'drizzle' },
  57: { desc: '凍毛雨', icon: 'drizzle' },
  61: { desc: '小雨', icon: 'rain' },
  63: { desc: '陣雨', icon: 'rain' },
  65: { desc: '大雨', icon: 'heavy-rain' },
  66: { desc: '凍雨', icon: 'rain' },
  67: { desc: '凍雨', icon: 'heavy-rain' },
  71: { desc: '落雪', icon: 'snow' },
  73: { desc: '落雪', icon: 'snow' },
  75: { desc: '大雪', icon: 'snow' },
  77: { desc: '雪粒', icon: 'snow' },
  80: { desc: '陣雨', icon: 'showers' },
  81: { desc: '陣雨', icon: 'showers' },
  82: { desc: '強陣雨', icon: 'heavy-rain' },
  85: { desc: '陣雪', icon: 'snow' },
  86: { desc: '陣雪', icon: 'snow' },
  95: { desc: '雷陣雨', icon: 'thunder' },
  96: { desc: '雷陣雨兼冰雹', icon: 'thunder' },
  99: { desc: '雷陣雨兼冰雹', icon: 'thunder' },
};

const describeCode = (code, isDay = 1) => {
  const hit = WMO[code];
  if (!hit) return { desc: '天氣資料整理中', icon: 'partly-cloudy' };
  return { desc: hit.desc, icon: hit.icon };
};

const WIND_DIRS = ['北', '東北', '東', '東南', '南', '西南', '西', '西北'];
const windDirText = (deg) => {
  if (deg === null || deg === undefined || Number.isNaN(deg)) return '';
  return WIND_DIRS[Math.round((((deg % 360) + 360) % 360) / 45) % 8];
};

const WEEKDAYS = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];

const num = (v) => (typeof v === 'number' && !Number.isNaN(v) ? v : null);

/* ------------------------------------------------------------------ */
/* 快取                                                                */
/* ------------------------------------------------------------------ */
const cache = globalThis.__hsinchuWeatherCache
  ?? (globalThis.__hsinchuWeatherCache = { at: 0, key: null, data: null, inflight: null });

/* ------------------------------------------------------------------ */
/* 抓資料                                                              */
/* ------------------------------------------------------------------ */
const fetchJson = async (url) => {
  const res = await fetch(url, {
    headers: { accept: 'application/json', 'user-agent': 'hsinchuchenghuang.com weather module' },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`upstream ${res.status}`);
  return res.json();
};

const forecastUrl = (lat, lon) => {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'is_day',
      'wind_speed_10m',
      'wind_gusts_10m',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_hours',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_gusts_10m_max',
    ].join(','),
    timezone: TZ,
    forecast_days: '7',
    wind_speed_unit: 'kmh',
  });
  return `${FORECAST_ENDPOINT}?${params}`;
};

const airUrl = (lat, lon) => {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'us_aqi,pm10,pm2_5',
    timezone: TZ,
  });
  return `${AIR_ENDPOINT}?${params}`;
};

const marineUrl = (lat, lon) => {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'wave_height,wave_period,wave_direction,sea_surface_temperature',
    hourly: 'wave_height,sea_surface_temperature,sea_level_height_msl',
    timezone: TZ,
    forecast_days: '3',
  });
  return `${MARINE_ENDPOINT}?${params}`;
};

/* ------------------------------------------------------------------ */
/* 潮汐：對逐點鐘的海面高度序列揣出極值（漲潮／退潮）                    */
/* 逐點鐘的解析度，時間的誤差大約半點鐘。                               */
/* ------------------------------------------------------------------ */
const deriveTides = (times, levels, fromIndex) => {
  if (!Array.isArray(times) || !Array.isArray(levels)) return null;
  const events = [];
  for (let i = Math.max(1, fromIndex); i < levels.length - 1; i += 1) {
    const prev = num(levels[i - 1]);
    const cur = num(levels[i]);
    const next = num(levels[i + 1]);
    if (prev === null || cur === null || next === null) continue;
    if (cur >= prev && cur > next) {
      events.push({ type: 'high', label: '漲潮', at: times[i], time: times[i].slice(11, 16), level: cur });
    } else if (cur <= prev && cur < next) {
      events.push({ type: 'low', label: '退潮', at: times[i], time: times[i].slice(11, 16), level: cur });
    }
    if (events.length >= 6) break;
  }
  if (!events.length) return null;
  const nextHigh = events.find((e) => e.type === 'high') ?? null;
  const nextLow = events.find((e) => e.type === 'low') ?? null;
  return { events: events.slice(0, 4), nextHigh, nextLow, approximate: true };
};

const normalizeMarine = (m, curHour) => {
  if (!m || !m.hourly) return null;
  const times = m.hourly.time ?? [];
  const idx = Math.max(0, times.findIndex((t) => t.slice(0, 13) === curHour));
  const cur = m.current ?? {};
  const waveHeight = num(cur.wave_height) ?? num(m.hourly.wave_height?.[idx]);
  const seaTemp = num(cur.sea_surface_temperature) ?? num(m.hourly.sea_surface_temperature?.[idx]);
  const tide = deriveTides(times, m.hourly.sea_level_height_msl ?? [], idx);
  if (waveHeight === null && seaTemp === null && !tide) return null;
  return {
    waveHeight,
    wavePeriod: num(cur.wave_period),
    waveDir: num(cur.wave_direction),
    seaTemp,
    tide,
  };
};

/* ------------------------------------------------------------------ */
/* 生活建議                                                            */
/* ------------------------------------------------------------------ */
const aqiLevel = (aqi) => {
  if (aqi === null || aqi === undefined) return null;
  if (aqi <= 50) return { label: '良好', tone: 'ok' };
  if (aqi <= 100) return { label: '中等', tone: 'info' };
  if (aqi <= 150) return { label: '對敏感族群無健康', tone: 'warn' };
  if (aqi <= 200) return { label: '對所有族群無健康', tone: 'alert' };
  return { label: '誠無健康', tone: 'alert' };
};

/* ------------------------------------------------------------------ */
/* 正規化                                                              */
/* ------------------------------------------------------------------ */
const normalize = (fc, aq, marineRaw, { lat, lon, name }) => {
  const cur = fc.current ?? {};
  const nowIso = cur.time ?? '';
  const curHour = nowIso.slice(0, 13);
  const hourlyTimes = fc.hourly?.time ?? [];
  const idx = Math.max(0, hourlyTimes.findIndex((t) => t.slice(0, 13) === curHour));
  const h = fc.hourly ?? {};

  const current = {
    time: nowIso,
    timeShort: nowIso.slice(11, 16),
    temp: num(cur.temperature_2m),
    feels: num(cur.apparent_temperature),
    humidity: num(cur.relative_humidity_2m),
    isDay: cur.is_day === 0 ? 0 : 1,
    code: cur.weather_code ?? null,
    ...describeCode(cur.weather_code, cur.is_day ?? 1),
    precip: num(cur.precipitation) ?? 0,
    precipProb: num(h.precipitation_probability?.[idx]),
    cloud: num(cur.cloud_cover),
    pressure: num(cur.pressure_msl),
    wind: num(cur.wind_speed_10m),
    windDir: num(cur.wind_direction_10m),
    windDirText: windDirText(cur.wind_direction_10m),
    windText: windText(cur.wind_speed_10m),
    gust: num(cur.wind_gusts_10m),
  };

  const hourly = hourlyTimes
    .map((t, i) => ({
      time: t,
      hourLabel: t.slice(11, 16),
      dayLabel: t.slice(5, 10).replace('-', '/'),
      temp: num(h.temperature_2m?.[i]),
      feels: num(h.apparent_temperature?.[i]),
      precipProb: num(h.precipitation_probability?.[i]),
      precip: num(h.precipitation?.[i]),
      wind: num(h.wind_speed_10m?.[i]),
      gust: num(h.wind_gusts_10m?.[i]),
      isDay: h.is_day?.[i] === 0 ? 0 : 1,
      code: h.weather_code?.[i] ?? null,
      ...describeCode(h.weather_code?.[i], h.is_day?.[i] ?? 1),
    }))
    .filter((x) => x.time >= curHour)
    .slice(0, 48);

  const d = fc.daily ?? {};
  const daily = (d.time ?? []).map((date, i) => {
    const dt = new Date(`${date}T12:00:00+08:00`);
    return {
      date,
      dateShort: date.slice(5).replace('-', '/'),
      weekday: WEEKDAYS[dt.getUTCDay()] ?? '',
      isToday: i === 0,
      code: d.weather_code?.[i] ?? null,
      ...describeCode(d.weather_code?.[i], 1),
      tMax: num(d.temperature_2m_max?.[i]),
      tMin: num(d.temperature_2m_min?.[i]),
      feelsMax: num(d.apparent_temperature_max?.[i]),
      feelsMin: num(d.apparent_temperature_min?.[i]),
      sunrise: d.sunrise?.[i]?.slice(11, 16) ?? null,
      sunset: d.sunset?.[i]?.slice(11, 16) ?? null,
      uvMax: num(d.uv_index_max?.[i]),
      precipSum: num(d.precipitation_sum?.[i]),
      precipHours: num(d.precipitation_hours?.[i]),
      precipProbMax: num(d.precipitation_probability_max?.[i]),
      windMax: num(d.wind_speed_10m_max?.[i]),
      gustMax: num(d.wind_gusts_10m_max?.[i]),
    };
  });

  const a = aq?.current ?? null;
  const air = num(a?.us_aqi) !== null
    ? {
        aqi: Math.round(a.us_aqi),
        pm25: num(a.pm2_5),
        pm10: num(a.pm10),
        level: aqiLevel(Math.round(a.us_aqi)),
      }
    : null;

  const marine = normalizeMarine(marineRaw, curHour);

  const data = {
    ok: true,
    source: WEATHER_SOURCE,
    location: { name, latitude: lat, longitude: lon, timezone: TZ },
    coast: marine ? COAST_POINT : null,
    updatedAt: nowIso,
    updatedAtIso: nowIso,
    updatedLabel: nowIso ? `${nowIso.slice(5, 10).replace('-', '/')} ${nowIso.slice(11, 16)}` : '',
    today: daily[0] ?? null,
    current,
    hourly,
    daily,
    air,
    marine,
  };

  data.advice = buildAdvice({
    current,
    hourly,
    daily,
    air,
    marine,
  });

  return data;
};

/* ------------------------------------------------------------------ */
/* 對外接口                                                            */
/* ------------------------------------------------------------------ */
const DEFAULT_POINT = SITE_POINT;

/**
 * 提氣象資料。會當指定 lat / lon（預設是新竹城隍廟的座標）。
 * 有 10 分鐘的伺服器端記憶體快取；抓無資料的時陣會回舊的快取。
 */
export async function getWeather({ lat = DEFAULT_POINT.lat, lon = DEFAULT_POINT.lon, name = DEFAULT_POINT.name } = {}) {
  const key = `${lat},${lon}`;
  const now = Date.now();

  if (cache.data && cache.at && cache.key === key && now - cache.at < CACHE_TTL_MS) {
    return cache.data;
  }
  if (cache.inflight && cache.key === key) return cache.inflight;

  cache.key = key;
  cache.inflight = (async () => {
    try {
      const [fc, aq, marine] = await Promise.all([
        fetchJson(forecastUrl(lat, lon)),
        fetchJson(airUrl(lat, lon)).catch(() => null),
        fetchJson(marineUrl(COAST_POINT.lat, COAST_POINT.lon)).catch(() => null),
      ]);
      const data = normalize(fc, aq, marine, { lat, lon, name });
      cache.at = Date.now();
      cache.data = data;
      return data;
    } catch {
      // 抓無資料：有舊的快取就用舊的，無就回一个健康狀況予頁面處理
      if (cache.data) return { ...cache.data, stale: true };
      return { ok: false, error: 'weather_unavailable', location: { name, latitude: lat, longitude: lon } };
    } finally {
      cache.inflight = null;
    }
  })();

  return cache.inflight;
}

export { beaufort, uvInfo, humidityText };

export const weatherCacheTtlSeconds = CACHE_TTL_MS / 1000;
