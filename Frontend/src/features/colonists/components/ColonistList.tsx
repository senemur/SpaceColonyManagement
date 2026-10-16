'use client';

import React from 'react';
import { useColonists, useAssignColonist } from '../api/colonistsApi';
import { useBuildings } from '@/features/buildings/api/buildingsApi';
import { ColonistRole } from '../types';
import { 
  Heart, 
  Smile, 
  Building, 
  Briefcase, 
  Wrench, 
  Sprout, 
  Pickaxe, 
  Stethoscope, 
  Cpu, 
  FlaskConical, 
  Crown,
  User,
  Activity
} from 'lucide-react';

const roleConfig: Record<ColonistRole, { label: string, icon: React.ComponentType<{ className?: string }>, color: string, bg: string }> = {
  [ColonistRole.Worker]: { label: 'Genel İşçi', icon: User, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  [ColonistRole.Commander]: { label: 'Komutan', icon: Crown, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
  [ColonistRole.Engineer]: { label: 'Mühendis', icon: Wrench, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  [ColonistRole.Biologist]: { label: 'Biyolog', icon: Sprout, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  [ColonistRole.Miner]: { label: 'Madenci', icon: Pickaxe, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
  [ColonistRole.Doctor]: { label: 'Doktor', icon: Stethoscope, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/30' },
  [ColonistRole.Technician]: { label: 'Teknisyen', icon: Cpu, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30' },
  [ColonistRole.Scientist]: { label: 'Bilim İnsanı', icon: FlaskConical, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/30' },
  [ColonistRole.Civilian]: { label: 'Sivil', icon: User, color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/30' },
};

export default function ColonistList({ colonyId = 1 }: { colonyId?: number }) {
  const { data: colonists, isLoading } = useColonists(colonyId);
  const { data: buildings } = useBuildings(colonyId);
  const assignMutation = useAssignColonist(colonyId);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-400 animate-pulse">
        Mürettebat listesi Supabase veritabanından yükleniyor...
      </div>
    );
  }

  if (!colonists || colonists.length === 0) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
        <User className="w-12 h-12 text-slate-600 mx-auto" />
        <p className="text-sm font-bold text-slate-200">Bu kolonide henüz mürettebat personeli yok.</p>
        <p className="text-xs text-slate-400">Yukarıdaki &quot;Yeni Mürettebat Çağır&quot; butonunu kullanarak ilk ekibinizi getirebilirsiniz.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {colonists.map((c) => {
        const config = roleConfig[c.role] ?? roleConfig[ColonistRole.Worker];
        const RoleIcon = config.icon;

        return (
          <div
            key={c.id}
            className="bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:border-sky-600/50 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-xl hover:shadow-sky-950/20"
          >
            <div>
              {/* Üst Başlık & Rol */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${config.bg} ${config.color}`}>
                    <RoleIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm">{c.name}</h3>
                    <span className="text-[11px] text-sky-400 font-semibold">{config.label}</span>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  c.isAssigned
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {c.isAssigned ? 'GÖREVDE' : 'BOŞTA'}
                </span>
              </div>

                           {/* Sağlık, Dayanıklılık & Moral Barları */}
              <div className="space-y-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-xs">
                {/* Sağlık */}
                <div>
                  <div className="flex items-center justify-between text-slate-300 mb-1">
                    <span className="flex items-center gap-1.5 text-slate-400"><Heart className="w-3.5 h-3.5 text-rose-400" /> Sağlık:</span>
                    <span className="font-bold text-rose-400">%{c.health}</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: `${c.health}%` }} />
                  </div>
                </div>

                {/* Dayanıklılık (Stamina) */}
                <div>
                  <div className="flex items-center justify-between text-slate-300 mb-1">
                    <span className="flex items-center gap-1.5 text-slate-400"><Activity className="w-3.5 h-3.5 text-amber-400" /> Dayanıklılık:</span>
                    <span className="font-bold text-amber-400">%{c.stamina}</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full transition-all" style={{ width: `${c.stamina}%` }} />
                  </div>
                </div>

                {/* Moral */}
                <div>
                  <div className="flex items-center justify-between text-slate-300 mb-1">
                    <span className="flex items-center gap-1.5 text-slate-400"><Smile className="w-3.5 h-3.5 text-emerald-400" /> Moral:</span>
                    <span className="font-bold text-emerald-400">%{c.morale}</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full transition-all" style={{ width: `${c.morale}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Görev Atama / Bina Seçimi */}
            <div className="space-y-1.5 border-t border-slate-800/80 pt-3">
              <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" /> Görevlendirildiği Bina:
              </label>

              <select
                value={c.buildingId ?? ''}
                disabled={assignMutation.isPending || c.health < 20}
                onChange={(e) => {
                  const val = e.target.value;
                  assignMutation.mutate({
                    colonistId: c.id,
                    buildingId: val ? Number(val) : null,
                  });
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer disabled:opacity-50"
              >
                <option value="">-- Boşta (Görev Yok) --</option>
                {buildings?.map((b) => (
                  <option 
                    key={b.id} 
                    value={b.id}
                    disabled={!b.isActive || (b.workers >= b.maxWorkers && b.id !== c.buildingId)}
                  >
                    {b.name} ({b.workers}/{b.maxWorkers}) {!b.isActive ? '[Devre Dışı]' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      })}
    </div>
  );
}