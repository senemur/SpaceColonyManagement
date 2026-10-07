'use client';

import React from 'react';
import { useColonyOverview } from '../api/colonyApi';
import { 
  Zap, 
  Wind, 
  Droplet, 
  Apple, 
  Pickaxe, 
  Coins, 
  Users, 
  Sun 
} from 'lucide-react';

export default function ResourceBar() {
  const { data: colony, isLoading } = useColonyOverview();
  const stats = colony?.stats;

  if (isLoading || !stats) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 flex items-center justify-around text-xs text-slate-400 animate-pulse">
        <span>Kaynaklar yükleniyor...</span>
      </div>
    );
  }

  const items = [
    { label: 'SOL', val: `Sol ${stats.sol}`, icon: Sun, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-500/20' },
    { label: 'Nüfus', val: `${stats.population}/${stats.maxPopulation}`, icon: Users, color: 'text-sky-400', bg: 'bg-sky-400/10 border-sky-500/20' },
    { label: 'Enerji', val: `${stats.power}/${stats.maxPower} kW`, icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-500/20' },
    { label: 'Oksijen', val: `${stats.oxygen}%`, icon: Wind, color: 'text-teal-400', bg: 'bg-teal-400/10 border-teal-500/20' },
    { label: 'Su', val: `${stats.water}%`, icon: Droplet, color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-500/20' },
    { label: 'Besin', val: `${stats.food} kg`, icon: Apple, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-500/20' },
    { label: 'Maden', val: `${stats.minerals} t`, icon: Pickaxe, color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-500/20' },
    { label: 'Kredi', val: `₺${stats.credits.toLocaleString()}`, icon: Coins, color: 'text-amber-300', bg: 'bg-amber-300/10 border-amber-400/20' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border backdrop-blur-md ${item.bg} transition-all hover:scale-102`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${item.color}`} />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider leading-none mb-0.5">{item.label}</span>
              <span className="text-xs font-bold text-slate-100 truncate">{item.val}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
