'use client';

import React, { useState, useMemo } from 'react';
import ResourceBar from '@/features/colony/components/ResourceBar';
import { useEvents, ColonyEvent } from '@/features/events/api/eventsApi';
import { useActiveColony } from '@/features/colony/context/ColonyContext';
import {
  ScrollText,
  Info,
  AlertTriangle,
  CheckCircle,
  AlertOctagon,
  Zap,
  Activity,
  Flame,
  ShieldAlert,
  Clock,
  Sparkles,
  Droplets,
  Wheat,
  Coins,
  Mountain
} from 'lucide-react';

export default function EventsPage() {
  const { activeColonyId, activeColony, activeZone } = useActiveColony();
  const { data: events = [], isLoading } = useEvents(activeColonyId);
  const [filter, setFilter] = useState<'all' | 'active' | 'Critical' | 'Warning' | 'Success' | 'Info'>('all');

  const activeEvents = useMemo(() => events.filter((e) => e.isActive), [events]);

  const filteredEvents = useMemo(() => {
    if (filter === 'all') return events;
    if (filter === 'active') return events.filter((e) => e.isActive);
    return events.filter((e) => e.typeName === filter);
  }, [events, filter]);

  const stats = useMemo(() => {
    return {
      total: events.length,
      active: activeEvents.length,
      critical: events.filter((e) => e.typeName === 'Critical').length,
      success: events.filter((e) => e.typeName === 'Success').length,
    };
  }, [events, activeEvents]);

  const renderEffectBadge = (ev: ColonyEvent) => {
    if (!ev.effectTypeName || ev.effectTypeName === 'None') return null;

    const val = ev.effectValue;
    const isPositive = val > 0;
    const formattedVal = Math.abs(val);

    switch (ev.effectTypeName) {
      case 'PowerProductionModifier':
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
          }`}>
            <Zap className="w-3 h-3" />
            {isPositive ? `+%${formattedVal}` : `-%${formattedVal}`} Enerji Üretimi
          </span>
        );
      case 'FoodProductionModifier':
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
          }`}>
            <Wheat className="w-3 h-3" />
            {isPositive ? `+%${formattedVal}` : `-%${formattedVal}`} Besin Üretimi
          </span>
        );
      case 'WaterProductionModifier':
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
          }`}>
            <Droplets className="w-3 h-3" />
            {isPositive ? `+%${formattedVal}` : `-%${formattedVal}`} Su Üretimi
          </span>
        );
      case 'MineralGrant':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Mountain className="w-3 h-3" />
            +{val} Maden
          </span>
        );
      case 'WaterGrant':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Droplets className="w-3 h-3" />
            +{val} Su
          </span>
        );
      case 'FoodGrant':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Wheat className="w-3 h-3" />
            +{val} Besin
          </span>
        );
      case 'CreditGrant':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Coins className="w-3 h-3" />
            +{val} Kredi
          </span>
        );
      case 'ColonistHealthEffect':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <Activity className="w-3 h-3" />
            {val} Sağlık/Moral
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 w-full space-y-6">
      <ResourceBar colonyId={activeColonyId} />

      {/* Header Banner */}
      <div className="bg-slate-900/60 p-4 md:p-5 rounded-2xl border border-slate-800 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <ScrollText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Koloni Olay ve Bildirim Günlüğü
                {activeEvents.length > 0 && (
                  <span className="animate-pulse bg-rose-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {activeEvents.length} Aktif Durum
                  </span>
                )}
              </h1>
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-bold border"
                style={{
                  backgroundColor: `${activeZone.color}20`,
                  borderColor: activeZone.color,
                  color: activeZone.color,
                }}
              >
                {activeColony?.name ?? activeZone.name}
              </span>
            </div>
            <p className="text-xs text-slate-400">Mars üssünüzdeki tüm kritik gelişmeler, fırtınalar, keşifler ve sistem raporları.</p>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-1.5 text-center">
            <span className="block text-xs text-slate-400">Toplam Kayıt</span>
            <span className="text-sm font-bold text-slate-200">{stats.total}</span>
          </div>
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-1.5 text-center">
            <span className="block text-xs text-rose-400">Aktif Olay</span>
            <span className="text-sm font-bold text-rose-300">{stats.active}</span>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-1.5 text-center">
            <span className="block text-xs text-amber-400">Kritik</span>
            <span className="text-sm font-bold text-amber-300">{stats.critical}</span>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-1.5 text-center">
            <span className="block text-xs text-emerald-400">Başarı</span>
            <span className="text-sm font-bold text-emerald-300">{stats.success}</span>
          </div>
        </div>
      </div>

      {/* Active Events Callout Banner */}
      {activeEvents.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 px-1">
            <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>Aktif Koloni Durumları (Etkisi Süren Gelişmeler)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeEvents.map((act) => {
              const isCrit = act.typeName === 'Critical';
              return (
                <div
                  key={act.id}
                  className={`rounded-2xl p-4 border backdrop-blur-md relative overflow-hidden transition-all shadow-lg ${
                    isCrit
                      ? 'bg-rose-950/40 border-rose-500/40 shadow-rose-900/20'
                      : 'bg-amber-950/30 border-amber-500/40 shadow-amber-900/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isCrit ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {isCrit ? <ShieldAlert className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-100 text-sm leading-tight">{act.title}</h3>
                        <span className="text-[11px] text-slate-400">Sol {act.sol} tarihinde başladı</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-700/60 rounded-full px-2.5 py-1 text-[11px] font-bold text-amber-300">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{act.remainingSols} Sol Kaldı</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 mb-3 leading-relaxed">{act.message}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <div>{renderEffectBadge(act)}</div>
                    <span className="text-[10px] text-slate-400 font-medium">Toplam Süre: {act.durationInSols} Sol</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            filter === 'all'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          Tümü ({events.length})
        </button>
        {activeEvents.length > 0 && (
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              filter === 'active'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Aktifler ({activeEvents.length})
          </button>
        )}
        <button
          onClick={() => setFilter('Critical')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            filter === 'Critical'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          Kritik ({stats.critical})
        </button>
        <button
          onClick={() => setFilter('Warning')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            filter === 'Warning'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          Uyarılar
        </button>
        <button
          onClick={() => setFilter('Success')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            filter === 'Success'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          Başarılar ({stats.success})
        </button>
        <button
          onClick={() => setFilter('Info')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            filter === 'Info'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          Bilgilendirme
        </button>
      </div>

      {/* Events List */}
      {isLoading ? (
        <div className="p-8 text-center text-slate-400 animate-pulse bg-slate-900/40 rounded-2xl border border-slate-800">
          Olay günlüğü yükleniyor...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800/50">
          <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-medium">Bu filtreye uygun herhangi bir olay kaydı bulunamadı.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEvents.map((ev) => {
            const isSuccess = ev.typeName === 'Success';
            const isWarning = ev.typeName === 'Warning';
            const isCritical = ev.typeName === 'Critical';

            return (
              <div
                key={ev.id}
                className="bg-slate-900/70 backdrop-blur-md border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 flex items-start gap-3.5 shadow-md transition-all hover:bg-slate-900/90"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    isSuccess
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : isWarning
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : isCritical
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      : 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                  }`}
                >
                  {isSuccess && <CheckCircle className="w-4 h-4" />}
                  {isWarning && <AlertTriangle className="w-4 h-4" />}
                  {isCritical && <AlertOctagon className="w-4 h-4" />}
                  {!isSuccess && !isWarning && !isCritical && <Info className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-100 text-sm">{ev.title}</h3>
                      {ev.isActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Aktif ({ev.remainingSols} Sol)
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-slate-400">
                      Sol {ev.sol} {ev.time ? `· ${ev.time}` : ''}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-2">{ev.message}</p>

                  {renderEffectBadge(ev)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
