// 出行建議引擎
// 設計原則：
//   1. 毋是共氣象數字換一个講法，是直接予使用者「知影按怎做」。
//   2. 無達到條件的建議就無輸出——無落雨就袂出現雨傘，逐條攏有理由。
//   3. 風險提醒優先度上懸，有風險就共普通建議壓落去。
//   4. 講人話，毋講「相對濕度 75%」這款術語。
//   5. 新竹的場景有新竹的視角：市區為主場，外加山仔、海邊、河湖三款常見的外圍行程。

const round = (v) => (v === null || v === undefined || Number.isNaN(v) ? null : Math.round(v));
const num = (v) => (typeof v === 'number' && !Number.isNaN(v) ? v : null);

/* ------------------------------------------------------------------ */
/* 基礎換算                                                            */
/* ------------------------------------------------------------------ */

// 蒲福風級（km/h → 0～12 級）
const BEAUFORT_MIN = [1, 6, 12, 20, 29, 39, 50, 62, 75, 89, 103, 118];
const BEAUFORT_WORD = [
  '無風', '軟風', '輕風', '微風', '和風', '清風',
  '強風', '疾風', '大風', '烈風', '狂風', '暴風', '颶風',
];

export const beaufort = (kmh) => {
  const v = num(kmh);
  if (v === null) return null;
  let n = 0;
  for (const t of BEAUFORT_MIN) if (v >= t) n += 1;
  return n;
};

export const windText = (kmh) => {
  const lv = beaufort(kmh);
  return lv === null ? '' : `${BEAUFORT_WORD[lv]}（${lv} 級）`;
};

// 紫外線
export const uvInfo = (uv) => {
  const raw = num(uv);
  if (raw === null) return null;
  const v = Math.round(raw);
  if (v <= 2) return { value: v, label: '弱', tone: 'ok' };
  if (v <= 5) return { value: v, label: '中等', tone: 'ok' };
  if (v <= 7) return { value: v, label: '強', tone: 'warn' };
  if (v <= 10) return { value: v, label: '過量', tone: 'alert' };
  return { value: v, label: '極高', tone: 'alert' };
};

// 濕度講人話
export const humidityText = (h, temp) => {
  const v = num(h);
  if (v === null) return '';
  const t = num(temp) ?? 25;
  if (v >= 85) return t >= 28 ? '黏稠，汗袂乾' : '真濕';
  if (v >= 75) return t >= 28 ? '濕悶' : '略仔濕';
  if (v >= 55) return '拄好';
  if (v >= 40) return '較焦';
  return '真焦';
};

/* ------------------------------------------------------------------ */
/* WMO 天氣代碼分類                                                    */
/* ------------------------------------------------------------------ */
export const isDrizzle = (c) => c >= 51 && c <= 57;
export const isRain = (c) => (c >= 61 && c <= 67) || (c >= 80 && c <= 82);
export const isHeavyRainCode = (c) => c === 65 || c === 67 || c === 82;
export const isSnow = (c) => c >= 71 && c <= 77 || c === 85 || c === 86;
export const isThunder = (c) => c >= 95;
export const isFog = (c) => c === 45 || c === 48;

/* ------------------------------------------------------------------ */
/* 遊憩場景（新竹在地的四種場景）                                       */
/* ------------------------------------------------------------------ */
export const SCENES = [
  {
    id: 'urban',
    badge: '城',
    name: '城市人文',
    tailo: 'Siânn-tshī jîn-bûn',
    places: '城隍廟、竹塹舊城、中山路佮北門街、中央市場、東門城',
    note: '遮是本站的主場。以行路為主，沿路有騎樓、崁頂、市場佮便利商店，是雨天佮熱天最好的緩衝。',
    elevation: 20,
  },
  {
    id: 'hill',
    badge: '山',
    name: '山仔佮步道',
    tailo: 'Suann-á',
    places: '十八尖山、青草湖步道、高峰植物園',
    note: '海拔無懸（約 100～150 公尺），毋過樹影濟、風較透、落雨了路面滑，佮市區是完全無仝的條件。',
    elevation: 130,
  },
  {
    id: 'coast',
    badge: '海',
    name: '海邊佮海港',
    tailo: 'Hái-kînn',
    places: '南寮漁港、香山濕地、十七公里海岸線',
    note: '新竹的海是沙岸佮濕地，無崁頂、無影蔭閣風透，日頭佮風雨的影響攏比市區明顯。',
  },
  {
    id: 'water',
    badge: '水',
    name: '河佮湖',
    tailo: 'Hô kah ôo',
    places: '護城河、青草湖、頭前溪水岸',
    note: '市區的水域主要是散步、看景佮觀察生態，毋是落水游泳的所在。',
  },
];

