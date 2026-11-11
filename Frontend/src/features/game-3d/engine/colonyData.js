// colonyData.js - Colony Data & Building Definitions
export const rnd = (a, b) => Math.random() * (b - a) + a;
export const irnd = (a, b) => Math.floor(rnd(a, b + 1));
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const fmt = (n) => Math.floor(n).toLocaleString('tr-TR');

export const CREW_NAMES = [
  'Dr. Elena Gilbert', 'John Ares', 'Mert Arslan', 'Deniz Kaya', 'Ayşe Yılmaz', 'Can Öztürk',
  'Kaan Şahin', 'Zeynep Aksoy', 'Emre Çelik', 'Nil Yıldız', 'Barış Koç', 'Selin Güneş'
];

export const CREW_ROLES = [
  'Komutan', 'Mühendis', 'Bilim İnsanı', 'Doktor', 'Çiftçi', 'Madenci', 'Teknisyen', 'Güvenlik'
];

export const AVATAR_BG = ['#e2703a', '#9d7bff', '#3ddc97', '#f4c542', '#5bc8ff', '#ff7a7a'];

export const COLOR = {
  yaşam: '#e2703a',
  enerji: '#f4c542',
  bilim: '#5bc8ff',
  endüstri: '#9d7bff',
  mars: 0xe2703a,
  marsDark: 0x933b19,
  sand: 0xd6a378,
  rock: 0x5a4840,
  metal: 0x8aa0b0,
  darkMetal: 0x2e3842,
  glass: 0x88d4f5,
  green: 0x3ddc97,
  gold: 0xf4c542,
  violet: 0x9d7bff,
  blue: 0x5bc8ff,
  red: 0xff5c5c,
};

export const BUILD_DEFS = {
  habitat: { name: 'Habitat Modülü', k: 'yaşam', icon: '⬢', cost: 120, desc: 'Yaşam modülü — personel barınma ve yaşam destek ünitesi.' },
  solar: { name: 'Güneş Paneli Dizisi', k: 'enerji', icon: '☀', cost: 90, desc: 'Fotovoltaik panel dizisi, gün ışığında enerji üretir.' },
  water: { name: 'Yeraltı Su Sondaj İstasyonu', k: 'yaşam', icon: '💧', cost: 110, desc: 'Permafrost tabakasından termal sondajla su çıkarma ünitesi.' },
  farm: { name: 'Hidroponik Tarım Serası', k: 'yaşam', icon: '❋', cost: 130, desc: 'Hidroponik tarım — taze besin ve oksijen üretimi.' },
  mine: { name: 'Regolit Maden Ocağı', k: 'endüstri', icon: '◮', cost: 100, desc: 'Regolit kazısı — parça ve metal cevheri.' },
  lab: { name: 'Araştırma Laboratuvarı', k: 'bilim', icon: '⚛', cost: 150, desc: 'Biyoloji, jeoloji ve teknoloji analiz üssü.' },
  rocket: { name: 'Fırlatma Kulesi', k: 'endüstri', icon: '▲', cost: 200, desc: 'Yörünge istasyonuyla bağlantı ve kargo noktası.' },
};

export const LOG_MSGS = [
  ['ok', 'Solar dizisi B yeniden kalibre edildi.'],
  ['info', 'Rover "Pato-2" 14 km² kaya örneği topladı.'],
  ['warn', 'Habitat-2 havalandırma filtresinde tıkanma tespit edildi.'],
  ['ok', 'Tarım modülü ilk mahsul hasadını tamamladı: +42 kg.'],
  ['info', 'Maden ocağı-1 yeni cevher damarı açtı.'],
  ['bad', 'Toz fırtınası: dış operasyonlar 3 saat askıya alındı.'],
];

export const ALERTS = [
  'Oksijen rezervi kritik seviyeye düştü!',
  'Toz fırtınası yaklaşıyor — dış operasyonlar kısıtlı.',
  'Habitat-2 basınç sızıntısı tespit edildi, onarım gerekli.',
  'Enerji talebi kapasiteyi aştı, yük önceliği uygulanıyor.',
];

const ROLE_MAP = {
  1: 'Komutan',
  2: 'Mühendis',
  3: 'Bilim İnsanı',
  4: 'Doktor',
  5: 'Çiftçi',
  6: 'Madenci',
  7: 'Teknisyen',
  8: 'Güvenlik',
  'Commander': 'Komutan',
  'Engineer': 'Mühendis',
  'Scientist': 'Bilim İnsanı',
  'Medic': 'Doktor',
  'Farmer': 'Çiftçi',
  'Miner': 'Madenci',
  'Operator': 'Teknisyen',
  'Security': 'Güvenlik',
};

