'use client';

import React from 'react';
import ResourceBar from '@/features/colony/components/ResourceBar';
import { useTechTree } from '@/features/research/api/researchApi';
import { FlaskConical, Play } from 'lucide-react';

export default function ResearchPage() {
  const { data: techs, isLoading } = useTechTree();

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 w-full space-y-6">
      <ResourceBar />

      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
          <FlaskConical className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-100">Teknoloji ve Araştırma Ağacı</h1>
          <p className="text-xs text-slate-400">Yeni teknolojileri araştırarak koloni verimliliğini artırın.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="p-6 text-center text-slate-400 animate-pulse">Teknoloji ağacı yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {techs?.map((tech) => (
            <div
              key={tech.id}
              className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-3 shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">{tech.category}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    tech.status === 'Tamamlandı' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    tech.status === 'Araştırılıyor' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {tech.status}
                  </span>
                </div>
                <h3 className="font-bold text-slate-100 text-base">{tech.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{tech.description}</p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>İlerleme</span>
                  <span className="font-semibold text-slate-200">{tech.progress}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${tech.progress}%` }}
                  />
                </div>
              </div>

              {tech.status !== 'Tamamlandı' && (
                <button className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-teal-200 bg-teal-950/80 hover:bg-teal-900 border border-teal-700/60 transition-colors mt-2">
                  <Play className="w-3.5 h-3.5 text-teal-400" />
                  <span>Araştırmayı Başlat ({tech.cost} AP)</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
