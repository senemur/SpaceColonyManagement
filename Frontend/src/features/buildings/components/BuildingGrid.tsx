'use client';

import React from 'react';
import { useBuildings, useUpgradeBuilding } from '../api/buildingsApi';
import { Building2, ArrowUpCircle, Zap, TrendingUp, Users } from 'lucide-react';

export default function BuildingGrid() {
  const { data: buildings, isLoading } = useBuildings();
  const upgradeMutation = useUpgradeBuilding();

  if (isLoading) {
    return (
      <div className="p-6 text-center text-slate-400 animate-pulse">
        Yapılar yükleniyor...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {buildings?.map((b) => (
        <div
          key={b.id}
          className="bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:border-amber-600/50 rounded-xl p-4 flex flex-col justify-between gap-3 transition-all hover:shadow-lg hover:shadow-amber-950/20"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 text-sm">{b.name}</h3>
                  <span className="text-xs text-amber-400 font-medium">Seviye {b.level}</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {b.status}
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3">{b.description}</p>

            <div className="space-y-1 text-xs bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
              <div className="flex items-center justify-between text-emerald-400 font-medium">
                <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> Üretim:</span>
                <span>{b.production}</span>
              </div>
              <div className="flex items-center justify-between text-rose-400 font-medium">
                <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Tüketim:</span>
                <span>{b.consumption}</span>
              </div>
              <div className="flex items-center justify-between text-sky-400 font-medium">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Kapasite:</span>
                <span>{b.capacity}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => upgradeMutation.mutate(b.id)}
            disabled={upgradeMutation.isPending}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-amber-200 bg-amber-950/80 hover:bg-amber-900 border border-amber-700/60 transition-colors disabled:opacity-50"
          >
            <ArrowUpCircle className="w-4 h-4 text-amber-400" />
            <span>Seviye Yükselt (SOL {b.level * 50})</span>
          </button>
        </div>
      ))}
    </div>
  );
}
