// 全站共用資料（純靜態，無資料庫）
// 台語版本：漢字為主，重要詞彙加台羅（Tâi-lô）註記

export const site = {
  name: '新竹城隍廟夜市指南',
  nameTailo: 'Sin-tik Sîng-hông-biō Iā-tshī',
  tagline: '廟口食食、夜市地圖、交通停車佮舊城𨑨迌',
  taglineShort: '頭一擺來，按呢食、按呢𨑨迌',
  address: '新竹市北區中山路 75 號',
  domain: 'hsinchuchenghuang.com',
  url: 'https://hsinchuchenghuang.com',
  mapsShareUrl: 'https://maps.app.goo.gl/azQeBYAdgZFypey99',
  mapsUrl: 'https://www.google.com/maps/place/%E5%9F%8E%E9%9A%8D%E5%BA%99%E5%A4%9C%E5%B8%82/@24.8043858,120.9630305,17z/data=!3m1!4b1!4m6!3m5!1s0x346835c010543a25:0xc06a66d03f2eecd!8m2!3d24.804381!4d120.9656054!16s%2Fg%2F1v1tktyt',
  mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.739240562118!2d120.9656054!3d24.804381000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346835c010543a25%3A0xc06a66d03f2eecd!2z5Z-O6ZqN5bqZ5aSc5biC!5e0!3m2!1szh-CN!2stw!4v1784622540038!5m2!1szh-CN!2stw',
};

// 主選單（桌面版主要項目）
export const nav = [
  { href: '/first-visit/', label: '頭一擺來' },
  { href: '/food/', label: '夜市食食' },
  { href: '/map/', label: '夜市地圖' },
  { href: '/routes/', label: '𨑨迌路線' },
  { href: '/transport/', label: '交通停車' },
  { href: '/temple/', label: '城隍廟導覽' },
  { href: '/nearby/', label: '附近景點' },
  { href: '/services/', label: '實用資訊' },
];

// 頁尾完整站內地圖（桌機主選單放無落去的頁面，攏佇遮）
export const footerNav = [
  {
    title: '出發進前',
    links: [
      { href: '/first-visit/', label: '頭一擺來按怎𨑨迌' },
      { href: '/weather/', label: '即時天氣佮四季策略' },
      { href: '/services/', label: '訪客服務佮周邊設施' },
      { href: '/transport/', label: '交通佮停車' },
      { href: '/map/', label: '夜市導覽地圖' },
    ],
  },
  {
    title: '食佮路線',
    links: [
      { href: '/food/', label: '廟口美食總覽' },
      { href: '/routes/', label: '按時間佮人群揀路線' },
      { href: '/nearby/', label: '附近景點' },
    ],
  },
  {
    title: '文化佮深度',
    links: [
      { href: '/temple/', label: '城隍廟參觀指南' },
      { href: '/history/', label: '竹塹舊城佮城隍廟的來歷' },
      { href: '/services/#responsibility', label: '科普佮訪客責任' },
      { href: '/faq/', label: '常見問題' },
      { href: '/about/', label: '關於本站' },
    ],
  },
];

// 手機底部固定四項
export const bottomNav = [
  { href: '/', label: '頭頁', icon: 'home' },
  { href: '/food/', label: '食食', icon: 'bowl' },
  { href: '/map/', label: '地圖', icon: 'map' },
  { href: '/routes/', label: '路線', icon: 'route' },
];

