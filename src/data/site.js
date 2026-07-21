// 全站共用資料（純靜態，無資料庫）
// 台語版本：漢字為主，重要詞彙加台羅（Tâi-lô）註記

export const site = {
  name: '新竹城隍廟夜市指南',
  nameTailo: 'Sin-tik Sîng-hông-biō Iā-tshī',
  tagline: '廟口食食、夜市地圖、交通停車佮舊城𨑨迌',
  taglineShort: '頭一擺來，按呢食、按呢𨑨迌',
  address: '新竹市北區中山路 75 號',
  mapsUrl: 'https://www.google.com/maps/place/%E5%9F%8E%E9%9A%8D%E5%BA%99%E5%A4%9C%E5%B8%82/@24.8043858,120.9630305,17z/data=!3m1!4b1!4m6!3m5!1s0x346835c010543a25:0xc06a66d03f2eecd!8m2!3d24.804381!4d120.9656054!16s%2Fg%2F1v1tktyt',
  mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.739240562118!2d120.9656054!3d24.804381000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346835c010543a25%3A0xc06a66d03f2eecd!2z5Z-O6ZqN5bqZ5aSc5biC!5e0!3m2!1szh-CN!2stw!4v1784622540038!5m2!1szh-CN!2stw',
};

// 主選單（≤7 項）
export const nav = [
  { href: '/first-visit/', label: '頭一擺來' },
  { href: '/food/', label: '夜市食食' },
  { href: '/map/', label: '夜市地圖' },
  { href: '/routes/', label: '𨑨迌路線' },
  { href: '/transport/', label: '交通停車' },
  { href: '/temple/', label: '城隍廟導覽' },
  { href: '/nearby/', label: '附近景點' },
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

// 路線
export const routes = [
  {
    slug: 'one-hour', name: '一點鐘緊食法', tailo: 'It tiám-tsing',
    duration: '約 60 分', budget: 'NT$150～300／人', walk: '約 400 公尺',
    summary: '時間拗欲趕車，猶原食會著新竹的代表味。',
    steps: ['廟埕食主食（米粉摃丸湯抑是肉圓）', '閣叫一碗羹湯抑是貢丸湯', '揀一項小食（蚵仔煎、潤餅）', '買竹塹餅做等路轉去'],
  },
  {
    slug: 'two-hours', name: '兩點鐘經典路線', tailo: 'Nn̄g tiám-tsing',
    duration: '約 2 點鐘', budget: 'NT$300～600／人', walk: '約 1 公里',
    summary: '頭一擺來上推薦，食佮拜攏顧著。',
    steps: ['城隍廟簡單參拜', '廟埕食主食', '周邊老店小食', '燒麻糬抑是甜點', '北門街散步看老店'],
  },
  {
    slug: 'two-person-food-walk', name: '兩人分食路線', tailo: 'Nn̄g lâng pun-tsia̍h',
    duration: '約 1.5 點鐘', budget: 'NT$250～450／兩人', walk: '約 800 公尺',
    summary: '兩人來，逐項攏分做兩份，通食著較濟款。',
    steps: ['一碗米粉摃丸湯做開場', '一份肉圓分做兩爿', '一份蚵仔煎鬥一碗羹湯', '甜點燒麻糬收尾'],
  },
  {
    slug: 'rainy-day', name: '落雨少行路路線', tailo: 'Lo̍h-hōo',
    duration: '約 1.5 點鐘', budget: 'NT$250～450／人', walk: '較短，攏佇有崁頂',
    summary: '拄著落雨，儘量佇廟埕佮市場內底食，較袂沃著雨。',
    steps: ['直接入廟埕小吃區', '揀有座位的老店坐落來食', '中央市場內底𨑨迌', '欲轉才走去停車場抑車站'],
  },
  {
    slug: 'family', name: '𤆬囡仔親子路線', tailo: 'Tshuā gín-á',
    duration: '約 2 點鐘', budget: 'NT$400～700／家庭', walk: '約 800 公尺',
    summary: '𤆬囡仔佮序大人，揀好食好坐、無siunn鹹重的。',
    steps: ['貢丸湯、肉燥飯這款囡仔嘛食會落', '揀有座位、較袂軁的店', '甜點水蒸糕、燒麻糬', '東門城邊仔踅踅散心'],
  },
  {
    slug: 'old-town-walk', name: '舊城半晡𨑨迌', tailo: 'Kū-siânn puànn-poo',
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
