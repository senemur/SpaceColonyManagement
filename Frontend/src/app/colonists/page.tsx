'use client';

import React, { useState } from 'react';
import ColonistList from '@/features/colonists/components/ColonistList';
import ResourceBar from '@/features/colony/components/ResourceBar';
import { Users, UserPlus, X, Rocket } from 'lucide-react';
import { useCreateColonist } from '@/features/colonists/api/colonistsApi';
import { ColonistRole } from '@/features/colonists/types';

export default function ColonistsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<ColonistRole>(ColonistRole.Worker);

  const createMutation = useCreateColonist(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createMutation.mutate(
      {
        colonyId: 1,
        name: name.trim(),
        role: Number(role),
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setName('');
        },
      }
    );
  };

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
            <p className="text-xs text-slate-400">Mars ekibinizin sağlık, moral ve görev durumunu canlı yönetin.</p>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-sky-200 bg-sky-950/80 hover:bg-sky-900 border border-sky-700/60 transition-colors shadow-lg cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-sky-400" />
          <span>Yeni Mürettebat Çağır</span>
        </button>
      </div>

      <ColonistList colonyId={1} />

      {/* Kolonist Ekleme Modalı */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-sky-400" /> Ares Mekiği İle Yeni Mürettebat
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ad Soyad</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Kaan Şahin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Uzmanlık / Rol</label>
                <select
                  value={role}
                  onChange={(e) => setRole(Number(e.target.value) as ColonistRole)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                >
                  <option value={ColonistRole.Worker}>Düz İşçi / Genel Çalışan</option>
                  <option value={ColonistRole.Engineer}>Mühendis (Güneş & Şebeke)</option>
                  <option value={ColonistRole.Biologist}>Biyolog (Tarım & Sera)</option>
                  <option value={ColonistRole.Miner}>Madenci (Maden Kompleksi)</option>
                  <option value={ColonistRole.Doctor}>Doktor (Sağlık & Revir)</option>
                  <option value={ColonistRole.Technician}>Teknisyen (Su & Yaşam Destek)</option>
                  <option value={ColonistRole.Scientist}>Bilim İnsanı (Laboratuvar)</option>
                  <option value={ColonistRole.Civilian}>Sivil Yerleşimci</option>
                  <option value={ColonistRole.Commander}>Komutan</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-sky-200 bg-sky-950 hover:bg-sky-900 border border-sky-700/60 disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Mekik İniyor...' : 'Koloniye Dahil Et'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}