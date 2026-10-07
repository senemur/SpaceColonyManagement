'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MarsEngine } from '../engine/marsEngine';
import { CameraMode } from '../types';

export function useMarsEngine() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<MarsEngine | null>(null);

  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [insideBuilding, setInsideBuilding] = useState<string | null>(null);
  const [camMode, setCamMode] = useState<CameraMode>('TPS');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const engine = new MarsEngine(containerRef.current, canvasRef.current, {
      onPointerLockChange: (locked) => setIsPointerLocked(locked),
      onInsideBuildingChange: (bName) => setInsideBuilding(bName),
      onBuildingSelect: (building) => setSelectedBuilding(building),
    });

    engineRef.current = engine;
    engine.start();

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const toggleCameraMode = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.camMode = engineRef.current.camMode === 'TPS' ? 'FPS' : 'TPS';
      setCamMode(engineRef.current.camMode);
    }
  }, []);

  const toggleBuildingEnter = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.toggleEnterBuilding();
    }
  }, []);

  return {
    containerRef,
    canvasRef,
    isPointerLocked,
    insideBuilding,
    camMode,
    showHelpModal,
    setShowHelpModal,
    selectedBuilding,
    setSelectedBuilding,
    toggleCameraMode,
    toggleBuildingEnter,
  };
}