// 圖片出處（Wikimedia Commons，CC 授權，遵守姓名標示）
export const credits = {
  'temple-day.jpg':    { by: 'Ralff Nestor Nacor', lic: 'CC BY-SA 4.0', src: 'https://commons.wikimedia.org/wiki/File:Hsinchu_City_God_Temple,_Nov_2024.jpg' },
  'temple-night.jpg':  { by: 'Nomad112', lic: 'CC BY-SA 4.0', src: 'https://commons.wikimedia.org/wiki/File:Entrance_building_of_Hsinchu_City_God_Temple_at_night.jpg' },
  'market-night.jpg':  { by: 'Nomad112', lic: 'CC BY-SA 4.0', src: 'https://commons.wikimedia.org/wiki/File:Scene_in_Hsinchu_City_God_Temple_at_night.jpg' },
  'temple-covid.jpg':  { by: 'Jirka Matousek', lic: 'CC BY 2.0', src: 'https://commons.wikimedia.org/wiki/File:Hsinchu_City_God_Temple_20210405.jpg' },
  'temple-facade.jpg': { by: '阿道', lic: 'CC BY-SA 4.0', src: 'https://commons.wikimedia.org/wiki/File:Hsinchu_City_God_Temple-01.2023-11-21.jpg' },
  'temple-arch.jpg':   { by: 'Taiwankengo', lic: 'CC BY-SA 4.0', src: 'https://commons.wikimedia.org/wiki/File:2018_Hsinchu_City_God_Temple_i.jpg' },
  'temple-pailou.jpg': { by: '寺人孟子', lic: 'CC BY-SA 4.0', src: 'https://commons.wikimedia.org/wiki/File:新竹都城隍廟牌樓.jpg' },
  'food-stands.jpg':   { by: 'Trcheng', lic: 'CC BY-SA 1.0', src: 'https://commons.wikimedia.org/wiki/File:Food_stands_around_Hsinchu_City_God_Temple_20040906.jpg' },
  'food-bawan.jpg':    { by: 'Yuriy kosygin', lic: 'CC BY-SA 4.0', src: 'https://commons.wikimedia.org/wiki/File:Hsinchu_Bawan.jpg' },
  'food-gongwan.jpg':  { by: '海瑞摃丸', lic: 'CC BY-SA 4.0', src: 'https://commons.wikimedia.org/wiki/File:海瑞-原味豬肉摃丸湯.jpg' },
  'food-hsinchu.jpg':  { by: 'Trcheng', lic: 'CC BY-SA 1.0', src: 'https://commons.wikimedia.org/wiki/File:Hsinchu_foods.jpg' },
  'food-oyster.jpg':   { by: '黃 zero', lic: 'CC BY-SA 2.0', src: 'https://commons.wikimedia.org/wiki/File:Oyster_omelette_closeup_in_Lukang.jpg' },
  'east-gate.jpg':     { by: 'Ralff Nestor Nacor', lic: 'CC BY-SA 4.0', src: 'https://commons.wikimedia.org/wiki/File:Yin_Hsi_East_Gate,_Hsinchu_City,_Nov_2024.jpg' },
};

// 代表食物（台語漢字 + 台羅）
export const foods = [
  {
    slug: 'rice-noodles', name: '米粉摻摃丸湯', tailo: 'Bí-hún tsham kòng-uân-thng',
    img: 'food-gongwan.jpg', desc: '新竹上出名的組合。米粉幼koh Q，摃丸彈牙食著芳phang。', price: 'NT$50～90',
    share: '一人一碗拄好', tag: '主食',
  },
  {
    slug: 'meatballs', name: '新竹肉圓', tailo: 'Bah-uân',
    img: 'food-bawan.jpg', desc: '外皮軟Q，內底包瘦肉，淋甜鹹醬kap米漿，通配一碗清湯。', price: 'NT$40～60',
    share: '一份通兩人分', tag: '主食',
  },
  {
    slug: 'braised-pork-rice', name: '肉燥飯', tailo: 'Bah-sò-pn̄g',
    img: 'food-hsinchu.jpg', desc: '滷kah入味的肉燥崁佇白飯頂，是廟口上實在的一碗。', price: 'NT$30～50',
    share: '一人一碗', tag: '主食',
  },
  {
    slug: 'oyster-omelet', name: '蚵仔煎', tailo: 'Ô-á-tsian',
    img: 'food-oyster.jpg', desc: '蚵仔、雞卵佮青菜落去煎，淋粉紅色甜辣醬，鹹甜芳。', price: 'NT$60～80',
    share: '一份通兩人分', tag: '小食',
  },
  {
    slug: 'thick-soup', name: '羹湯', tailo: 'Kenn-thng',
    img: 'food-stands.jpg', desc: '魷魚羹、肉羹攏有，湯頭黏滑，透微酸甜，寒天上合。', price: 'NT$50～70',
    share: '一人一碗', tag: '湯',
  },
  {
    slug: 'souvenirs', name: '竹塹餅・伴手', tailo: 'Tik-tshàm-piánn',
    img: 'food-hsinchu.jpg', desc: '新竹傳統糕餅，肉餅、竹塹餅通買轉去做等路（伴手禮）。', price: 'NT$自由',
    share: '買轉去分', tag: '等路',
  },
];

