// 天氣圖示的 SVG 內容（24×24 viewBox，線條風格）
// 佇伺服器端（WeatherIcon.astro）佮客戶端（WeatherTeaser.astro）攏用仝一份定義。

const RAYS =
  'M12 2.4v2.3M12 19.3v2.3M2.4 12h2.3M19.3 12h2.3M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7';
const CLOUD = 'M17.4 19.2a4.4 4.4 0 0 0 .1-8.8 5.9 5.9 0 0 0-11.4 1.6 3.8 3.8 0 0 0 .3 6.9z';

export const WEATHER_ICONS = {
  clear: `<circle cx="12" cy="12" r="4.3"/><path d="${RAYS}"/>`,
  'mostly-clear':
    `<circle cx="10.5" cy="10.5" r="3.4"/><path d="M10.5 4.4v1.9M4.4 10.5h1.9M6.1 6.1l1.4 1.4M14.9 6.1l-1.4 1.4"/>`
    + `<path d="M17.6 19.4a3.4 3.4 0 0 0 .1-6.8 4.6 4.6 0 0 0-8.9 1.2 3 3 0 0 0 .2 5.6z"/>`,
  'partly-cloudy':
    `<circle cx="9.2" cy="8.6" r="3.1"/><path d="M9.2 2.9v1.7M2.9 8.6h1.7M4.5 4.5l1.2 1.2M13.9 4.5l-1.2 1.2"/>`
    + `<path d="M17.4 19.4a3.9 3.9 0 0 0 .1-7.8 5.2 5.2 0 0 0-10.1 1.4 3.4 3.4 0 0 0 .2 6.4z"/>`,
  overcast:
    `<path d="M6.4 8.6a3 3 0 0 1 5.2-2.3 3.5 3.5 0 0 1 5.9 2.4"/>`
    + `<path d="M17.6 19.4a3.8 3.8 0 0 0 .1-7.6 5.2 5.2 0 0 0-10.1 1.4 3.3 3.3 0 0 0 .2 6.2z"/>`,
  fog:
    `<path d="M17.4 15.4a3.8 3.8 0 0 0 .1-7.6 5.2 5.2 0 0 0-10.1 1.4 3.3 3.3 0 0 0 .2 6.2z"/>`
    + `<path d="M4.6 18.4h14.8M6.4 21.2h11.2"/>`,
  drizzle: `<path d="${CLOUD}"/><path d="M9.2 20.6v1.4M12.6 21v1.4M16 20.6v1.4"/>`,
  rain: `<path d="${CLOUD}"/><path d="M9 20.2l-1 3M12.6 20.2l-1 3M16.2 20.2l-1 3"/>`,
  'heavy-rain': `<path d="${CLOUD}"/><path d="M7.6 19.8l-1.4 3.4M11 19.8l-1.4 3.4M14.4 19.8l-1.4 3.4M17.8 19.8l-1.4 3.4"/>`,
  showers:
    `<circle cx="8.4" cy="7.4" r="2.7"/><path d="M8.4 2.6v1.5M2.6 7.4h1.5M4 3.6l1.1 1.1M12.8 3.6l-1.1 1.1"/>`
    + `<path d="M17.4 18a3.6 3.6 0 0 0 .1-7.2 5 5 0 0 0-9.7 1.3 3.2 3.2 0 0 0 .2 5.9z"/>`
    + `<path d="M9.6 20.4l-.9 2.6M13 20.4l-.9 2.6M16.4 20.4l-.9 2.6"/>`,
  thunder: `<path d="${CLOUD}"/><path d="M13.4 19.6l-3 4.6h2.6l-1 3.2"/>`,
  snow:
    `<path d="${CLOUD}"/>`
    + `<path d="M8.6 21.2v2M7.7 21.7l1.8 1M9.5 21.7l-1.8 1M15.4 21.2v2M14.5 21.7l1.8 1M16.3 21.7l-1.8 1"/>`,
};

export const WEATHER_ICON_KEYS = Object.keys(WEATHER_ICONS);
export const WEATHER_ICON_FALLBACK = 'partly-cloudy';
