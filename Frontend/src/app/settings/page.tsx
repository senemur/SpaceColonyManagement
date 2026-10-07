'use client';

import React, { useState } from 'react';
import ResourceBar from '@/features/colony/components/ResourceBar';
import { Settings, Save, Sliders, Volume2, Eye } from 'lucide-react';

export default function SettingsPage() {
  const [colonyName, setColonyName] = useState('Ares Prime Colony');
  const [commanderName, setCommanderName] = useState('Kaptan John Ares');
  const [audioVolume, setAudioVolume] = useState(80);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 w-full space-y-6">
      <ResourceBar />

      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-100">Koloni ve Görsel Ayarlar</h1>
          <p className="text-xs text-slate-400">3D motor performansı, ses seviyesi ve koloni isim tercihleri.</p>
        </div>
      </div>

      <div className="max-w-2xl bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {saved && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3 rounded-xl text-xs font-semibold">
            Ayarlar başarıyla kaydedildi!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-rose-400" /> Koloni Tanımları
            </h2>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Koloni Adı</label>
              <input
                type="text"
                value={colonyName}
                onChange={(e) => setColonyName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Komutan Adı</label>
              <input
                type="text"
                value={commanderName}
                onChange={(e) => setCommanderName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-sky-400" /> Ses ve Efektler
            </h2>
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Ana Ses Seviyesi</span>
                <span className="font-bold text-rose-400">{audioVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={audioVolume}
                onChange={(e) => setAudioVolume(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-lg shadow-rose-950/40"
          >
            <Save className="w-4 h-4" />
            <span>Ayarları Kaydet</span>
          </button>
        </form>
      </div>
    </div>
  );
}
