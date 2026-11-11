'use client';

import React, { useState, useMemo } from 'react';
import ResourceBar from '@/features/colony/components/ResourceBar';
import { useMissions, useStartMission, ExplorationMission } from '@/features/exploration/api/explorationApi';
import { useColonyOverview } from '@/features/colony/api/colonyApi';
import {
  Compass,
  Send,
  Clock,
  Zap,
  Droplets,
  Coins,
  Mountain,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Flame,
  Radio,
  Sparkles,
  ShieldAlert,
  RotateCw
} from 'lucide-react';

export default function ExplorationPage() {
  const { data: missions = [], isLoading } = useMissions(1);
  const { data: colony } = useColonyOverview();
  const startMissionMutation = useStartMission(1);

  const [filter, setFilter] = useState<'all' | 'available' | 'in_progress' | 'history'>('all');
  const [actionError, setActionError] = useState<string | null>(null);

  const stats = colony?.stats;

  const inProgressMissions = useMemo(
    () => missions.filter((m) => m.status === 2),
    [missions]
  );

  const filteredMissions = useMemo(() => {
    if (filter === 'available') return missions.filter((m) => m.status === 1);
    if (filter === 'in_progress') return missions.filter((m) => m.status === 2);
    if (filter === 'history') return missions.filter((m) => m.status === 3 || m.status === 4);
    return missions;
  }, [missions, filter]);

  const statsSummary = useMemo(() => {
    return {
      total: missions.length,
      available: missions.filter((m) => m.status === 1).length,
      inProgress: inProgressMissions.length,
      completed: missions.filter((m) => m.status === 3).length,
      failed: missions.filter((m) => m.status === 4).length,
    };
  }, [missions, inProgressMissions]);

  const handleStartMission = (mission: ExplorationMission) => {
    setActionError(null);

    if (stats) {
      if (stats.power < mission.energyCost) {
        setActionError(`Yetersiz Güç! Bu görev için ${mission.energyCost} kW gerekiyor.`);
        return;
      }
      if (stats.water < mission.waterCost) {
        setActionError(`Yetersiz Su! Bu görev için ${mission.waterCost} L gerekiyor.`);
        return;
      }
      if (stats.credits < mission.creditsCost) {
        setActionError(`Yetersiz Kredi! Bu görev için ₺${mission.creditsCost} gerekiyor.`);
        return;
      }
    }

    startMissionMutation.mutate(mission.id, {
      onError: (err: any) => {
        setActionError(err.response?.data?.message || 'Görev başlatılamadı.');
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 w-full space-y-6">
      <ResourceBar />

      {/* Header Banner */}
      <div className="bg-slate-900/60 p-4 md:p-5 rounded-2xl border border-slate-800 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Mars Keşif Operasyonları
              {inProgressMissions.length > 0 && (
                <span className="animate-pulse bg-purple-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {inProgressMissions.length} Keşif Yolda
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-400">
              Rover filonuzu ve bilim insanlarını bilinmeyen kraterlere göndererek kaynak ve artefakt toplayın.
            </p>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-1.5 text-center">
            <span className="block text-xs text-slate-400">Toplam Görev</span>
            <span className="text-sm font-bold text-slate-200">{statsSummary.total}</span>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-1.5 text-center">
            <span className="block text-xs text-emerald-400">Hazır</span>
            <span className="text-sm font-bold text-emerald-300">{statsSummary.available}</span>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl px-3 py-1.5 text-center">
            <span className="block text-xs text-purple-400">Yolda</span>
            <span className="text-sm font-bold text-purple-300">{statsSummary.inProgress}</span>
          </div>
          <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl px-3 py-1.5 text-center">
            <span className="block text-xs text-sky-400">Tamamlanan</span>
            <span className="text-sm font-bold text-sky-300">{statsSummary.completed}</span>
          </div>
        </div>
      </div>

      {/* Action Error Callout */}
      {actionError && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button
            onClick={() => setActionError(null)}
            className="text-rose-400 hover:text-rose-200 text-xs underline font-semibold ml-4"
          >
            Kapat
          </button>
        </div>
      )}

      {/* Active Missions Showcase Banner */}
      {inProgressMissions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 px-1">
            <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>Şu Anda Yolda Olan Keşif Ekipleri</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inProgressMissions.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl p-4.5 bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/40 backdrop-blur-md shadow-lg shadow-purple-950/20 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider">
                      {m.targetZone}
                    </span>
                    <h3 className="font-bold text-slate-100 text-base">{m.name}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 bg-purple-500/20 border border-purple-400/40 rounded-full px-2.5 py-1 text-xs font-bold text-purple-200">
                    <Clock className="w-3.5 h-3.5 text-purple-300 animate-spin-slow" />
                    <span>{m.remainingSols} Sol Kaldı</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300">{m.resultSummary || m.description}</p>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <span>Görev İlerlemesi</span>
                    <span>
                      {m.durationInSols - m.remainingSols} / {m.durationInSols} Sol
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(
                          15,
                          ((m.durationInSols - m.remainingSols) / m.durationInSols) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="text-[11px] text-emerald-400 font-semibold bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span>Beklenen Ödül:</span>
                  <span className="font-bold">{m.rewardDescription}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            filter === 'all'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          Tümü ({missions.length})
        </button>
        <button
          onClick={() => setFilter('available')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            filter === 'available'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          Mevcut Görevler ({statsSummary.available})
        </button>
        <button
          onClick={() => setFilter('in_progress')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            filter === 'in_progress'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          Yolda Olanlar ({statsSummary.inProgress})
        </button>
        <button
          onClick={() => setFilter('history')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            filter === 'history'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          Görev Geçmişi ({statsSummary.completed + statsSummary.failed})
        </button>
      </div>

      {/* Missions Grid */}
      {isLoading ? (
        <div className="p-8 text-center text-slate-400 animate-pulse bg-slate-900/40 rounded-2xl border border-slate-800">
          Mars keşif görevleri yükleniyor...
        </div>
      ) : filteredMissions.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800/50">
          <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-medium">Bu kategoride gösterilecek görev bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMissions.map((m) => {
            const isAvailable = m.status === 1;
            const isInProgress = m.status === 2;
            const isCompleted = m.status === 3;
            const isFailed = m.status === 4;

            const isLowRisk = m.riskLevel === 1;
            const isMedRisk = m.riskLevel === 2;
            const isHighRisk = m.riskLevel === 3;

            return (
              <div
                key={m.id}
                className={`bg-slate-900/80 backdrop-blur-md border rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-xl ${
                  isInProgress
                    ? 'border-purple-500/50 shadow-purple-950/20'
                    : isCompleted
                    ? 'border-emerald-600/30 hover:border-emerald-500/50'
                    : isFailed
                    ? 'border-rose-600/30 hover:border-rose-500/50'
                    : 'border-slate-800 hover:border-purple-600/50 hover:shadow-purple-950/10'
                }`}
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                      {m.targetZone}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        isLowRisk
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : isMedRisk
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {m.riskLevelName} Risk
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-100 text-base leading-snug">{m.name}</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{m.description}</p>
                  </div>

                  {/* Maliyet & Süre Rozetleri */}
                  <div className="grid grid-cols-3 gap-2 text-center bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Güç</span>
                      <span className="font-bold text-yellow-400 flex items-center justify-center gap-0.5">
                        <Zap className="w-3 h-3" />
                        {m.energyCost > 0 ? `${m.energyCost} kW` : 'Ücretsiz'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Su</span>
                      <span className="font-bold text-cyan-400 flex items-center justify-center gap-0.5">
                        <Droplets className="w-3 h-3" />
                        {m.waterCost > 0 ? `${m.waterCost} L` : 'Ücretsiz'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Süre</span>
                      <span className="font-bold text-slate-200 flex items-center justify-center gap-0.5">
                        <Clock className="w-3 h-3 text-purple-400" />
                        {m.durationInSols} Sol
                      </span>
                    </div>
                  </div>

                  {/* Ödül Kutusu */}
                  <div className="text-xs bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-xl text-emerald-300 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                      Görev Kazanımları
                    </span>
                    <p className="font-semibold">{m.rewardDescription}</p>
                  </div>

                  {/* Sonuç Bilgisi (Geçmiş Görevler İçin) */}
                  {m.resultSummary && (
                    <div
                      className={`text-xs p-2.5 rounded-xl border ${
                        isCompleted
                          ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                          : isFailed
                          ? 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                          : 'bg-purple-950/30 border-purple-500/20 text-purple-300'
                      }`}
                    >
                      <p className="font-medium leading-relaxed">{m.resultSummary}</p>
                    </div>
                  )}
                </div>

                {/* Buton veya Durum Göstergesi */}
                <div>
                  {isAvailable && (
                    <button
                      onClick={() => handleStartMission(m)}
                      disabled={startMissionMutation.isPending}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-purple-200 bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-950/30 disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-purple-400" />
                      <span>{startMissionMutation.isPending ? 'Başlatılıyor...' : 'Keşif Ekibini Gönder'}</span>
                    </button>
                  )}

                  {isInProgress && (
                    <div className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30">
                      <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                      <span>Keşifte (Kalan: {m.remainingSols} Sol)</span>
                    </div>
                  )}

                  {isCompleted && (
                    <div className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Görev Başarıyla Tamamlandı (Sol {m.completedSol})</span>
                    </div>
                  )}

                  {isFailed && (
                    <div className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/10 border border-rose-500/30">
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>Görev Başarısız Oldu (Sol {m.completedSol})</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