// 路線分組（/routes/ 頁面照 group 分區塊顯示）
export const routeGroups = [
  { id: 'time', name: '按時間揀', desc: '看你有偌濟時間：一點鐘、兩點鐘、半日抑是全日。' },
  { id: 'people', name: '按人群揀', desc: '看你是家己來、兩個人、𤆬囡仔抑是𤆬序大人。' },
  { id: 'condition', name: '按情境揀', desc: '落雨天、想欲翕相、抑是行路較無方便。' },
];

// 路線
export const routes = [
  {
    slug: 'one-hour', group: 'time', name: '一點鐘緊食法', tailo: 'It tiám-tsing',
    duration: '約 60 分', budget: 'NT$150～300／人', walk: '約 400 公尺',
    summary: '時間拗欲趕車，猶原食會著新竹的代表味。',
    steps: ['廟埕食主食（米粉摃丸湯抑是肉圓）', '閣叫一碗羹湯抑是貢丸湯', '揀一項小食（蚵仔煎、潤餅）', '買竹塹餅做等路轉去'],
  },
  {
    slug: 'two-hours', group: 'time', name: '兩點鐘經典路線', tailo: 'Nn̄g tiám-tsing',
    duration: '約 2 點鐘', budget: 'NT$300～600／人', walk: '約 1 公里',
    summary: '頭一擺來上推薦，食佮拜攏顧著。',
    steps: ['城隍廟簡單參拜', '廟埕食主食', '周邊老店小食', '燒麻糬抑是甜點', '北門街散步看老店'],
  },
  {
    slug: 'half-day', group: 'time', name: '半日舊城食旅（通用路線）', tailo: 'Puànn-ji̍t',
    duration: '約 3.5～4 點鐘', budget: 'NT$500～900／人', walk: '約 2.5 公里',
    summary: '上新推薦的通用路線。中晝入廟口食一輪，順紲行過竹塹舊城的城門、護城河佮老街。',
    steps: [
      '台鐵新竹站起行，行中正路入市區',
      '護城河親水公園，沿水岸歇喘',
      '東門城（迎曦門）看竹塹城唯一的城門',
      '城隍廟參拜，看三川殿佮大鐵算盤',
      '廟埕食主食佮小食，中晝食予飽',
      '北門街、中山路舊街散步看老店面',
      '東門市場抑中央市場收尾，買等路',
    ],
  },
  {
    slug: 'full-day', group: 'time', name: '全日新竹食旅（通用路線）', tailo: 'Tsuân-ji̍t',
    duration: '約 7～8 點鐘', budget: 'NT$900～1,600／人', walk: '約 5～6 公里（會使配公車）',
    summary: '一工食透透：早起對舊城開始，中晝佇廟口，下晡接市區景點，暗時轉來夜市食暗頓。',
    steps: [
      '早起：新竹火車站 → 護城河 → 東門城 → 城隍廟',
      '中晝：廟埕主食＋小食，食一輪（見半日路線）',
      '下晝：新竹州廳、北大教堂、舊城區文化景點',
      '接市區玻璃工藝抑影像博物館這款的室內景點',
      '黃昏：十八尖山抑南寮漁港方向看日頭落海',
      '暗頓：轉來城隍廟夜市，食暗時才有開的擔仔',
      '收尾：東門市場抑中央市場買等路轉去',
    ],
  },
  {
    slug: 'two-person-food-walk', group: 'people', name: '兩人分食路線', tailo: 'Nn̄g lâng pun-tsia̍h',
    duration: '約 1.5 點鐘', budget: 'NT$250～450／兩人', walk: '約 800 公尺',
    summary: '兩人來，逐項攏分做兩份，通食著較濟款。',
    steps: ['一碗米粉摃丸湯做開場', '一份肉圓分做兩爿', '一份蚵仔煎鬥一碗羹湯', '甜點燒麻糬收尾'],
  },
  {
    slug: 'family', group: 'people', name: '𤆬囡仔親子路線', tailo: 'Tshuā gín-á',
    duration: '約 2 點鐘', budget: 'NT$400～700／家庭', walk: '約 800 公尺',
    summary: '𤆬囡仔佮序大人。揀好食好坐、口味無siunn重的，行路距離短、隨時有椅仔通歇。',
    steps: [
      '中晝抑下晡早一點仔來，閃開暗時人潮',
      '貢丸湯、肉燥飯、米粉這款囡仔嘛食會落',
      '揀有座位、有冷氣的店家，較袂軁',
      '廟埕看廟宇建築，𤆬囡仔看燕尾厝頂佮石獅',
      '甜點收尾：水蒸蛋糕、燒麻糬',
      '東門城草地佮護城河邊仔踅踅、放囡仔走一下',
    ],
  },
  {
    slug: 'photography', group: 'people', name: '翕相佮舊城觀察路線', tailo: 'Hip-siòng',
    duration: '約 2.5～3 點鐘', budget: 'NT$300～600／人', walk: '約 2 公里',
    summary: '愛翕相、愛看老建築的人。順光、順人流，對早起到正午對暗時攏有無仝的畫面。',
    steps: [
      '早時（8～10 點）：廟埕人少，翕三川殿佮燕尾厝頂的順光面',
      '廟內：藻井、龍柱、石獅、大鐵算盤（尊重參拜的人，莫開閃光燈）',
      '中山路、北門街：翕老店面的字號佮鐵窗花',
      '東門城：翕城門佮護城河的水影',
      '暗時（17:30 了後）：廟口點燈，翕夜市燈火佮人潮',
      '落雨天：廟埕崁頂的光影佮雨傘陣，是無仝的味道',
    ],
  },
  {
    slug: 'accessibility', group: 'condition', name: '低體力佮無障礙路線', tailo: 'Bô-tsiong-gāi',
    duration: '約 1.5 點鐘', budget: 'NT$250～500／人', walk: '約 400 公尺，沿途會當歇',
    summary: '予序大人、行動較無方便、用輪椅抑捌傷過的人。行路短、有電梯抑崁頂、隨時有便所佮椅仔。',
    steps: [
      '坐車直接到中山路邊仔落車，減少行路',
      '先確認便所佮無障礙出入口位置才入去',
      '廟埕小吃區大部分是平路，揀有座位、有靠背的店家',
      '莫行入中央市場內的狹路，改行外圍的騎樓',
      '行程排 2～3 站就好，逐站歇 15～20 分',
      '有需要的話，市區有復康巴士佮無障礙計程車通叫',
    ],
  },
  {
    slug: 'rainy-day', group: 'condition', name: '落雨少行路路線', tailo: 'Lo̍h-hōo',
    duration: '約 1.5 點鐘', budget: 'NT$250～450／人', walk: '較短，攏佇有崁頂',
    summary: '拄著落雨，儘量佇廟埕佮市場內底食，較袂沃著雨。',
    steps: ['直接入廟埕小吃區', '揀有座位的老店坐落來食', '中央市場內底𨑨迌', '欲轉才走去停車場抑車站'],
  },
  {
    slug: 'old-town-walk', group: 'condition', name: '舊城半晡散步', tailo: 'Kū-siânn puànn-poo',
    duration: '約 4 點鐘', budget: 'NT$500～900／人', walk: '約 2.5 公里',
    summary: '共城隍廟夜市鬥東門城、護城河，做一站舊城半日遊。',
    steps: ['新竹火車站起行', '護城河親水公園', '東門城（迎曦門）', '城隍廟夜市食晝', '北門街老店', '東門市場'],
  },
];

