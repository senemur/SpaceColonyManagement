'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
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
  RefreshCw,
} from 'lucide-react';
import { ColonyZone } from '@/features/colony/types';
import { COLONY_ZONES, useColonyById } from '@/features/colony/api/colonyApi';
import { useBuildings } from '@/features/buildings/api/buildingsApi';
import { BuildingType } from '@/features/buildings/types';

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
  // Sayfa açıldığında varsayılan olarak ilk koloni (Ares Prime - id: 1) seçili başlar
  const [selectedZone, setSelectedZone] = useState<ColonyZone>(COLONY_ZONES[0]);

  // Backend API'den seçili koloninin gerçek verilerini çekiyoruz
  const { data: colony, isLoading, isError, refetch } = useColonyById(selectedZone.id);

    // Seçili koloninin gerçek binalarını çekiyoruz
  const { data: buildings } = useBuildings(selectedZone.id);

  // Backend'den gelen stats nesnesi (yükleniyorsa veya yoksa güvenli fallback değerleri)
  const stats = colony?.stats;

  // Gerçek backend verileriyle dinamik kaynak listesi
  const resources = [
    { 
      name: 'Oksijen', 
      value: stats?.oxygen ?? 0, 
      max: stats?.maxOxygen ?? 100, 
      unit: '%', 
      icon: Wind, 
      color: 'text-teal-400', 
      bar: 'bg-teal-400' 
    },
    { 
      name: 'Su', 
      value: stats?.water ?? 0, 
      max: stats?.maxWater ?? 100, 
      unit: 'L', 
      icon: Droplet, 
      color: 'text-cyan-400', 
      bar: 'bg-cyan-400' 
    },
    { 
      name: 'Enerji', 
      value: stats?.power ?? 0, 
      max: stats?.maxPower ?? 250, 
      unit: 'kW', 
      icon: Zap, 
      color: 'text-yellow-400', 
      bar: 'bg-yellow-400' 
    },
    { 
      name: 'Besin', 
      value: stats?.food ?? 0, 
      max: stats?.maxFood ?? 500, 
      unit: 'kg', 
      icon: Apple, 
      color: 'text-emerald-400', 
      bar: 'bg-emerald-400' 
    },
    { 
      name: 'Maden', 
      value: stats?.minerals ?? 0, 
      max: 2000, 
      unit: 't', 
      icon: Pickaxe, 
      color: 'text-orange-400', 
      bar: 'bg-orange-400' 
    },
    { 
      name: 'Kredi', 
      value: stats?.credits ?? 0, 
      max: 50000, 
      unit: '₺', 
      icon: Coins, 
      color: 'text-amber-300', 
      bar: 'bg-amber-400' 
    },
  ];

  const infrastructure = [
    { name: 'Ana Yaşam Kubbesi (Hab)', level: 2, status: 'Online', output: `+${stats?.oxygen ? Math.round(stats.oxygen * 0.2) : 10} Oksijen/sol`, workers: '6/16', icon: Building2 },
    { name: 'Hidroponik Sera Modülü', level: 3, status: 'Online', output: '+45 kg Besin/sol', workers: '4/4', icon: Apple },
    { name: 'Maden Kompleksi', level: 1, status: 'Online', output: '+120 t Maden/sol', workers: '6/6', icon: Pickaxe },
    { name: 'Araştırma Laboratuvarı', level: 2, status: 'Online', output: '+15 Puan/sol', workers: '3/3', icon: FlaskConical },
    { name: 'Güneş Paneli Tarlası', level: 4, status: 'Online', output: `+${stats?.power ?? 200} kW Güç/sol`, workers: 'Otomatik', icon: Zap },
    { name: 'Yeraltı Buz Çıkarma Tesisi', level: 2, status: 'Online', output: '+80 L Su/sol', workers: '2/2', icon: Droplet },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 w-full space-y-6">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden rounded-3xl border border-rose-900/40 bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950/80 shadow-2xl p-6 md:p-8 flex flex-col gap-6 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          
          {/* Sol: Mars Globe + Koloni Butonları */}
          <div className="flex flex-col items-center gap-4 w-full md:w-auto">
            <div className="w-full md:w-80 h-72 shrink-0 relative">
              <MarsGlobeScene
                colonyZones={COLONY_ZONES}
                selectedZoneId={selectedZone.id}
                onZoneClick={(zone) => setSelectedZone(zone)}
                onZoneDoubleClick={() => {
                  window.location.href = '/colony';
                }}
              />
            </div>

            {/* Koloni Butonları */}
            <div className="flex flex-wrap justify-center gap-2 w-full md:w-80">
              {COLONY_ZONES.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    selectedZone.id === zone.id
                      ? 'bg-rose-500/20 border-rose-500/60 text-rose-200 shadow-lg shadow-rose-950/50 scale-105'
                      : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: zone.color }} />
                  {zone.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sağ: Seçili Koloni Detay Paneli (Backend Verileri) */}
          <div className="flex-1 w-full space-y-4">
            <div className="bg-slate-950/80 border border-rose-900/40 rounded-2xl p-5 space-y-4 shadow-xl">
              
              {/* Üst Başlık */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full animate-pulse" style={{ backgroundColor: selectedZone.color }} />
                  <div>
                    <h1 className="text-2xl font-black text-slate-100 tracking-tight">
                      {colony?.name ?? selectedZone.name}
                    </h1>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" /> 
                      {colony?.location ?? selectedZone.location} · {colony?.planet ?? 'Mars'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => refetch()} 
                    title="Yenile"
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    CANLI VERİ
                  </span>
                </div>
              </div>

              {/* Komutan ve Açıklama */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Komutan</span>
                  <p className="font-bold text-slate-100">{colony?.commander ?? 'Bilinmiyor'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Açıklama</span>
                  <p className="text-slate-300">{colony?.description ?? 'Mars kolonisi'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Güvenlik Skoru</span>
                  <p className="font-bold text-emerald-400">%{stats?.safetyScore ?? 100}</p>
                </div>
              </div>

              {/* Quick Stats Grid (Backend'den) */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Sol (Gün)</span>
                  <strong className="text-base font-bold text-amber-300">
                    Sol {stats?.sol ?? 1}
                  </strong>
                </div>
                <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Nüfus / Kapasite</span>
                  <strong className="text-base font-bold text-sky-400">
                    {stats?.population ?? 0} / {stats?.maxPopulation ?? 0}
                  </strong>
                </div>
                <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Enerji Durumu</span>
                  <strong className="text-base font-bold text-yellow-400">
                    {stats?.power ?? 0} kW
                  </strong>
                </div>
              </div>

              {/* 3D Yüzeye Git Butonu */}
              <Link
                href="/colony"
                className="flex items-center justify-between w-full py-2.5 px-4 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-700/50 transition-all hover:scale-[1.01]"
              >
                <span>3D Koloni Yüzeyine Gir (Çift Tıkla veya Bas)</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Sistem Durum Rozetleri */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Sistemler Normal
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> {stats?.population ?? 0} Aktif Personel
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" /> Radyasyon Normal
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
            <h2 className="text-sm font-bold text-slate-100">Hoş Geldiniz, Komutan {colony?.commander}</h2>
            <p className="text-xs text-slate-400">Supabase API bağlantısı aktif · {colony?.name} operasyonda.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="text-emerald-400"><b className="text-white">{stats?.food ?? 0}</b> kg Besin</span>
          <span className="text-cyan-400"><b className="text-white">%{stats?.water ?? 0}</b> Su</span>
          <span className="text-teal-400"><b className="text-white">%{stats?.oxygen ?? 0}</b> O₂</span>
          <span className="text-yellow-400"><b className="text-white">{stats?.power ?? 0}</b> kW Güç</span>
        </div>
      </div>

      {/* ===== DİNAMİK KAYNAK KAPASİTE KARTLARI (BACKEND'DEN) ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((r) => {
          const Icon = r.icon;
          const pct = Math.min(100, Math.round((r.value / (r.max || 1)) * 100));

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
                  <span className="text-xs text-slate-300 font-semibold">
                    {r.value.toLocaleString()} <span className="text-slate-500">/ {r.max.toLocaleString()} {r.unit}</span>
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div className={`${r.bar} h-full rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/80">
                <span className="text-slate-400 font-medium">Kapasite: {r.max} {r.unit}</span>
                <span className="text-emerald-400 font-bold ml-auto">Kullanılabilir: {r.value}</span>
              </div>
            </div>
          );
        })}
      </div>

            {/* ===== KOLONİ TESİSLERİ VE MÜRETTEBAT ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" /> Koloni Tesisleri ({colony?.name ?? selectedZone.name})
            </h2>
            <Link href="/buildings" className="text-xs font-semibold text-rose-400 hover:underline">
              Tümünü Yönet ({buildings?.length ?? 0})
            </Link>
          </div>

          {(!buildings || buildings.length === 0) ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
              <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs font-bold text-slate-300">Bu kolonide henüz inşa edilmiş bir tesis yok.</p>
              <Link 
                href="/buildings" 
                className="inline-block px-4 py-2 rounded-xl text-xs font-bold text-amber-200 bg-amber-950/80 hover:bg-amber-900 border border-amber-700/60 transition-colors"
              >
                + İlk Yapıyı İnşa Et
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {buildings.map((b) => (
                <div key={b.id} className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-sm hover:border-amber-600/40 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xs text-slate-100">{b.name}</h3>
                        <span className="text-[10px] text-amber-400 font-medium">Seviye {b.level}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      b.isActive 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}>
                      {b.isActive ? 'Online' : 'Devre Dışı'}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-emerald-400">
                    {!b.isActive ? (
                      <span className="text-slate-500">Şebekeden Ayrıldı</span>
                    ) : b.powerProduction > 0 ? (
                      `+${b.powerProduction} kW Güç/sol`
                    ) : (
                      `-${b.powerConsumption} kW Güç`
                    )}
                  </p>

                  <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-2 text-slate-400">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-500" /> Çalışan: {b.workers}/{b.maxWorkers}</span>
                    <Link href="/buildings" className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] transition-colors">
                      Yönet
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mürettebat Nüfusu (Backend'deki population & maxPopulation'a bağlı) */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" /> Mürettebat Nüfusu
              </h2>
              <span className="text-xs font-bold text-sky-400">{stats?.population ?? 0} Personel</span>
            </div>

            <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-lg">
                {stats?.population ?? 0}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-100">Aktif Kolonist</div>
                <div className="text-xs text-slate-400">Maksimum Kapasite: {stats?.maxPopulation ?? 0} Kişi</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">Sağlıklı</span>
                <strong className="text-emerald-400">{stats?.population ?? 0}</strong>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">Yaralı/Hasta</span>
                <strong className="text-amber-400">0</strong>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">Görevde</span>
                <strong className="text-sky-400">{stats?.population ?? 0}</strong>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">Boş Kapasite</span>
                <strong className="text-slate-400">{(stats?.maxPopulation ?? 0) - (stats?.population ?? 0)}</strong>
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

      {/* ===== GÖREVLER VE OLAYLAR ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Radio className="w-4 h-4 text-teal-400" /> Aktif Operasyonlar
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Gelişmiş Yaşam Destek Sistemi', pct: stats?.oxygen ?? 75, color: 'bg-teal-400', icon: FlaskConical, iconColor: 'text-teal-400', time: 'Optimum' },
              { label: 'Güneş Paneli Şebeke Dengeleme', pct: Math.min(100, Math.round(((stats?.power ?? 100) / 250) * 100)), color: 'bg-amber-400', icon: Hammer, iconColor: 'text-amber-400', time: 'Stabil' },
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
              <CloudSun className="w-4 h-4 text-rose-400" /> Koloni Durum Günlüğü
            </h2>
            <Link href="/events" className="text-xs text-rose-400 font-semibold hover:underline">Tümünü Gör</Link>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl divide-y divide-slate-800/80">
            <div className="p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <span>Supabase Veritabanı Senkronize</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Aktif</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Koloni ID {selectedZone.id} verileri başarıyla yüklendi.</p>
                <span className="text-[10px] text-slate-500 mt-1 block">Şimdi</span>
              </div>
            </div>

            <div className="p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Pickaxe className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <span>Maden Rezervi: {stats?.minerals ?? 0} ton</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/30">Kayıt</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Kasa: {stats?.credits?.toLocaleString() ?? 0} ₺ Kredi</p>
                <span className="text-[10px] text-slate-500 mt-1 block">Sol {stats?.sol ?? 1}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}