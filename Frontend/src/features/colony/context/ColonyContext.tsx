'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ColonyOverview, ColonyZone } from '../types';
import { COLONY_ZONES, useColonyById, useColonies } from '../api/colonyApi';

interface ColonyContextType {
  activeColonyId: number;
  setActiveColonyId: (id: number) => void;
  activeColony: ColonyOverview | undefined;
  activeZone: ColonyZone;
  allZones: ColonyZone[];
  allColonies: ColonyOverview[] | undefined;
  isLoading: boolean;
  refetch: () => void;
}

const ColonyContext = createContext<ColonyContextType | undefined>(undefined);

const STORAGE_KEY = 'scm_active_colony_id';

export function ColonyProvider({ children }: { children: React.ReactNode }) {
  const [activeColonyId, setActiveColonyIdState] = useState<number>(1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) {
        setActiveColonyIdState(parsed);
      }
    }
  }, []);

  const setActiveColonyId = (id: number) => {
    setActiveColonyIdState(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(id));
    }
  };

  const { data: allColonies, refetch: refetchAll } = useColonies();
  const { data: activeColony, isLoading, refetch: refetchActive } = useColonyById(activeColonyId);

  const refetch = () => {
    refetchAll();
    refetchActive();
  };

  const activeZone =
    COLONY_ZONES.find((z) => z.id === activeColonyId) ?? COLONY_ZONES[0];

  return (
    <ColonyContext.Provider
      value={{
        activeColonyId,
        setActiveColonyId,
        activeColony,
        activeZone,
        allZones: COLONY_ZONES,
        allColonies,
        isLoading,
        refetch,
      }}
    >
      {children}
    </ColonyContext.Provider>
  );
}

export function useActiveColony() {
  const context = useContext(ColonyContext);
  if (!context) {
    throw new Error('useActiveColony must be used within a ColonyProvider');
  }
  return context;
}