// 城隍廟現場五大看點
export const templeHighlights = [
  { name: '三川殿佮三疊式厝頂', desc: '入廟頭一个看點，三層疊起的燕尾厝頂，是廟宇門面。' },
  { name: '八卦藻井', desc: '正殿頂懸的木造藻井，一圈一圈螺旋鬥起來，無用一支釘。' },
  { name: '龍柱、石獅佮雕刻', desc: '石雕龍柱佮門口石獅，看師傅的手路工夫。' },
  { name: '厝樑頂的大鐵算盤', desc: '掛佇樑頂的大算盤，意思是城隍爺teh算人的善惡。' },
  { name: '「金門保障」匾額', desc: '正殿頂懸的古匾，是城隍廟的重要文物。' },
];

// ---------------------------------------------------------------
// SEO 實體綁定（Entity）資料
// 對應「單景點 SEO 實體綁定配置變數表」：域名／全稱／俗稱／地理座標／周邊地標…
// 來源：Google 地圖商家資訊（Chenghuang Temple Night Market）
// ---------------------------------------------------------------
export const entity = {
  // {{ATTRACTION_FULL_NAME}}：官方全稱（華語）
  fullName: '新竹市城隍廟夜市',
  // {{ATTRACTION_FULL_NAME}}（英文）
  fullNameEn: 'Chenghuang Temple Night Market',
  // {{ATTRACTION_SHORT_NAME}}：常用俗稱（對應域名 HsinchuChengHuang）
  shortName: '城隍廟夜市',
  shortNameEn: 'Hsinchu Cheng Huang Night Market',
  // alternateName 別名陣列
  aliases: [
    'Chenghuang Temple Night Market',
    'Hsinchu Cheng Huang Night Market',
    '新竹城隍廟夜市',
    'Sin-tik Sîng-hông-biō Iā-tshī',
  ],
  // {{CITY_NAME}} / {{STATE_PROVINCE}} / {{COUNTRY_NAME}}
  city: '新竹市',
  cityEn: 'Hsinchu City',
  district: '北區',
  stateProvince: '新竹市',
  stateProvinceEn: 'Hsinchu City',
  country: '台灣',
  countryEn: 'Taiwan',
  // {{COUNTRY_CODE_2LETTER}}
  countryCode: 'TW',
  // {{POSTAL_CODE}}
  postalCode: '300',
  streetAddress: '中山路 75 號',
  village: '中央里（Zhongyang Village）',
  streetAddressEn: 'No. 75, Zhongshan Rd, Zhongyang Village, North District',
  // 電話（Google 商家資訊）
  phone: '+886 3 522 3666',
  phoneHref: '+88635223666',
  // Plus Code
  plusCode: 'RX38+Q6 Zhongyang Village, North District, Hsinchu City, Taiwan',
  // {{LATITUDE}} / {{LONGITUDE}}
  latitude: 24.804381,
  longitude: 120.9656054,
  // {{MAPS_SHARE_URL}}
  mapsShareUrl: 'https://maps.app.goo.gl/azQeBYAdgZFypey99',
  // 類別
  category: 'Night market（夜市）',
  // 評分（來源：Google 地圖，2026 年 9 月查核）
  rating: {
    value: 4.3,
    count: 14885,
    best: 5,
    worst: 1,
    source: 'Google 地圖',
    sourceEn: 'Google Maps',
    sourceUrl: 'https://maps.app.goo.gl/azQeBYAdgZFypey99',
    checked: '2026 年 9 月',
    checkedIso: '2026-09-13',
  },
  // {{GOVT_TOURISM_URL}}：當地官方旅遊／廟方權威來源
  tourismUrl: 'https://tourism.hccg.gov.tw/',
  templeOfficialUrl: 'https://www.weiling.org.tw/',
  cityGovUrl: 'https://www.hccg.gov.tw/',
  // {{NEARBY_LANDMARK_1}} / {{NEARBY_LANDMARK_2}}（依距離排序）
  landmarks: [
    '東門城（迎曦門）',
    '護城河親水公園',
    '北門街老店',
    '中央市場',
  ],
};

