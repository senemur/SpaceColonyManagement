'use client';

import React, { useState } from 'react';
import BuildingGrid from '@/features/buildings/components/BuildingGrid';
import ResourceBar from '@/features/colony/components/ResourceBar';
import { Building2, PlusCircle, X } from 'lucide-react';
import { useCreateBuilding } from '@/features/buildings/api/buildingsApi';
import { BuildingType } from '@/features/buildings/types';

export default function BuildingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<BuildingType>(BuildingType.Habitat);
  
  const createMutation = useCreateBuilding(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let powerConsumption = 20;
    let powerProduction = 0;
    let maxWorkers = 4;

    if (type === BuildingType.SolarPanel) {
      powerConsumption = 0;
      powerProduction = 200;
      maxWorkers = 0;
    } else if (type === BuildingType.Mine) {
      powerConsumption = 50;
      maxWorkers = 6;
    }

    createMutation.mutate(
      {
        colonyId: 1,
        name: name.trim(),
        buildingType: type,
        maxWorkers,
        powerConsumption,
        powerProduction,
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
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100">Koloni Yapıları ve Tesisler</h1>
            <p className="text-xs text-slate-400">Supabase canlı veritabanı üzerinden tesis yönetimi ve inşaat.</p>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-amber-200 bg-amber-950/80 hover:bg-amber-900 border border-amber-700/60 transition-colors shadow-lg cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          <span>Yeni Yapı İnşa Et</span>
        </button>
      </div>

      <BuildingGrid colonyId={1} />

      {/* İnşaat Modalı */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" /> Yeni Yapı İnşa Et
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bina Adı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Güneş Paneli Tarlası B"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bina Türü</label>
                <select
                  value={type}
                  onChange={(e) => setType(Number(e.target.value) as BuildingType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value={BuildingType.Habitat}>Yaşam Kubbesi (Habitat)</option>
                  <option value={BuildingType.SolarPanel}>Güneş Paneli Tarlası</option>
                  <option value={BuildingType.Greenhouse}>Hidroponik Sera Modülü</option>
                  <option value={BuildingType.Mine}>Maden Kompleksi</option>
                  <option value={BuildingType.WaterExtractor}>Yeraltı Buz Çıkarma Tesisi</option>
                  <option value={BuildingType.ResearchLab}>Araştırma Laboratuvarı</option>
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
                  className="px-4 py-2 rounded-xl text-xs font-bold text-amber-200 bg-amber-950 hover:bg-amber-900 border border-amber-700/60 disabled:opacity-50"
                >
                  {createMutation.isPending ? 'İnşa Ediliyor...' : 'İnşaata Başla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}