const LEVEL_LABEL = {
  good: '適合',
  ok: '會使去',
  caution: '愛斟酌',
  avoid: '無建議',
};

const scene = (base, level, text, tips = []) => ({
  ...base,
  level,
  levelLabel: LEVEL_LABEL[level],
  text,
  tips,
});

/* ------------------------------------------------------------------ */
/* 主引擎                                                              */
/* ------------------------------------------------------------------ */
export function buildAdvice({ current = {}, hourly = [], daily = [], air = null, marine = null } = {}) {
  const today = daily[0] ?? {};
  const next12 = hourly.slice(0, 12);
  const next24 = hourly.slice(0, 24);

  /* ---- 收斂成一組有意義的數值 ---- */
  const peakProb = Math.max(
    num(today.precipProbMax) ?? 0,
    ...next12.map((h) => num(h.precipProb) ?? 0)
  );
  const peakHourPrecip = next24.reduce((a, h) => Math.max(a, num(h.precip) ?? 0), 0);
  const rainSum = num(today.precipSum) ?? 0;
  const rainHours = next24.filter((h) => (num(h.precip) ?? 0) >= 0.5).length;

  const codes = [today.code, ...next24.map((h) => h.code)]
    .filter((c) => c !== null && c !== undefined);
  const hasThunder = codes.some(isThunder);
  const hasHeavy = codes.some(isHeavyRainCode) || peakHourPrecip >= 10 || rainSum >= 40;
  const hasRain = codes.some(isRain) || rainSum >= 5;
  const hasDrizzle = codes.some(isDrizzle);
  const hasFog = codes.some(isFog);
  const hasSnow = codes.some(isSnow);

  const windKmh = num(today.windMax) ?? num(current.wind);
  const gustKmh = num(today.gustMax) ?? num(current.gust);
  const wl = beaufort(windKmh);
  const gl = beaufort(gustKmh);
  const worstWind = Math.max(wl ?? 0, gl ?? 0);

  const uv = uvInfo(today.uvMax);
  const tMax = num(today.tMax) ?? num(current.temp);
  const tMin = num(today.tMin);
  const feelsMax = num(today.feelsMax) ?? num(current.feels);
  const feelsMin = num(today.feelsMin);
  const diurnal = tMax !== null && tMin !== null ? tMax - tMin : null;

  const month = Number(String(today.date ?? '').slice(5, 7)) || 0;
  const isMeiyu = month >= 5 && month <= 6;
  const isTyphoonSeason = month >= 6 && month <= 10;
  const isMonsoonSeason = month >= 10 || month <= 3;

  /* ------------------------------------------------------------------ */
  /* 一、風險提醒（優先度上懸，有才顯示）                                 */
  /* ------------------------------------------------------------------ */
  const risk = [];

  if (hasThunder) {
    risk.push({
      tone: 'alert',
      icon: '雷',
      title: '有雷陣雨',
      text: '拍雷的時陣，山仔、海邊、溪仔邊攏莫去；嘛莫踮樹仔跤、涼亭、電火柱抑釣魚枋邊仔覕雨。'
        + '減講手機仔，離金屬的欄杆遠咧。室內的行程較妥當。',
    });
  }

  if (hasHeavy) {
    risk.push({
      tone: 'alert',
      icon: '雨',
      title: '雨勢粗，會積水',
      text: `未來 24 點鐘的雨量上看 ${round(rainSum)} 公釐。山谷、低窪、地下道、溪仔邊佮海邊攏愛閃；`
        + '戶外的行程建議延期。雨傘換雨幔，風大時長柄傘會開花。',
    });
  }

  if (worstWind >= 7) {
    risk.push({
      tone: 'alert',
      icon: '風',
      title: `${BEAUFORT_WORD[worstWind]}，${worstWind} 級風`,
      text: `陣風上大 ${round(gustKmh)} km/h。離廣告牌、工地圍籬、吊佇壁頂的物件、海邊的礁石佮堤防遠咧；`
        + '騎機車、自行車放慢速度，港邊佮海邊暫時莫去。',
    });
  }

  if (tMax !== null && tMax >= 35) {
    risk.push({
      tone: 'alert',
      icon: '熱',
      title: `高溫 ${round(tMax)} °C`,
      text: '這種溫度佇戶外活動有熱傷害的危險。行程排早暗二段，中晝揣有冷氣的所在；'
        + '若感覺頭眩、想欲吐、皮膚熱煞無流汗，愛緊降溫、補水，無好轉就看醫生。',
    });
  }

  if (tMax !== null && tMax <= 10) {
    risk.push({
      tone: 'alert',
      icon: '寒',
      title: `低溫 ${round(tMax)} °C`,
      text: '寒流的天氣，有風的時陣體感會閣較低。有心血管疾病的序大人佮囡仔愛特別注意，'
        + '暗時莫佇外口躉傷久，尤其是有風的廟埕佮港邊。',
    });
  }

  if (hasFog) {
    risk.push({
      tone: 'warn',
      icon: '霧',
      title: '有霧，能見度差',
      text: '山仔佮海邊看無景，欲翕相、看日頭落海攏會落空。開車開霧燈、放慢速度、保持車距；'
        + '有呼吸道問題的人加戴口罩。',
    });
  }

  if (hasSnow) {
    risk.push({
      tone: 'warn',
      icon: '雪',
      title: '山區有落雪的可能',
      text: '新竹的低海拔山區落雪真罕得，若拄著，路面的冰會予人滑倒，車輛無雪鍊毋通上山。',
    });
  }

  if (air?.level && (air.level.tone === 'warn' || air.level.tone === 'alert')) {
    risk.push({
      tone: air.level.tone === 'alert' ? 'alert' : 'warn',
      icon: '氣',
      title: `空氣品質${air.level.label}`,
      text: `AQI ${air.aqi}，PM2.5 ${round(air.pm25) ?? '—'} μg/m³。`
        + '哮喘、心臟病、囡仔佮序大人減少佇外口的時間，出門加戴口罩；'
        + '運動欲做，改佇室內。',
    });
  }

  /* ------------------------------------------------------------------ */
  /* 二、出行穿搭                                                        */
  /* ------------------------------------------------------------------ */
  const dress = [];

  if (feelsMax !== null && feelsMax >= 33) {
    dress.push({
      title: '穿輕、穿透、穿淺色',
      text: `日時上懸 ${round(tMax)} °C、體感 ${round(feelsMax)} °C。棉仔、麻仔、排汗衫這款通風的布料上好；`
        + '淺色較無吸熱，闊擺的衫會當共汗收予焦。',
    });
  } else if (feelsMax !== null && feelsMax >= 27) {
    dress.push({
      title: '短袖就夠',
      text: `日時體感 ${round(feelsMax)} °C。穿短袖較輸服，毋過廟宇室內、有冷氣的店家會涼，`
        + '紮一領薄仔佇揹仔內底無妨。',
    });
  } else if (tMax !== null && tMax >= 20) {
    dress.push({
      title: '薄長袖抑短袖加一領薄仔',
      text: `日時 ${round(tMin)}～${round(tMax)} °C，穿一層薄仔上拄好，行路行甲會熱的時陣通剝起來。`,
    });
  } else if (tMax !== null && tMax >= 15) {
    dress.push({
      title: '穿一領有領的薄外套',
      text: `日時 ${round(tMin)}～${round(tMax)} °C，有領的衫會擋風；遮的涼是「風冷」，袂輸溫度數字遐爾冷煞閣較有感。`,
    });
  } else if (tMax !== null) {
    dress.push({
      title: '穿予飽，一層一層來',
      text: `日時上懸干焦 ${round(tMax)} °C。內底排汗衫、中外國衫、外口防風外套，`
        + '入去有冷氣的店抑廟內才袂流汗。',
    });
  }

  if (wl !== null && wl >= 5) {
    dress.push({
      title: '穿會擋風的衫，帽仔縛予牢',
      text: `${BEAUFORT_WORD[wl]}（${wl} 級）的風吹過來，衫擺會飛、帽仔會走去。`
        + '闊擺的長裙、輕飄飄的絲巾較無適合；頭毛長的人紮起來較利便。',
    });
  }

  if (diurnal !== null && diurnal > 8) {
    dress.push({
      title: `日夜溫差 ${round(diurnal)} °C，愛紮一領外套`,
      text: '透早佮暗時的溫度落差大，建議「一層一層」穿，行入去、行出來攏好加減，'
        + '毋免一領穿到底。',
    });
  }

  if (hasRain || hasHeavy || hasDrizzle || peakProb >= 60) {
    dress.push({
      title: '穿袂驚沃的鞋仔',
      text: '布鞋、帆布鞋沃著會規工塞塞，涼鞋抑有防潑水的鞋仔較好用；'
        + '褲擺莫傷長，雨水會順咧褲跤爬起來。',
    });
  }

  if (feelsMin !== null && feelsMin <= 15) {
    dress.push({
      title: '暗時愛加一領',
      text: `暗時的體感干焦 ${round(feelsMin)} °C。出夜市、等車的時陣，`
        + '加一領外套抑一條圍巾，差別真大。',
    });
  }

  if (tMax !== null && tMax >= 30 && (num(current.humidity) ?? 0) >= 75) {
    dress.push({
      title: '揀排汗、會當代換的衫',
      text: '高溫兼濕悶，行一輪就規身軀汗。揀排汗的材料，抑紮一領替換的衫佇揹仔內底，'
        + '入去有冷氣的所在才換起來，較袂感冒。',
    });
  }

  /* ------------------------------------------------------------------ */
  /* 三、遊玩安排                                                        */
  /* ------------------------------------------------------------------ */
  const plan = [];

  if (hasThunder) {
    plan.push({
      title: '改室內為主，戶外的行程改期',
      text: '雷陣雨來得快、落得雄。廟宇內部、中央市場、玻璃工藝博物館、'
        + '影像博物館這款的室內景點優先；山仔佮海邊今日攏莫去。',
    });
  } else if (hasHeavy) {
    plan.push({
      title: '戶外的行程建議延期',
      text: '雨落粗，山仔、海邊、溪仔邊攏無適合。改走廟埕的崁頂、市場內底佮有座位的老店，'
        + '等雨較歇才出去外口。',
    });
  } else if (peakProb >= 60) {
    plan.push({
      title: '帶雨具，排一个室內的備案',
      text: `未來 12 點鐘的降水機率上懸 ${round(peakProb)}%。機率過六成不代表一定會落，`
        + '毋過建議共行程排做「室內外各一半」，拄著雨就有位通換。',
    });
  } else if (hasDrizzle || peakProb >= 40) {
    plan.push({
      title: '會使照原訂的計畫行，加帶一支輕便的傘',
      text: `降水機率約 ${round(peakProb)}%，雨量無大，主要是路面較溼滑，行路斟酌一下就好。`,
    });
  }

  if (tMax !== null && tMax >= 33) {
    plan.push({
      title: '行程排早暗二段',
      text: '正午 11～15 點是上熱、紫外線上強的時陣。戶外排早起 10 點前佮下晡 4 點後，'
        + '中晝揣有冷氣的所在歇睏，抑轉去蹛的所在睏一下中晝。',
    });
  }

  if (tMax !== null && tMax <= 15) {
    plan.push({
      title: '排室內景點佮暖食',
      text: '低溫的日子，行程以室內為主，順紲安排熱湯、羹湯、燒麻糬這款暖食。'
        + '戶外的散步縮短，逐站揣有厝頂的所在歇。',
    });
  }

  if (wl !== null && wl >= 5) {
    plan.push({
      title: '港邊佮海邊的行程看情況',
      text: `${BEAUFORT_WORD[wl]}（${wl} 級）的風，海邊佮港邊會閣較透，走起來會誠辛苦。`
        + '會使考慮換期；欲去的人穿有領的外套、帽仔縛牢，離消波塊佮礁石遠咧。',
    });
  }

  if (uv && uv.value >= 6) {
    plan.push({
      title: '閃開日頭上強的時段',
      text: `紫外線${uv.label}（${uv.value}）。戶外的活動逐 40～60 分鐘就揣影蔭歇一下，`
        + '帽子、目鏡、防曬愛傳予好。',
    });
  }

  if (hasFog) {
    plan.push({
      title: '看景的行程換期',
      text: '霧天看山看海攏無景，換做市區的室內景點較有價值，嘛較安全。',
    });
  }

  if (isMeiyu) {
    plan.push({
      title: '梅雨季，備案逐工攏愛傳',
      text: '5～6 月是梅雨，落雨的時間長、範圍闊，有時陣霖規工。'
        + '雨具、防水袋、室內的備案請當做逐工的標準配備。',
    });
  }

  if (isMonsoonSeason && wl !== null && wl >= 4) {
    plan.push({
      title: '九降風的季節',
      text: '新竹秋冬的東北季風（地方叫「九降風」）風透、濕度低。遮的冷是風冷，'
        + '防風的外套比「厚」的外套有效；米粉、烏魚子這款的曝曬產業，嘛是靠這陣風。',
    });
  }

  if (isTyphoonSeason && worstWind >= 6) {
    plan.push({
      title: '颱風季，愛看官方警戒',
      text: '6～10 月是颱風季。海上的警報、陸上的警戒佮停班停課，請看交通部中央氣象署'
        + '佮新竹市政府的發布為準，嘛請看主辦單位的活動公告。',
    });
  }

  // 正向建議（條件通通無問題，才講好話）
  const peaceful = !hasThunder && !hasHeavy && !hasFog && peakProb < 40
    && (tMax === null || tMax < 33) && (worstWind < 5);
  if (peaceful) {
    plan.push({
      title: '戶外的行程無問題',
      text: '無特別的雨、風抑是高溫。市區散步、護城河邊仔、十八尖山、'
        + '抑海邊看日頭落海攏會使，行程排較闊淡嘛無妨。',
    });
  }

  if (!hasRain && !hasThunder && (today.code === 3 || today.code === 2)) {
    plan.push({
      title: '翕相的好日',
      text: '陰天的光線軟、無強影，翕廟宇的細部、龍柱、藻井佮街景上好看，'
        + '人像嘛較袂有面腔的影。',
    });
  }

  if ((today.code === 0 || today.code === 1) && !hasRain) {
    plan.push({
      title: '適合看日出、日落',
      text: `日頭 ${today.sunrise ?? '—'} 出來、${today.sunset ?? '—'} 落山。`
        + '欲看海邊的落日，愛提早 30 分鐘到位揣位；轉來的時陣包一寡燒的食。',
    });
  }

  /* ------------------------------------------------------------------ */
  /* 四、隨身物品（逐項有理由，無需要就無出現）                           */
  /* ------------------------------------------------------------------ */
  const pack = [];
  const addPack = (label, why) => {
    if (!pack.some((p) => p.label === label)) pack.push({ label, why });
  };

  if (hasHeavy && wl !== null && wl >= 5) {
    addPack('雨幔（莫帶長柄傘）', '雨粗兼風大，長柄傘會開花兼挵著人');
  } else if (hasRain || hasHeavy || hasThunder) {
    addPack('摺傘', '已經有雨，會使隨時開');
  } else if (peakProb >= 60) {
    addPack('摺傘抑輕便雨幔', `降水機率 ${round(peakProb)}%，落雨的機會大`);
  } else if (peakProb >= 40 || hasDrizzle) {
    addPack('一支輕便的傘', `降水機率 ${round(peakProb)}%，以備不時之需`);
  }

  if (uv && uv.value >= 3) addPack('防曬', `紫外線${uv.label}`);
  if (uv && uv.value >= 6) {
    addPack('帽仔', '遮頭殼佮面，比干焦抹防曬較實在');
    addPack('日頭目鏡', '減日頭直射目睭');
  }

  if (tMax !== null && tMax >= 30) addPack('水壺，定時啉水', '熱天行路流汗濟');
  if (feelsMax !== null && feelsMax >= 33) {
    addPack('鹽糖抑電解質飲', '流汗流失的毋干焦水');
  }

  if (diurnal !== null && diurnal > 8) addPack('薄外套', `日夜溫差 ${round(diurnal)} °C`);
  else if (feelsMin !== null && feelsMin <= 18) addPack('薄外套', '暗時會涼');

  if (tMax !== null && tMax <= 15) {
    addPack('厚外套', '低溫');
    addPack('圍巾抑手套', '風共溫度吹落來，頸佮手上會凍');
  }

  if (wl !== null && wl >= 5) addPack('縛頭毛的索仔抑有帶的帽仔', '風大，物件會飛走');

  if (hasFog) addPack('口罩', '霧中加減阻擋水氣佮廢氣');
  else if (air?.level && air.level.tone !== 'ok') addPack('口罩', `空品${air.level.label}`);

  if (hasRain || hasHeavy) addPack('防水袋抑夾鏈袋', '共手機仔、票券佮衛生紙囥予好');

  if (tMax !== null && tMax <= 18) addPack('燒的啉的', '寒天等車、行路的時陣足有用');

  // 新竹夜市的基本配備（固定）
  addPack('現金佮零錢', '廟口的固定擔仔較濟收現金，零錢揣錢較緊');
  addPack('健保卡佮平常用的藥仔', '以備不時之需');
  addPack('環保餐具抑環保杯', '減用一擺性的物件，嘛較好𤆬');

  /* ------------------------------------------------------------------ */
  /* 五、逐場景的判斷                                                    */
  /* ------------------------------------------------------------------ */
  const scenes = [];

  // 城市人文
  {
    const base = SCENES[0];
    if (hasThunder) {
      scenes.push(scene(base, 'caution',
        '有雷。市區的騎樓、廟埕崁頂佮市場內底是相對安全的所在，陣雨來得快，行程排鬆淡咧。',
        ['雷雨的時陣踮厝內抑店內，等雷聲停了才出去。']));
    } else if (hasHeavy) {
      scenes.push(scene(base, 'ok',
        `雨落 ${round(rainSum)} 公釐，路面會積水。毋過市區有崁頂、有厝頂、有便利商店，是上好的雨備。`,
        ['鞋仔愛防水，褲跤莫傷長。', '廟埕的攤仔會視雨勢收，欲食的先看有開無。']));
    } else if (peakProb >= 60) {
      scenes.push(scene(base, 'good',
        '有落雨的可能，毋過市區的室內備案濟，影響有限，會使照常行。',
        ['帶一支摺傘。', '中央市場、東門市場遮攏有厝頂。']));
    } else if (tMax !== null && tMax >= 33) {
      scenes.push(scene(base, 'caution',
        `日時 ${round(tMax)} °C，遮的街仔路無影蔭，正午行路會足辛苦。`,
        ['排一个冷氣的歇睏點，看是便利商店抑百貨。', '補水愛準時。']));
    } else {
      scenes.push(scene(base, 'good',
        '今仔日的條件走市區上妥當：氣溫佮風雨攏無特別的狀況。',
        ['會使安排半日抑全日的舊城路線（見「𨑨迌路線」）。']));
    }
  }

  // 山仔佮步道
  {
    const base = SCENES[1];
    const hillGust = gustKmh !== null ? gustKmh * 1.3 : null;
    const hillTempMax = tMax !== null ? tMax - 1 : null;
    const hillWl = beaufort(hillGust) ?? wl;
    const facts = [
      hillTempMax !== null ? `山頂的溫度比市區約低 1 °C（${round(hillTempMax)} °C 左右）` : null,
      hillGust !== null ? `山頂的風比市區較透，陣風約 ${round(hillGust)} km/h` : null,
    ].filter(Boolean);

    if (hasThunder) {
      scenes.push(scene(base, 'avoid',
        '有雷，山頂的樹仔跤、涼亭佮開闊的稜線攏無安全，今仔日莫上山。',
        ['雷停了、天氣穩定了才閣安排。']));
    } else if (hasHeavy || rainSum >= 40) {
      scenes.push(scene(base, 'avoid',
        `雨量 ${round(rainSum)} 公釐。山仔的路會變成爛土抑水路，有滑倒、落石的山路的危險，今仔日無建議。`,
        ['等雨停了、路焦了一日以上才閣去。']));
    } else if (hillWl !== null && hillWl >= 7) {
      scenes.push(scene(base, 'avoid',
        `${BEAUFORT_WORD[hillWl]}（${hillWl} 級）。山頂無物件擋風，企袂在，樹仔跤嘛可能有落枝。`,
        ['改去市區抑室內的行程。']));
    } else if (peakProb >= 60 || hasDrizzle || rainSum >= 10) {
      scenes.push(scene(base, 'caution',
        '有雨的可能，步道的石仔、柴棧道佮落葉會滑，一步一步踏予穩。',
        ['穿有咬地的鞋仔，會使帶一支行山枴抑雨傘仔做點。', ...facts]));
    } else if (uv && uv.value >= 8) {
      scenes.push(scene(base, 'caution',
        `紫外線${uv.label}（${uv.value}），樹影擋無著的路段足咬皮。`,
        ['早起 10 點前上山，中晝前落山。', '帽仔、防曬、水壺愛傳。', ...facts]));
    } else if (tMax !== null && tMax >= 32) {
      scenes.push(scene(base, 'caution',
        `市區 ${round(tMax)} °C，行上山會流一輪汗。`,
        ['排早起抑下晡 4 點後。', '半路揣影蔭歇一下。', ...facts]));
    } else {
      scenes.push(scene(base, 'good',
        '今仔日適合上山：無雨、風無傷透、溫度嘛拄好。',
        ['早起的人有機會看著起霧抑雲海，欲翕相的人愛早起來。', ...facts]));
    }
  }

  // 海邊佮海港
  {
    const base = SCENES[2];
    const wave = num(marine?.waveHeight);
    const seaTemp = num(marine?.seaTemp);
    const tide = marine?.tide ?? null;
    const facts = [];
    if (wave !== null) facts.push(`海面的浪高約 ${wave.toFixed(1)} 公尺`);
    if (seaTemp !== null) facts.push(`海水溫度約 ${round(seaTemp)} °C`);
    if (wl !== null) facts.push(`陸上的風是 ${BEAUFORT_WORD[wl]}（${wl} 級）`);
    if (tide?.nextLow?.time) facts.push(`後一个退潮是 ${tide.nextLow.time}`);
    if (tide?.nextHigh?.time) facts.push(`後一个漲潮是 ${tide.nextHigh.time}`);

    const seaTips = [];
    if (tide?.nextHigh?.time) {
      seaTips.push(`趕海愛算時間：退潮前後 1～2 點鐘上適合近水看生態，${tide.nextHigh.time} 開始漲潮就愛退到較懸的所在。`);
    }
    if (wave !== null && wave >= 1.0) {
      seaTips.push('消波塊、礁石頂別去踏，浪拍起來會共人絞落海。');
    }
    if (uv && uv.value >= 6) seaTips.push('海邊無影蔭，日頭落來毋但直射，海水閣會反光，防曬愛抹厚咧。');
    if (seaTemp !== null && seaTemp < 23) {
      seaTips.push(`海水 ${round(seaTemp)} °C，落水會冷，囡仔佮序大人毋通落水傷久。`);
    }

    if (hasThunder) {
      scenes.push(scene(base, 'avoid', '有雷。海邊遮無物件擋，人佇沙埔佮濕地頂懸是上危險的標的，今仔日莫去。',
        ['拍雷的時陣離水岸愈遠愈好。']));
    } else if (wave !== null && wave >= 1.5) {
      scenes.push(scene(base, 'avoid',
        `浪高 ${wave.toFixed(1)} 公尺，這个浪是「會共人拖落去」的等級。看海足好看，毋過今仔日莫倚水。`,
        ['風颺的時陣濺起來的水花嘛會沃規身軀。', ...facts]));
    } else if (worstWind >= 7) {
      scenes.push(scene(base, 'avoid',
        `${BEAUFORT_WORD[worstWind]}（${worstWind} 級）。新竹的海邊無崁頂、無屏障，風比市區閣較強一級。`,
        ['改期，抑佇市區的室內景點。']));
    } else if ((wave !== null && wave >= 1.0) || hasHeavy) {
      scenes.push(scene(base, 'caution',
        '浪抑雨較大，欲去的話干焦佇觀景平台、漁港的步道遮，毋通行落去沙埔。',
        ['結伴，莫家己一个去。', ...seaTips, ...facts]));
    } else if (peakProb >= 60) {
      scenes.push(scene(base, 'caution',
        '有落雨的可能。海邊無厝頂，雨幔比傘好用。',
        ['雨落起來遮無位通覕。', ...facts]));
    } else if (worstWind >= 5) {
      scenes.push(scene(base, 'ok',
        '風有較透，毋過無雨、浪嘛無大。欲看日頭落海是會使，毋過會較冷。',
        ['穿有領的外套、帽仔縛牢。', ...seaTips, ...facts]));
    } else {
      scenes.push(scene(base, 'good',
        '今仔日海邊的條件無差，適合看海、散步、看日頭落海。',
        ['香山濕地的泥塗會黏鞋，穿好清的鞋仔。', ...seaTips, ...facts]));
    }
  }

  // 河佮湖
  {
    const base = SCENES[3];
    const facts = [];
    if (rainSum > 0) facts.push(`今仔日的雨量約 ${round(rainSum)} 公釐`);

    if (hasThunder) {
      scenes.push(scene(base, 'avoid',
        '拍雷的時陣，水岸佮親水階梯是上愛閃的所在，大樹跤嘛是。',
        ['等雷停了才閣去散步。']));
    } else if (rainSum >= 50) {
      scenes.push(scene(base, 'caution',
        `雨量 ${round(rainSum)} 公釐，水位會起、水會濁，親水的階梯頭前會滑。`,
        ['行上懸的步道，莫踏落去階梯。', ...facts]));
    } else if (peakProb >= 60 || hasDrizzle) {
      scenes.push(scene(base, 'ok',
        '岸邊的石仔佮柴步道有形，落雨天會滑。',
        ['行路較斟酌，會使帶一支摺傘。']));
    } else if (tMax !== null && tMax >= 33) {
      scenes.push(scene(base, 'ok',
        `日時 ${round(tMax)} °C，水岸邊仔較有風，比街仔路輸服，毋過猶原愛防曬。`,
        ['早起抑黃昏去較妥當。']));
    } else {
      scenes.push(scene(base, 'good',
        '護城河、青草湖這款的所在，今仔日散步、看鳥仔攏會使。',
        ['落水游泳、釣魚佮放生這款的行為佇市區水域攏無適合。']));
    }
    scenes[scenes.length - 1].tips.push('觀察生態的時陣，莫飼、莫掠、莫佮野生動物傷倚。');
  }

  /* ------------------------------------------------------------------ */
  /* 六、一句話結論                                                      */
  /* ------------------------------------------------------------------ */
  let headline;
  if (hasThunder) headline = { tone: 'alert', text: '今仔日有雷陣雨，戶外的行程改期抑改做室內。' };
  else if (hasHeavy) headline = { tone: 'alert', text: '今仔日雨落粗，山仔、海邊、溪仔邊攏莫去。' };
  else if (worstWind >= 7) headline = { tone: 'alert', text: `今仔日風有夠透（${worstWind} 級），海邊佮山頂暫且莫去。` };
  else if (tMax !== null && tMax >= 35) headline = { tone: 'alert', text: '今仔日高溫，行程排早暗二段，中晝蹛室內。' };
  else if (tMax !== null && tMax <= 10) headline = { tone: 'alert', text: '今仔日真寒，穿予飽、帽仔圍巾傳予好。' };
  else if (peakProb >= 60) headline = { tone: 'warn', text: '今仔日有落雨的可能，帶雨具、留一个室內的備案。' };
  else if (uv && uv.value >= 6) headline = { tone: 'warn', text: '今仔日天清，紫外線強，防曬愛傳予好。' };
  else if (worstWind >= 5) headline = { tone: 'ok', text: '今仔日風較透，外套穿一領，騎車放慢速度。' };
  else headline = { tone: 'ok', text: '今仔日的天氣穩當，會使照原訂的計畫行。' };

  /* ------------------------------------------------------------------ */
  /* 七、給介面用的補充數值                                              */
  /* ------------------------------------------------------------------ */
  const metrics = {
    windLevel: wl,
    windLevelWord: wl === null ? '' : BEAUFORT_WORD[wl],
    windLevelText: wl === null ? '' : `${BEAUFORT_WORD[wl]} ${wl} 級`,
    gustLevel: gl,
    gustLevelText: gl === null ? '' : `${BEAUFORT_WORD[gl]} ${gl} 級`,
    humidityText: humidityText(current.humidity, current.temp),
    uv,
    diurnal,
    rainHours,
    peakProb,
    rainSum,
    seaTemp: num(marine?.seaTemp),
    waveHeight: num(marine?.waveHeight),
    tide: marine?.tide ?? null,
  };

  return { headline, risk, dress, plan, pack, scenes, metrics };
}
