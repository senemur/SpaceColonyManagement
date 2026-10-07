'use client';

import React from 'react';
import { Play } from 'lucide-react';

interface PlayOverlayProps {
  isVisible: boolean;
  onClick: () => void;
}

export default function PlayOverlay({ isVisible, onClick }: PlayOverlayProps) {
  if (!isVisible) return null;

  return (
    <div
      onClick={onClick}
      className="absolute inset-0 z-40 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer transition-opacity duration-300"
    >
      <div className="bg-slate-900/90 border border-rose-600/40 p-8 rounded-2xl shadow-2xl shadow-rose-950/40 text-center max-w-sm mx-4 transform hover:scale-105 transition-all">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-rose-600/30">
          <Play className="w-8 h-8 text-white ml-1 fill-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">Oynamak İçin Tıklayın</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Fare kilitlenir. Serbest bırakmak için <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">Esc</kbd> veya <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">Sağ Tık</kbd> yapın.
        </p>
      </div>
    </div>
  );
}
