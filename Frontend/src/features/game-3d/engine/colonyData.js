// colonyData.js - Colony Data & Building Definitions
export const rnd = (a, b) => Math.random() * (b - a) + a;
export const irnd = (a, b) => Math.floor(rnd(a, b + 1));
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const fmt = (n) => Math.floor(n).toLocaleString('tr-TR');

export const CREW_NAMES = [
  'Ayşe Yılmaz', 'Deniz Kaya', 'Mert Arslan', 'Elif Demir', 'Can Öztürk', 'Selin Aydın',
  'Kaan Şahin', 'Zeynep Aksoy', 'Emre Çelik', 'Nil Yıldız', 'Barış Koç', 'Selin Güneş',
  'Onur Tekin', 'Derya Uçar', 'Ali Toprak', 'Ceren Bulut', 'Kuzey Erdoğan', 'Melis Aslan'
];

export const CREW_ROLES = [
  'Kaptan', 'Mühendis', 'Biyolog', 'Teknisyen', 'Doktor', 'Jeoloji', 'Botanik', 'Elektrikçi'
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
  habitat: { name: 'Habitat', k: 'yaşam', icon: '⬢', cost: 120, desc: 'Yaşam modülü — 4 kişi kapasiteli, ısıtmalı.' },
  solar: { name: 'Güneş Dizisi', k: 'enerji', icon: '☀', cost: 90, desc: 'Fotovoltaik panel dizisi, gün ışığında enerji üretir.' },
  lab: { name: 'Laboratuvar', k: 'bilim', icon: '⚛', cost: 150, desc: 'Biyoloji ve jeoloji araştırma üssü.' },
  mine: { name: 'Maden Ocağı', k: 'endüstri', icon: '◮', cost: 100, desc: 'Regolit kazısı — parça ve metal cevheri.' },
  farm: { name: 'Tarım Modülü', k: 'yaşam', icon: '❋', cost: 130, desc: 'Hidroponik tarım — besin ve su üretimi.' },
  rocket: { name: 'Fırlatma Kullesi', k: 'endüstri', icon: '▲', cost: 200, desc: 'Yörünge istasyonuyla bağlantı noktası.' },
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

export function createColony() {
  const builds = [
    { t: 'habitat', n: 'Habitat-1', x: 0, z: 0, k: 'yaşam', lvl: 2, hp: 96 },
    { t: 'habitat', n: 'Habitat-2', x: 14, z: 9, k: 'yaşam', lvl: 1, hp: 88 },
    { t: 'solar', n: 'Güneş Dizisi A', x: 26, z: -18, k: 'enerji', lvl: 3, hp: 100 },
    { t: 'solar', n: 'Güneş Dizisi B', x: 38, z: -8, k: 'enerji', lvl: 2, hp: 74 },
    { t: 'lab', n: 'Yaşam Bilimi Lab', x: 10, z: -26, k: 'bilim', lvl: 3, hp: 91 },
    { t: 'mine', n: 'Maden Ocağı-1', x: -22, z: 16, k: 'endüstri', lvl: 2, hp: 82 },
    { t: 'farm', n: 'Tarım Modülü', x: 6, z: 30, k: 'yaşam', lvl: 1, hp: 95 },
    { t: 'rocket', n: 'Fırlatma Kullesi', x: 44, z: 22, k: 'endüstri', lvl: 1, hp: 100 },
  ].map((b) => ({ ...b, hp: b.hp }));

  const crew = CREW_NAMES.map((name, i) => ({
    id: i,
    name,
    role: CREW_ROLES[i % CREW_ROLES.length],
    hp: irnd(70, 100),
    status: 'ok',
    bg: AVATAR_BG[i % AVATAR_BG.length],
    initials: name.split(' ').map((w) => w[0]).join(''),
    wx: rnd(-40, 40),
    wz: rnd(-40, 40),
  }));

  return {
    sol: 412,
    builds,
    crew,
    res: {
      su: { name: 'Su', icon: '💧', v: 8420, cap: 12000, acc: '#5bc8ff', per: 42 },
      oksijen: { name: 'Oksijen', icon: '🫧', v: 96, cap: 100, acc: '#3ddc97', per: 1.6 },
      enerji: { name: 'Enerji', icon: '⚡', v: 318, cap: 500, acc: '#f4c542', per: 6 },
      besin: { name: 'Besin', icon: '🌾', v: 1640, cap: 2500, acc: '#9d7bff', per: -9 },
      parca: { name: 'Parça', icon: '⚙️', v: 310, cap: 800, acc: '#e2703a', per: 3.5 },
    },
  };
}
