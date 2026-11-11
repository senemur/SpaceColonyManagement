'use client';

import React, { useState } from 'react';
import { Building2, Sprout, Droplets, Scissors, LogOut, CheckCircle2, Wrench, Pickaxe, Atom, Sun, Loader2 } from 'lucide-react';
import { performColonyAction, PerformColonyActionResponse } from '@/features/colony/api/colonyApi';
import { useQueryClient } from '@tanstack/react-query';

interface BuildingInspectPanelProps {
  buildingName: string | null;
  buildingId?: number;
  colonyId?: number;
  onExitBuilding: () => void;
  onActionCompleted?: (res: PerformColonyActionResponse) => void;
}

export default function BuildingInspectPanel({
  buildingName,
  buildingId,
  colonyId = 1,
  onExitBuilding,
  onActionCompleted,
}: BuildingInspectPanelProps) {
  const [taskStatus, setTaskStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  if (!buildingName) return null;

  const lowerName = buildingName.toLowerCase();
  const isFarm = lowerName.includes('sera') || lowerName.includes('farm') || lowerName.includes('tarım');
  const isMine = lowerName.includes('maden') || lowerName.includes('mine');
  const isLab = lowerName.includes('laboratuvar') || lowerName.includes('lab') || lowerName.includes('bilim');
  const isSolar = lowerName.includes('güneş') || lowerName.includes('solar') || lowerName.includes('panel');
  const isWater = lowerName.includes('su') || lowerName.includes('water') || lowerName.includes('sondaj');
  const isHabitat = lowerName.includes('habitat') || lowerName.includes('yaşam');
  const isRocket = lowerName.includes('roket') || lowerName.includes('fırlatma') || lowerName.includes('rocket');

  const executeAction = async (actionType: string, defaultAmount: number, label: string) => {
    try {
      setIsLoading(true);
      const res = await performColonyAction(colonyId, actionType, defaultAmount, buildingId);
      setTaskStatus(res.message || `${label} başarıyla tamamlandı!`);
      
      // Invalidate queries so all tabs/stats update
      queryClient.invalidateQueries({ queryKey: ['colony'] });
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      queryClient.invalidateQueries({ queryKey: ['colonists'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['research'] });

      // Notify callback
      if (onActionCompleted) {
        onActionCompleted(res);
      }

      // Also dispatch a window event so mars3d engine can catch and update its internal colony.res
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('colony-action-completed', { detail: res }));
      }

      setTimeout(() => setTaskStatus(null), 4000);
    } catch (err: any) {
      console.error('Colony action error:', err);
      setTaskStatus(err?.response?.data?.message || 'İşlem gerçekleştirilemedi.');
      setTimeout(() => setTaskStatus(null), 4000);
    } finally {
      setIsLoading(false);
    }
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
            <span className="text-[11px] text-emerald-400 font-medium">Bina İçerisinde Aktif</span>
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {taskStatus && (
        <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3 py-2 rounded-xl text-xs font-semibold animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{taskStatus}</span>
        </div>
      )}

      {/* Specific Tasks */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">İç Mekan Görevleri</span>
          {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />}
        </div>

        {isFarm && (
          <>
            <button
              disabled={isLoading}
              onClick={() => executeAction('HarvestFood', 15, 'Toprağı Çapala')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/50 text-emerald-200 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center gap-2.5">
                <Sprout className="w-4 h-4 text-emerald-400" />
                <span>Toprağı Çapala & Gübrele</span>
              </div>
              <span className="text-[10px] text-emerald-400/80">+15 Besin</span>
            </button>
            <button
              disabled={isLoading}
              onClick={() => executeAction('ExtractWater', 25, 'Bitkileri Sula')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-700/50 text-cyan-200 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center gap-2.5">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span>Bitkileri Sula</span>
              </div>
              <span className="text-[10px] text-cyan-400/80">+25 Su</span>
            </button>
            <button
              disabled={isLoading}
              onClick={() => executeAction('HarvestFood', 45, 'Ürünleri Hasat Et')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-amber-950/60 hover:bg-amber-900/80 border border-amber-700/50 text-amber-200 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center gap-2.5">
                <Scissors className="w-4 h-4 text-amber-400" />
                <span>Ürünleri Hasat Et</span>
              </div>
              <span className="text-[10px] text-amber-400/80">+45 Besin</span>
            </button>
          </>
        )}

        {isMine && (
          <button
            disabled={isLoading}
            onClick={() => executeAction('MineOre', 60, 'Cevher Çıkar')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-orange-950/60 hover:bg-orange-900/80 border border-orange-700/50 text-orange-200 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center gap-2.5">
              <Pickaxe className="w-4 h-4 text-orange-400" />
              <span>Regolit Madenciliği</span>
            </div>
            <span className="text-[10px] text-orange-400/80">+60 Mineral</span>
          </button>
        )}

        {isLab && (
          <button
            disabled={isLoading}
            onClick={() => executeAction('ResearchProgress', 15, 'Laboratuvar Analizi')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-sky-950/60 hover:bg-sky-900/80 border border-sky-700/50 text-sky-200 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center gap-2.5">
              <Atom className="w-4 h-4 text-sky-400" />
              <span>Biyolojik Analiz & Araştırma</span>
            </div>
            <span className="text-[10px] text-sky-400/80">+%15 İlerleme</span>
          </button>
        )}

        {isSolar && (
          <button
            disabled={isLoading}
            onClick={() => executeAction('GeneratePower', 35, 'Panel Temizliği')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-yellow-950/60 hover:bg-yellow-900/80 border border-yellow-700/50 text-yellow-200 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center gap-2.5">
              <Sun className="w-4 h-4 text-yellow-400" />
              <span>Güneş Paneli Kalibrasyonu</span>
            </div>
            <span className="text-[10px] text-yellow-400/80">+35 kW Güç</span>
          </button>
        )}

        {isWater && (
          <button
            disabled={isLoading}
            onClick={() => executeAction('ExtractWater', 120, 'Buzul Sondajı ve Filtrasyon')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-700/50 text-cyan-200 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center gap-2.5">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Buzul Sondajı & Filtrasyon</span>
            </div>
            <span className="text-[10px] text-cyan-400/80">+120 L Su</span>
          </button>
        )}

        {isHabitat && (
          <button
            disabled={isLoading}
            onClick={() => executeAction('RepairBuilding', 15, 'Yaşam Desteği ve Basınç Bakımı')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-teal-950/60 hover:bg-teal-900/80 border border-teal-700/50 text-teal-200 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-teal-400" />
              <span>Basınç & Isıtma Kalibrasyonu</span>
            </div>
            <span className="text-[10px] text-teal-400/80">+15 Bütünlük</span>
          </button>
        )}

        {isRocket && (
          <button
            disabled={isLoading}
            onClick={() => executeAction('RepairBuilding', 30, 'Fırlatma Telemetrisi')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-purple-950/60 hover:bg-purple-900/80 border border-purple-700/50 text-purple-200 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center gap-2.5">
              <Atom className="w-4 h-4 text-purple-400" />
              <span>Telemetri & Yörünge Hazırlığı</span>
            </div>
            <span className="text-[10px] text-purple-400/80">+30 Bütünlük</span>
          </button>
        )}

        <button
          disabled={isLoading}
          onClick={() => executeAction('RepairBuilding', 20, 'Modül Bakımı')}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors disabled:opacity-50"
        >
          <div className="flex items-center gap-2.5">
            <Wrench className="w-4 h-4 text-slate-400" />
            <span>Modül Onarımı ve Bakım</span>
          </div>
          <span className="text-[10px] text-slate-400/80">%100 Bütünlük</span>
        </button>
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
