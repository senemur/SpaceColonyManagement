'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Building2, 
  CloudSun, 
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
  FlaskConical,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { ColonyZone } from '@/features/colony/types';
import { COLONY_ZONES, useColonyById } from '@/features/colony/api/colonyApi';

const MarsGlobeScene = dynamic(() => import('@/features/colony/components/MarsGlobeScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[280px] flex flex-col items-center justify-center text-rose-400 gap-2">
      <div className="planet w-20 h-20 rounded-full animate-pulse" />
      <span className="text-xs font-bold">3D Mars Yükleniyor...</span>
    </div>
  ),
});

// Koloni bilgi paneli — seçili koloniye göre API'den gerçek veri çeker
function ColonyInfoPanel({ zone }: { zone: ColonyZone }) {
  const { data: colony, isLoading } = useColonyById(zone.id);

  if (isLoading || !colony) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-slate-800 rounded w-3/4" />
        <div className="h-3 bg-slate-800 rounded w-1/2" />
        <div className="grid grid-cols-2 gap-2 mt-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const stats = colony.stats;
  const statItems = [
    { label: 'Sol', val: `Sol ${stats.sol}`, color: 'text-amber-400' },
    { label: 'Nüfus', val: `${stats.population}/${stats.maxPopulation}`, color: 'text-sky-400' },
    { label: 'Enerji', val: `${stats.power} kW`, color: 'text-yellow-400' },
    { label: 'Oksijen', val: `%${stats.oxygen}`, color: 'text-teal-400' },
    { label: 'Su', val: `%${stats.water}`, color: 'text-cyan-400' },
    { label: 'Güvenlik', val: `%${stats.safetyScore}`, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-4">
      {/* Komutan */}
      <div>
        <p className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">Komutan</p>
        <p className="text-sm font-bold text-slate-100">{colony.commander}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        {statItems.map((s) => (
          <div key={s.label} className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5">
            <span className="block text-[10px] text-slate-400 uppercase font-semibold">{s.label}</span>
            <strong className={`text-sm font-bold ${s.color}`}>{s.val}</strong>
          </div>
        ))}
      </div>

      {/* Detay linki */}
      <Link
        href="/colony"
        className="flex items-center justify-between w-full py-2.5 px-4 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-700/50 transition-colors"
      >
        <span>3D Yüzeye Git</span>
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function DashboardHomePage() {
  const [selectedZone, setSelectedZone] = useState<ColonyZone | null>(null);

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
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden rounded-3xl border border-rose-900/40 bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950/80 shadow-2xl p-6 md:p-8 flex flex-col gap-6 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          {/* Sol: Mars Globe + Colony Zone butonları */}
          <div className="flex flex-col items-center gap-4 w-full md:w-auto">
            <div className="w-full md:w-80 h-72 shrink-0 relative">
              <MarsGlobeScene
                colonyZones={COLONY_ZONES}
                selectedZoneId={selectedZone?.id ?? null}
                onZoneClick={(zone) => setSelectedZone(zone)}
                onZoneDoubleClick={() => {
                  window.location.href = '/colony';
                }}
              />
            </div>

            {/* Koloni Zone Seçim Butonları (Mars altında) */}
            <div className="flex flex-wrap justify-center gap-2 w-full md:w-80">
              {COLONY_ZONES.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    selectedZone?.id === zone.id
                      ? 'bg-rose-500/20 border-rose-500/60 text-rose-200'
                      : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: zone.color }} />
                  {zone.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sağ: Koloni Bilgi Paneli */}
          <div className="flex-1 flex flex-col gap-4">
            {selectedZone ? (
              /* Seçili Koloni Paneli */
              <div className="bg-slate-950/80 border border-rose-900/40 rounded-2xl p-5 space-y-4">
                {/* Başlık */}
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: selectedZone.color }} />
                  <div>
                    <h1 className="text-xl font-black text-slate-100">{selectedZone.name}</h1>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {selectedZone.location}, Mars
                    </p>
                  </div>
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    AKTİF
                  </span>
                </div>
                <ColonyInfoPanel zone={selectedZone} />
              </div>
            ) : (
              /* Hiç seçili değilken göster */
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center gap-3 bg-slate-950/40 border border-slate-800 rounded-2xl p-6">
                <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">Koloni Seçin</p>
                  <p className="text-xs text-slate-500 mt-1">Mars üzerindeki bir koloni bölgesine tıklayın<br/>veya aşağıdaki butonları kullanın</p>
                </div>
              </div>
            )}

            {/* Durum Badges */}
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
          </div>
        </div>
      </section>

      {/* ===== HOŞ GELDİNİZ BANNER ===== */}
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

      {/* ===== KAYNAK KAPASİTE KARTLARI ===== */}
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

      {/* ===== KOLONİ TESİSLERİ ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

        {/* Mürettebat */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" /> Mürettebat Nüfusu
              </h2>
              <span className="text-xs font-bold text-sky-400">18 Personel</span>
            </div>

            <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-lg">18</div>
              <div>
                <div className="text-sm font-bold text-slate-100">Toplam Mürettebat</div>
                <div className="text-xs text-slate-400">Kapasite: 24 Kişi</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[['Sağlıklı', '16', 'text-emerald-400'], ['Hasta', '2', 'text-amber-400'], ['Çalışan', '14', 'text-sky-400'], ['Boşta', '4', 'text-slate-400']].map(([label, val, color]) => (
                <div key={label} className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-slate-400">{label}</span>
                  <strong className={color}>{val}</strong>
                </div>
              ))}
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

      {/* ===== AKTİF GÖREVLER & SON OLAYLAR ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Radio className="w-4 h-4 text-teal-400" /> Aktif Görev ve Araştırmalar
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Gelişmiş Tarım Teknolojisi', pct: 65, color: 'bg-teal-400', icon: FlaskConical, iconColor: 'text-teal-400', time: '12 dakika kaldı' },
              { label: 'Sera Modülü Seviye 3 İnşaatı', pct: 40, color: 'bg-amber-400', icon: Hammer, iconColor: 'text-amber-400', time: '18 dakika kaldı' },
            ].map((task) => {
              const Icon = task.icon;
              return (
                <div key={task.label} className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${task.iconColor}`} />
                      <span className="font-bold text-slate-200">{task.label}</span>
                    </div>
                    <span className={`font-bold ${task.iconColor}`}>%{task.pct}</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div className={`${task.color} h-full rounded-full`} style={{ width: `${task.pct}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-400 text-right">{task.time}</p>
                </div>
              );
            })}
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