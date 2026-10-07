'use client';

import React from 'react';
import ResourceBar from '@/features/colony/components/ResourceBar';
import { useEvents } from '@/features/events/api/eventsApi';
import { ScrollText, Info, AlertTriangle, CheckCircle, AlertOctagon } from 'lucide-react';

export default function EventsPage() {
  const { data: events, isLoading } = useEvents();

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 w-full space-y-6">
      <ResourceBar />

      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <ScrollText className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-100">Koloni Olay ve Bildirim Günlüğü</h1>
          <p className="text-xs text-slate-400">Mars üssünüzdeki tüm kritik gelişmeler ve sistem raporları.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="p-6 text-center text-slate-400 animate-pulse">Günlük yükleniyor...</div>
      ) : (
        <div className="space-y-3">
          {events?.map((ev) => {
            const isSuccess = ev.type === 'Success';
            const isWarning = ev.type === 'Warning';
            const isCritical = ev.type === 'Critical';

            return (
              <div
                key={ev.id}
                className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex items-start gap-3.5 shadow-md hover:border-rose-900/40 transition-colors"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    isSuccess ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                    isWarning ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                    isCritical ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
                    'bg-sky-500/10 border-sky-500/30 text-sky-400'
                  }`}
                >
                  {isSuccess && <CheckCircle className="w-4 h-4" />}
                  {isWarning && <AlertTriangle className="w-4 h-4" />}
                  {isCritical && <AlertOctagon className="w-4 h-4" />}
                  {!isSuccess && !isWarning && !isCritical && <Info className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-100 text-sm">{ev.title}</h3>
                    <span className="text-[11px] font-medium text-slate-500">Sol {ev.sol} · {ev.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{ev.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