export function createColony(backendOverview = null, backendBuildings = null, backendColonists = null) {
  // Default fallback layout positions
  const defaultBuilds = [
    { id: 2, t: 'habitat', n: 'Ares Yaşam Modülü', x: 0, z: 0, k: 'yaşam', lvl: 2, hp: 96 },
    { id: 22, t: 'habitat', n: 'Habitat-2 Destek Ünitesi', x: 14, z: 9, k: 'yaşam', lvl: 1, hp: 88 },
    { id: 1, t: 'solar', n: 'Güneş Paneli Tarlası', x: 26, z: -18, k: 'enerji', lvl: 3, hp: 100 },
    { id: 4, t: 'solar', n: 'Yeraltı Su Sondaj İstasyonu', x: 38, z: -8, k: 'enerji', lvl: 2, hp: 90 },
    { id: 6, t: 'lab', n: 'Mars Araştırma Laboratuvarı', x: 10, z: -26, k: 'bilim', lvl: 3, hp: 92 },
    { id: 5, t: 'mine', n: 'Regolit Maden Ocağı', x: -22, z: 16, k: 'endüstri', lvl: 2, hp: 85 },
    { id: 3, t: 'farm', n: 'Hidroponik Tarım Serası', x: 6, z: 30, k: 'yaşam', lvl: 1, hp: 95 },
    { id: 7, t: 'rocket', n: 'Fırlatma Kulesi', x: 44, z: 22, k: 'endüstri', lvl: 1, hp: 100 },
  ];

  let builds = defaultBuilds;

  if (backendBuildings && Array.isArray(backendBuildings) && backendBuildings.length > 0) {
    const buildingTypePresets = {
      1: { t: 'habitat', k: 'yaşam', x: 0, z: 0 },
      2: { t: 'solar', k: 'enerji', x: 26, z: -18 },
      3: { t: 'farm', k: 'yaşam', x: 6, z: 30 },
      4: { t: 'mine', k: 'endüstri', x: -22, z: 16 },
      5: { t: 'water', k: 'yaşam', x: 38, z: -8 },
      6: { t: 'lab', k: 'bilim', x: 10, z: -26 },
    };

    builds = backendBuildings.map((b) => {
      const preset = buildingTypePresets[b.buildingType] || { t: 'habitat', k: 'yaşam', x: rnd(-20, 20), z: rnd(-20, 20) };
      return {
        id: b.id,
        t: preset.t,
        k: preset.k,
        n: b.name,
        lvl: b.level ?? 1,
        hp: b.health ?? 100,
        x: preset.x,
        z: preset.z,
      };
    });

    // Keep rocket tower and auxiliary habitat if not present in backend
    if (!builds.some(b => b.t === 'rocket')) {
      builds.push({ id: 99, t: 'rocket', n: 'Fırlatma Kulesi', x: 44, z: 22, k: 'endüstri', lvl: 1, hp: 100 });
    }
    if (!builds.some(b => b.n.includes('Habitat-2'))) {
      builds.push({ id: 98, t: 'habitat', n: 'Habitat-2 Destek Ünitesi', x: 14, z: 9, k: 'yaşam', lvl: 1, hp: 88 });
    }
  }

  let crew = [];
  if (backendColonists && Array.isArray(backendColonists) && backendColonists.length > 0) {
    crew = backendColonists.map((c, i) => {
      const roleStr = ROLE_MAP[c.role] || (typeof c.role === 'string' ? c.role : CREW_ROLES[i % CREW_ROLES.length]);
      return {
        id: c.id,
        name: c.name,
        role: roleStr,
        hp: c.health ?? 100,
        morale: c.morale ?? 100,
        stamina: c.stamina ?? 100,
        buildingId: c.buildingId,
        status: 'ok',
        bg: AVATAR_BG[i % AVATAR_BG.length],
        initials: (c.name || 'K').split(' ').map((w) => w[0]).join('').slice(0, 2),
        wx: rnd(-35, 35),
        wz: rnd(-35, 35),
      };
    });
  } else {
    crew = CREW_NAMES.map((name, i) => ({
      id: i + 1,
      name,
      role: CREW_ROLES[i % CREW_ROLES.length],
      hp: irnd(75, 100),
      status: 'ok',
      bg: AVATAR_BG[i % AVATAR_BG.length],
      initials: name.split(' ').map((w) => w[0]).join('').slice(0, 2),
      wx: rnd(-35, 35),
      wz: rnd(-35, 35),
    }));
  }

  const stats = backendOverview?.stats;

  return {
    sol: stats?.sol ?? 2,
    builds,
    crew,
    res: {
      su: {
        name: 'Su',
        icon: '💧',
        v: stats ? Number(stats.water) : 76,
        cap: stats ? Number(stats.maxWater || 100) : 100,
        acc: '#5bc8ff',
        per: 42,
      },
      oksijen: {
        name: 'Oksijen',
        icon: '🫧',
        v: stats ? Number(stats.oxygen) : 88,
        cap: stats ? Number(stats.maxOxygen || 100) : 100,
        acc: '#3ddc97',
        per: 1.6,
      },
      enerji: {
        name: 'Enerji',
        icon: '⚡',
        v: stats ? Number(stats.power) : 250,
        cap: stats ? Number(stats.maxPower || 250) : 250,
        acc: '#f4c542',
        per: 6,
      },
      besin: {
        name: 'Besin',
        icon: '🌾',
        v: stats ? Number(stats.food) : 296,
        cap: stats ? Number(stats.maxFood || 500) : 500,
        acc: '#9d7bff',
        per: -9,
      },
      parca: {
        name: 'Parça',
        icon: '⚙️',
        v: stats ? Number(stats.minerals) : 1000,
        cap: 5000,
        acc: '#e2703a',
        per: 3.5,
      },
    },
  };
}
