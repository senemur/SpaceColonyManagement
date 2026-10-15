'use client';

import React from 'react';
import { useBuildings, useUpgradeBuilding } from '../api/buildingsApi';
import { BuildingType } from '../types';
import { 
  Building2, 
  ArrowUpCircle, 
  Zap, 
  Users, 
  Sun, 
  Apple, 
  Pickaxe, 
  Droplet, 
  FlaskConical,
  Activity
} from 'lucide-react';

const buildingConfig: Record<BuildingType, { icon: React.ComponentType<{ className?: string }>, label: string, color: string, bg: string }> = {
  [BuildingType.Habitat]: { icon: Building2, label: 'Yaşam Kubbesi', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  [BuildingType.SolarPanel]: { icon: Sun, label: 'Güneş Paneli', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  [BuildingType.Greenhouse]: { icon: Apple, label: 'Sera Modülü', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  [BuildingType.Mine]: { icon: Pickaxe, label: 'Maden Kompleksi', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
  [BuildingType.WaterExtractor]: { icon: Droplet, label: 'Su Çıkarma Ünitesi', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
  [BuildingType.ResearchLab]: { icon: FlaskConical, label: 'Araştırma Laboratuvarı', color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/30' },
};

export default function BuildingGrid({ colonyId = 1 }: { colonyId?: number }) {
  const { data: buildings, isLoading } = useBuildings(colonyId);
  const upgradeMutation = useUpgradeBuilding(colonyId);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-400 animate-pulse">
        Koloni yapıları Supabase veritabanından yükleniyor...
      </div>
    );
  }

  if (!buildings || buildings.length === 0) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
        <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
        <p className="text-sm font-bold text-slate-200">Bu kolonide henüz inşa edilmiş bir bina yok</p>
        <p className="text-xs text-slate-400">Yukarıdaki &quot;Yeni Yapı İnşa Et&quot; butonunu kullanarak ilk yapınızı kurabilirsiniz.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {buildings.map((b) => {
        const config = buildingConfig[b.buildingType] ?? buildingConfig[BuildingType.Habitat];
        const Icon = config.icon;

        return (
          <div
            key={b.id}
            className="bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:border-amber-600/50 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-xl hover:shadow-amber-950/20"
          >
            <div>
              {/* Üst Kısım */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${config.bg} ${config.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm">{b.name}</h3>
                    <span className="text-[11px] text-amber-400 font-semibold">{config.label} · Seviye {b.level}</span>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  b.isActive 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}>
                  {b.isActive ? 'AKTİF' : 'DEVRE DIŞI'}
                </span>
              </div>

              {/* İstatistikler */}
              <div className="space-y-1.5 text-xs bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400"><Activity className="w-3.5 h-3.5 text-emerald-400" /> Sağlık Durumu:</span>
                  <span className="font-bold text-emerald-400">%{b.health}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400"><Users className="w-3.5 h-3.5 text-sky-400" /> Çalışan / Kapasite:</span>
                  <span className="font-bold text-sky-400">{b.workers} / {b.maxWorkers} Kişi</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400"><Zap className="w-3.5 h-3.5 text-yellow-400" /> Enerji Dengesi:</span>
                  <span className="font-bold">
                    {b.powerProduction > 0 ? (
                      <span className="text-emerald-400">+{b.powerProduction} kW (Üretim)</span>
                    ) : (
                      <span className="text-rose-400">-{b.powerConsumption} kW (Tüketim)</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Seviye Yükseltme Butonu */}
            <button
              onClick={() => upgradeMutation.mutate(b.id)}
              disabled={upgradeMutation.isPending || b.level >= 5 || !b.isActive}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-amber-200 bg-amber-950/80 hover:bg-amber-900 border border-amber-700/60 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
            >
              <ArrowUpCircle className={`w-4 h-4 text-amber-400 ${upgradeMutation.isPending ? 'animate-spin' : ''}`} />
              <span>
                {b.level >= 5 
                  ? 'Maksimum Seviyede (Seviye 5)' 
                  : `Seviye Yükselt (${b.level} → ${b.level + 1})`}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}