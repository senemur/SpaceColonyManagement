'use client';

import React from 'react';
import { OfflineProgressResponse } from '../api/colonyApi';
import { Clock, Zap, Droplets, Wheat, Mountain, ShieldCheck, X } from 'lucide-react';

interface Props {
  report: OfflineProgressResponse | null;
  onClose: () => void;
}

export default function OfflineProgressionModal({ report, onClose }: Props) {
  if (!report || !report.hasProgress) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl shadow-amber-950/30 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Çevrimdışı İlerleme Raporu
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Sprint 4
                </span>
              </h2>
              <p className="text-xs text-slate-400">Üsse tekrar hoş geldiniz, Komutan!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-300 mb-5 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
          {report.summaryMessage}
        </p>

        {/* Kaynak Değişimleri Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-amber-400 mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Güç</span>
            </div>
            <span className={`text-sm font-bold ${report.powerChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {report.powerChange >= 0 ? `+${report.powerChange}` : report.powerChange}
            </span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-blue-400 mb-1">
              <Droplets className="w-3.5 h-3.5" />
              <span>Su</span>
            </div>
            <span className={`text-sm font-bold ${report.waterChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {report.waterChange >= 0 ? `+${report.waterChange}` : report.waterChange}
            </span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-emerald-400 mb-1">
              <Wheat className="w-3.5 h-3.5" />
              <span>Besin</span>
            </div>
            <span className={`text-sm font-bold ${report.foodChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {report.foodChange >= 0 ? `+${report.foodChange}` : report.foodChange}
            </span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-cyan-400 mb-1">
              <Mountain className="w-3.5 h-3.5" />
              <span>Maden</span>
            </div>
            <span className="text-sm font-bold text-emerald-400">
              +{report.mineralsChange}
            </span>
          </div>
        </div>

        {/* Detay Maddeleri */}
        {report.details && report.details.length > 0 && (
          <div className="space-y-1.5 mb-5 max-h-36 overflow-y-auto pr-1">
            {report.details.map((detail, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/40 px-3 py-2 rounded-xl border border-slate-800/80"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{detail}</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98]"
        >
          Koloni Yönetimine Dön
        </button>
      </div>
    </div>
  );
}
