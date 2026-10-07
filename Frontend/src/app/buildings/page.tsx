'use client';

import React from 'react';
import BuildingGrid from '@/features/buildings/components/BuildingGrid';
import ResourceBar from '@/features/colony/components/ResourceBar';
import { Building2, PlusCircle } from 'lucide-react';

export default function BuildingsPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 w-full space-y-6">
      <ResourceBar />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100">Koloni Yapıları ve Tesisler</h1>
            <p className="text-xs text-slate-400">Üretim modüllerini denetleyin ve seviyelerini yükseltin.</p>
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-amber-200 bg-amber-950/80 hover:bg-amber-900 border border-amber-700/60 transition-colors shadow-lg">
          <PlusCircle className="w-4 h-4 text-amber-400" />
          <span>Yeni Yapı İnşa Et</span>
        </button>
      </div>

      <BuildingGrid />
    </div>
  );
}
