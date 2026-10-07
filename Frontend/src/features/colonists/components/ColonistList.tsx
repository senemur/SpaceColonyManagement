'use client';

import React from 'react';
import { useColonists } from '../api/colonistsApi';
import { User, Activity, Heart, Smile, Building, ShieldAlert } from 'lucide-react';

export default function ColonistList() {
  const { data: colonists, isLoading } = useColonists();

  if (isLoading) {
    return (
      <div className="p-6 text-center text-slate-400 animate-pulse">
        Mürettebat listesi yükleniyor...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {colonists?.map((colonist) => (
        <div
          key={colonist.id}
          className="bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:border-rose-600/50 rounded-xl p-4 flex flex-col gap-3 transition-all hover:shadow-lg hover:shadow-rose-950/30"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md"
                style={{ backgroundColor: colonist.avatarColor || '#38bdf8' }}
              >
                {colonist.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-slate-100 text-sm">{colonist.name}</h3>
                <p className="text-xs text-slate-400">{colonist.role}</p>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                colonist.status === 'Working'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : colonist.status === 'Exploring'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
              }`}
            >
              {colonist.status}
            </span>
          </div>

          {/* Stats Bar */}
          <div className="space-y-1.5 pt-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400" /> Sağlık
              </span>
              <span className="font-semibold text-slate-200">{colonist.health}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${colonist.health}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-amber-400" /> Dayanıklılık
              </span>
              <span className="font-semibold text-slate-200">{colonist.stamina}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${colonist.stamina}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Smile className="w-3.5 h-3.5 text-emerald-400" /> Moral
              </span>
              <span className="font-semibold text-slate-200">{colonist.morale}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${colonist.morale}%` }}
              />
            </div>
          </div>

          {/* Location / Assigned Building */}
          {colonist.currentBuilding && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800/80">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              <span>Görev Alanı: <strong className="text-slate-200">{colonist.currentBuilding}</strong></span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
