'use client';

import React from 'react';
import { X, Keyboard, MousePointer } from 'lucide-react';

interface ControlsHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ControlsHelpModal({ isOpen, onClose }: ControlsHelpModalProps) {
  if (!isOpen) return null;

  const keyItems = [
    { keys: ['W', 'A', 'S', 'D'], label: 'Hareket Et / Yürü' },
    { keys: ['Shift', 'WASD'], label: 'Koş' },
    { keys: ['Space'], label: 'Zıpla' },
    { keys: ['E'], label: 'Binaya Gir / Etkileşim / Görev Yap' },
    { keys: ['Q'], label: 'Binadan Çık' },
    { keys: ['V'], label: 'FPS / TPS Kamera Açısı Değiştir' },
    { keys: ['Sağ Tık / Esc'], label: 'Fareyi Serbest Bırak' },
    { keys: ['Sol Tık'], label: 'Fareyi Kilitle' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-rose-400" />
            <h2 className="font-bold text-lg text-slate-100">Kontrol Rehberi</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5 text-xs">
          {keyItems.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
              <div className="flex items-center gap-1.5">
                {item.keys.map((k, i) => (
                  <kbd key={i} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded font-semibold text-rose-300">
                    {k}
                  </kbd>
                ))}
              </div>
              <span className="text-slate-300 font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
