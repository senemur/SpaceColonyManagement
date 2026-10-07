'use client';

import React from 'react';
import ColonistList from '@/features/colonists/components/ColonistList';
import ResourceBar from '@/features/colony/components/ResourceBar';
import { Users, UserPlus } from 'lucide-react';

export default function ColonistsPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 w-full space-y-6">
      <ResourceBar />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100">Koloni Mürettebatı</h1>
            <p className="text-xs text-slate-400">Mars ekibinizin sağlık, moral ve görev durumunu yönetin.</p>
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-sky-200 bg-sky-950/80 hover:bg-sky-900 border border-sky-700/60 transition-colors shadow-lg">
          <UserPlus className="w-4 h-4 text-sky-400" />
          <span>Yeni Mürettebat Çağır (Ares Mekiği)</span>
        </button>
      </div>

      <ColonistList />
    </div>
  );
}
