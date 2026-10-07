'use client';

import React, { useState } from 'react';
import { Building2, Sprout, Droplets, Scissors, LogOut, CheckCircle2 } from 'lucide-react';

interface BuildingInspectPanelProps {
  buildingName: string | null;
  onExitBuilding: () => void;
}

export default function BuildingInspectPanel({ buildingName, onExitBuilding }: BuildingInspectPanelProps) {
  const [taskStatus, setTaskStatus] = useState<string | null>(null);

  if (!buildingName) return null;

  const isFarm = buildingName.toLowerCase().includes('sera') || buildingName.toLowerCase().includes('farm');
  const isMine = buildingName.toLowerCase().includes('maden');
  const isLab = buildingName.toLowerCase().includes('laboratuvar');

  const handleAction = (actionName: string) => {
    setTaskStatus(`${actionName} görevi gerçekleştirildi!`);
    setTimeout(() => setTaskStatus(null), 3000);
  };

  return (
    <div className="absolute right-4 top-20 z-30 w-80 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-2xl shadow-rose-950/30 text-slate-100 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100">{buildingName}</h3>
            <span className="text-[11px] text-emerald-400 font-medium">Bina İçerisinde</span>
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {taskStatus && (
        <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3 py-2 rounded-xl text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{taskStatus}</span>
        </div>
      )}

      {/* Specific Tasks */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">İç Mekan Görevleri</span>

        {isFarm && (
          <>
            <button
              onClick={() => handleAction('Toprağı Çapala')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/50 text-emerald-200 transition-colors"
            >
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>Toprağı Çapala</span>
            </button>
            <button
              onClick={() => handleAction('Bitkileri Sula')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-700/50 text-cyan-200 transition-colors"
            >
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Bitkileri Sula</span>
            </button>
            <button
              onClick={() => handleAction('Ürünleri Hasat Et')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-950/60 hover:bg-amber-900/80 border border-amber-700/50 text-amber-200 transition-colors"
            >
              <Scissors className="w-4 h-4 text-amber-400" />
              <span>Ürünleri Hasat Et (+45 kg Besin)</span>
            </button>
          </>
        )}

        {isMine && (
          <button
            onClick={() => handleAction('Cevher Çıkar')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-orange-950/60 hover:bg-orange-900/80 border border-orange-700/50 text-orange-200 transition-colors"
          >
            <span>Cevher Kırma ve Toplama (+120 t Maden)</span>
          </button>
        )}

        {!isFarm && !isMine && (
          <button
            onClick={() => handleAction('Sistem Denetimi')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
          >
            <span>Modül Bakımını Gerçekleştir</span>
          </button>
        )}
      </div>

      {/* Exit Button */}
      <button
        onClick={onExitBuilding}
        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 transition-colors mt-1"
      >
        <LogOut className="w-4 h-4 text-rose-400" />
        <span>Dışarı Çık (Q)</span>
      </button>
    </div>
  );
}
