'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Building2, 
  CloudSun, 
  Gamepad2, 
  Hammer, 
  Radio, 
  Users, 
  Wifi,
  Zap,
  Wind,
  Droplet,
  Apple,
  Pickaxe,
  Coins,
  ShieldCheck,
  Flame,
  FlaskConical
} from 'lucide-react';

const MarsGlobeScene = dynamic(() => import('@/features/colony/components/MarsGlobeScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[280px] flex flex-col items-center justify-center text-rose-400 gap-2">
      <div className="planet w-20 h-20 rounded-full animate-pulse" />
      <span className="text-xs font-bold">3D Mars Yükleniyor...</span>
    </div>
  ),
});

export default function DashboardHomePage() {
  const resources = [
    { name: 'Oksijen', value: 96, max: 100, unit: '%', prod: 18, cons: 2, icon: Wind, color: 'text-teal-400', bar: 'bg-teal-400' },
    { name: 'Su', value: 8420, max: 10000, unit: 'L', prod: 80, cons: 15, icon: Droplet, color: 'text-cyan-400', bar: 'bg-cyan-400' },
    { name: 'Enerji', value: 318, max: 500, unit: 'kW', prod: 200, cons: 105, icon: Zap, color: 'text-yellow-400', bar: 'bg-yellow-400' },
    { name: 'Besin', value: 320, max: 500, unit: 'kg', prod: 45, cons: 12, icon: Apple, color: 'text-emerald-400', bar: 'bg-emerald-400' },
    { name: 'Maden', value: 1450, max: 2000, unit: 't', prod: 120, cons: 0, icon: Pickaxe, color: 'text-orange-400', bar: 'bg-orange-400' },
    { name: 'Kredi', value: 28500, max: 50000, unit: '₺', prod: 500, cons: 50, icon: Coins, color: 'text-amber-300', bar: 'bg-amber-400' },
  ];

  const infrastructure = [
    { name: 'Ana Yaşam Kubbesi (Hab)', level: 2, status: 'Online', output: '+12 Oksijen/sol', workers: '6/16', icon: Building2 },
    { name: 'Hidroponik Sera Modülü', level: 3, status: 'Online', output: '+45 kg Besin/sol', workers: '4/4', icon: Apple },
    { name: 'Maden Kompleksi', level: 1, status: 'Online', output: '+120 t Maden/sol', workers: '6/6', icon: Pickaxe },
    { name: 'Araştırma Laboratuvarı', level: 2, status: 'Online', output: '+15 Puan/sol', workers: '3/3', icon: FlaskConical },
    { name: 'Güneş Paneli Tarlası', level: 4, status: 'Online', output: '+200 kW Güç/sol', workers: 'Otomatik', icon: Zap },
    { name: 'Yeraltı Buz Çıkarma Tesisi', level: 2, status: 'Online', output: '+80 L Su/sol', workers: '2/2', icon: Droplet },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 w-full space-y-6">
      {/* ===== HERO SECTION WITH REAL 3D MARS SCENE ===== */}
      <section className="relative overflow-hidden rounded-3xl border border-rose-900/40 bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950/80 shadow-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
        {/* Text Details */}
        <div className="space-y-4 max-w-xl z-10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Ana Yerleşim · Arcadia Planitia</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight">NEW HORIZON</h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">Mars Kolonisi · Sol 412 · Seektör A-1</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Sistemler Normal
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> 18 Personel
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" /> Toz Fırtınası Yaklaşıyor
            </span>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-center">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Sol</span>
              <strong className="text-sm font-bold text-rose-300">412</strong>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-center">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Yerel Saat</span>
              <strong className="text-sm font-bold text-slate-100">14:32</strong>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-center">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Sıcaklık</span>
              <strong className="text-sm font-bold text-amber-300">−63°C</strong>
            </div>
          </div>
        </div>

        {/* Real 3D Interactive Mars Planet Canvas */}
        <div className="w-full md:w-80 h-72 shrink-0 relative flex flex-col items-center justify-center">
          <MarsGlobeScene />
        </div>
      </section>

      {/* ===== WELCOME BACK COMMANDER BANNER ===== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-rose-900/30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">Hoş Geldiniz, Komutan</h2>
            <p className="text-xs text-slate-400">Siz yokken koloni üretimi kesintisiz devam etti.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="text-emerald-400"><b className="text-white">+45</b> Besin</span>
          <span className="text-cyan-400"><b className="text-white">+80</b> Su</span>
          <span className="text-teal-400"><b className="text-white">+18</b> Oksijen</span>
          <span className="text-yellow-400"><b className="text-white">+200</b> Enerji</span>
        </div>
      </div>

      {/* ===== RESOURCE CAPACITY CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((r) => {
          const Icon = r.icon;
          const pct = Math.round((r.value / r.max) * 100);
          const net = r.prod - r.cons;

          return (
            <div key={r.name} className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-md hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center ${r.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-400">%{pct}</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm text-slate-200">{r.name}</h3>
                  <span className="text-xs text-slate-300 font-semibold">{r.value.toLocaleString()} <span className="text-slate-500">/ {r.max.toLocaleString()} {r.unit}</span></span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div className={`${r.bar} h-full rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/80">
                <span className="text-emerald-400 font-medium flex items-center gap-0.5"><ArrowUpRight className="w-3.5 h-3.5" /> +{r.prod}/sol</span>
                <span className="text-rose-400 font-medium flex items-center gap-0.5"><ArrowDownRight className="w-3.5 h-3.5" /> −{r.cons}/sol</span>
                <span className="text-emerald-300 font-bold ml-auto">Net +{net}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== COLONY INFRASTRUCTURE & COLONISTS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Infrastructure Grid (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" /> Koloni Tesisleri ve Yapıları
            </h2>
            <Link href="/buildings" className="text-xs font-semibold text-rose-400 hover:underline">
              Tümünü Yönet ({infrastructure.length})
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {infrastructure.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div key={idx} className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-sm hover:border-amber-600/40 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xs text-slate-100">{b.name}</h3>
                        <span className="text-[10px] text-amber-400 font-medium">Seviye {b.level}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {b.status}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-emerald-400">{b.output}</p>

                  <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-2 text-slate-400">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-500" /> Çalışan: {b.workers}</span>
                    <Link href="/buildings" className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] transition-colors">
                      Yükselt
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Colonist Roster Summary (1 Col) */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" /> Mürettebat Nüfusu
              </h2>
              <span className="text-xs font-bold text-sky-400">18 Personel</span>
            </div>

            <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-lg">
                18
              </div>
              <div>
                <div className="text-sm font-bold text-slate-100">Toplam Mürettebat</div>
                <div className="text-xs text-slate-400">Kapasite: 24 Kişi</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">Sağlıklı</span>
                <strong className="text-emerald-400">16</strong>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">Hasta</span>
                <strong className="text-amber-400">2</strong>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">Çalışan</span>
                <strong className="text-sky-400">14</strong>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">Boşta</span>
                <strong className="text-slate-400">4</strong>
              </div>
            </div>
          </div>

          <Link
            href="/colonists"
            className="w-full text-center py-2.5 rounded-xl text-xs font-bold text-sky-300 bg-sky-950/60 hover:bg-sky-900/80 border border-sky-700/50 transition-colors block"
          >
            Mürettebat Listesini İncele
          </Link>
        </div>
      </div>

      {/* ===== CURRENT ACTIVITY & RECENT EVENTS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Radio className="w-4 h-4 text-teal-400" /> Aktif Görev ve Araştırmalar
          </h2>
          <div className="space-y-3">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-teal-400" />
                  <span className="font-bold text-slate-200">Gelişmiş Tarım Teknolojisi</span>
                </div>
                <span className="text-teal-400 font-bold">%65</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-teal-400 h-full rounded-full w-[65%]" />
              </div>
              <p className="text-[11px] text-slate-400 text-right">12 dakika kaldı</p>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Hammer className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-slate-200">Sera Modülü Seviye 3 İnşaatı</span>
                </div>
                <span className="text-amber-400 font-bold">%40</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-amber-400 h-full rounded-full w-[40%]" />
              </div>
              <p className="text-[11px] text-slate-400 text-right">18 dakika kaldı</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-rose-400" /> Son Olaylar ve Bildirimler
            </h2>
            <Link href="/events" className="text-xs text-rose-400 font-semibold hover:underline">Tümünü Gör</Link>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl divide-y divide-slate-800/80">
            <div className="p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <CloudSun className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <span>Güneş Fırtınası Uyarısı</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30">Aktif</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Güneş paneli enerji üretimi %30 azaldı.</p>
                <span className="text-[10px] text-amber-400 font-semibold mt-1 block">2 saat kaldı</span>
              </div>
            </div>

            <div className="p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Pickaxe className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <span>Zengin Demir Cevheri Bulundu</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Tamamlandı</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Yüzey taramasında +120 ton demir tespit edildi.</p>
                <span className="text-[10px] text-slate-500 mt-1 block">Dün · 18:42</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
