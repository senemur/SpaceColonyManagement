'use client';

import React from 'react';
import ResourceBar from '@/features/colony/components/ResourceBar';
import { Camera, HelpCircle, KeyRound, Building } from 'lucide-react';
import { CameraMode } from '../types';

interface HUDOverlayProps {
  camMode: CameraMode;
  onToggleCamMode: () => void;
  onOpenHelp: () => void;
  insideBuilding: string | null;
  onToggleBuilding: () => void;
  isPointerLocked: boolean;
}

export default function HUDOverlay({
  camMode,
  onToggleCamMode,
  onOpenHelp,
  insideBuilding,
  onToggleBuilding,
  isPointerLocked,
}: HUDOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4">
      {/* Top Section */}
      <div className="flex flex-col gap-3 pointer-events-auto">
        <ResourceBar />

        {/* Action Controls Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleCamMode}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 backdrop-blur-md shadow-lg transition-all"
            >
              <Camera className="w-4 h-4 text-rose-400" />
              <span>Kamera: <strong className="text-white">{camMode}</strong></span>
            </button>

            <button
              onClick={onToggleBuilding}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-200 bg-amber-950/70 hover:bg-amber-900/90 border border-amber-700/60 backdrop-blur-md shadow-lg transition-all"
            >
              <Building className="w-4 h-4 text-amber-400" />
              <span>{insideBuilding ? 'Dışarı Çık (Q)' : 'Binaya Gir (E)'}</span>
            </button>
          </div>

          <button
            onClick={onOpenHelp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-sky-200 bg-sky-950/70 hover:bg-sky-900/90 border border-sky-700/60 backdrop-blur-md shadow-lg transition-all"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span>Kontroller (?)</span>
          </button>
        </div>
      </div>

      {/* Bottom Section Notice */}
      {isPointerLocked && (
        <div className="self-center pointer-events-auto bg-slate-900/80 border border-slate-800 backdrop-blur-md px-4 py-1.5 rounded-full text-xs text-slate-300 flex items-center gap-2 shadow-xl">
          <KeyRound className="w-3.5 h-3.5 text-rose-400" />
          <span>ESC veya Sağ Tık: Fareyi Serbest Bırak</span>
        </div>
      )}
    </div>
  );
}
