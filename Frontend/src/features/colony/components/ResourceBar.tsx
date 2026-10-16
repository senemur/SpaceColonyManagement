'use client';

import React, { useState } from 'react';
import { useColonyOverview, useNextSol, NextSolResponse } from '../api/colonyApi';
import { 
  Zap, 
  Wind, 
  Droplet, 
  Apple, 
  Pickaxe, 
  Coins, 
  Users, 
  Sun,
  FastForward,
  X,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function ResourceBar({ colonyId = 1 }: { colonyId?: number }) {
  const { data: colony, isLoading } = useColonyOverview();
  const nextSolMutation = useNextSol(colonyId);
  const [report, setReport] = useState<NextSolResponse | null>(null);

  const stats = colony?.stats;

  if (isLoading || !stats) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 flex items-center justify-around text-xs text-slate-400 animate-pulse">
        <span>Kaynaklar yükleniyor...</span>
      </div>
    );
  }

  const items = [
    { label: 'SOL', val: `Sol ${stats.sol}`, icon: Sun, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-500/20' },
    { label: 'Nüfus', val: `${stats.population}/${stats.maxPopulation}`, icon: Users, color: 'text-sky-400', bg: 'bg-sky-400/10 border-sky-500/20' },
    { label: 'Enerji', val: `${Math.round(stats.power)}/${stats.maxPower} kW`, icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-500/20' },
    { label: 'Oksijen', val: `${Math.round(stats.oxygen)}%`, icon: Wind, color: 'text-teal-400', bg: 'bg-teal-400/10 border-teal-500/20' },
    { label: 'Su', val: `${Math.round(stats.water)} L`, icon: Droplet, color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-500/20' },
    { label: 'Besin', val: `${Math.round(stats.food)} kg`, icon: Apple, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-500/20' },
    { label: 'Maden', val: `${Math.round(stats.minerals)} t`, icon: Pickaxe, color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-500/20' },
    { label: 'Kredi', val: `₺${Math.round(stats.credits).toLocaleString()}`, icon: Coins, color: 'text-amber-300', bg: 'bg-amber-300/10 border-amber-400/20' },
  ];

  const handleNextSol = () => {
    nextSolMutation.mutate(undefined, {
      onSuccess: (data) => {
        setReport(data);
      },
    });
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
        {/* 8 Kaynak Kartı */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 flex-1">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border backdrop-blur-md ${item.bg} transition-all hover:scale-102`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${item.color}`} />
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider leading-none mb-0.5">{item.label}</span>
                  <span className="text-xs font-bold text-slate-100 truncate">{item.val}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sonraki Sol Butonu */}
        <button
          onClick={handleNextSol}
          disabled={nextSolMutation.isPending}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-black tracking-wider text-amber-200 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 shadow-lg shadow-rose-950/40 border border-amber-400/40 transition-all hover:scale-102 active:scale-98 disabled:opacity-50 cursor-pointer shrink-0"
          title="Zamanı 1 gün ilerlet ve üretimi simüle et"
        >
          <FastForward className={`w-4 h-4 ${nextSolMutation.isPending ? 'animate-spin' : ''}`} />
          <span>{nextSolMutation.isPending ? 'Simüle Ediliyor...' : 'SONRAKİ SOL ☀️'}</span>
        </button>
      </div>

      {/* Gün Sonu Simülasyon Rapor Modalı */}
      {report && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl shadow-rose-950/50">
            {/* Başlık */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Sun className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-100">Sol {report.sol} Günlük Raporu</h2>
                  <p className="text-xs text-slate-400">Gezegen döngüsü tamamlandı, kaynaklar güncellendi.</p>
                </div>
              </div>
              <button
                onClick={() => setReport(null)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Üretim / Tüketim Dengesi */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="font-bold text-slate-300 flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-emerald-400" /> Üretilen</span>
                <p className="text-emerald-400 font-semibold">⚡ +{report.powerProduced} kW Güç</p>
                <p className="text-cyan-400 font-semibold">💧 +{report.waterProduced} L Su</p>
                <p className="text-emerald-300 font-semibold">🌾 +{report.foodProduced} kg Besin</p>
                <p className="text-orange-400 font-semibold">⛏️ +{report.mineralsProduced} t Maden</p>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="font-bold text-slate-300 flex items-center gap-1.5"><TrendingDown className="w-4 h-4 text-rose-400" /> Tüketilen</span>
                <p className="text-rose-400 font-semibold">⚡ -{report.powerConsumed} kW Tüketim</p>
                <p className="text-rose-300 font-semibold">💧 -{report.waterConsumed} L Tüketim</p>
                <p className="text-rose-300 font-semibold">🌾 -{report.foodConsumed} kg Tüketim</p>
                <p className="text-slate-400 font-semibold">👥 {report.workingColonists} Çalışan / {report.idleColonists} Dinlenen</p>
              </div>
            </div>

            {/* Günlük Log Kayıtları */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Simülasyon Olay Günlüğü</span>
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 space-y-2 max-h-40 overflow-y-auto text-xs">
                {report.logMessages.map((msg, i) => (
                  <div key={i} className="flex items-start gap-2">
                    {msg.includes('KRİTİK') || msg.includes('UYARI') ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    <span className={msg.includes('KRİTİK') ? 'text-rose-400 font-bold' : msg.includes('UYARI') ? 'text-amber-300' : 'text-slate-300'}>
                      {msg}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Kapat Butonu */}
            <button
              onClick={() => setReport(null)}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-100 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Raporu Kapat ve Operasyona Devam Et
            </button>
          </div>
        </div>
      )}
    </>
  );
}