// ---------------------------------------------------------------
// 資料來源（SourcesSection，強化 E-E-A-T 專業度）
// ---------------------------------------------------------------
export const sources = [
  {
    label: 'Google 地圖・新竹市城隍廟夜市商家資訊',
    url: 'https://maps.app.goo.gl/azQeBYAdgZFypey99',
    note: `評分 ${entity.rating.value} 分、${entity.rating.count.toLocaleString('en-US')} 則評論係 ${entity.rating.source} 公開資訊（${entity.rating.checked}查核）。`,
  },
  {
    label: '新竹市觀光旅遊網（新竹市政府）',
    url: 'https://tourism.hccg.gov.tw/',
    note: '新竹都城隍廟古蹟歷建佮迎曦門（東門城）官方介紹。',
  },
  {
    label: '新竹都城隍廟官方網站',
    url: 'https://www.weiling.org.tw/',
    note: '廟方公告、法會慶典佮交通資訊的權威來源。',
  },
  {
    label: '新竹市政府全球資訊網',
    url: 'https://www.hccg.gov.tw/',
    note: '市政公告、市區公車佮交通管制資訊。',
  },
  {
    label: '交通部中央氣象署・氣候統計資料',
    url: 'https://www.cwa.gov.tw/V8/C/C/Statistics/monthlymean.html',
    note: '本站「四季遊憩策略」的氣溫、雨量、雨日等氣候平均值，攏是照新竹測站的長期氣候統計整理。',
  },
  {
    label: '歐洲中期天氣預報中心（ECMWF）',
    url: 'https://www.ecmwf.int/',
    note: '本站天氣模組的數值天氣預報模式來源之一，資料每點鐘更新一遍。',
  },
  {
    label: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/',
    note: '本站相片來源，依 CC 授權標示作者。',
  },
];
