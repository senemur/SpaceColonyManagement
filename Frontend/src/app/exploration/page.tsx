'use client';

import React from 'react';
import ResourceBar from '@/features/colony/components/ResourceBar';
import { useMissions } from '@/features/exploration/api/explorationApi';
import { Compass, Send, ShieldAlert } from 'lucide-react';

export default function ExplorationPage() {
  const { data: missions, isLoading } = useMissions();

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 w-full space-y-6">
      <ResourceBar />

      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-100">Mars Keşif Görevleri</h1>
          <p className="text-xs text-slate-400">Rover ve keşif ekiplerini bilinmeyen kraterlere gönderin.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="p-6 text-center text-slate-400 animate-pulse">Görevler yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {missions?.map((m) => (
            <div
              key={m.id}
              className="bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:border-purple-600/50 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-xl hover:shadow-purple-950/20"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-400">{m.target}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    m.risk === 'Yüksek' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {m.risk} Risk
                  </span>
                </div>
                <h3 className="font-bold text-slate-100 text-base">{m.name}</h3>
                <div className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div>Ödül: <strong className="text-emerald-400">{m.reward}</strong></div>
                  <div>Süre: <strong className="text-slate-200">{m.duration}</strong></div>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-purple-200 bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 transition-colors shadow-lg">
                <Send className="w-4 h-4 text-purple-400" />
                <span>Keşif Ekibini Gönder</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
