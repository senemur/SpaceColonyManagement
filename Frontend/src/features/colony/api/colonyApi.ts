import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '@/shared/api/axiosClient';
import { ColonyStats, ColonyOverview, ColonyZone } from '../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const mockColonyStats: ColonyStats = {
  sol: 142,
  population: 12,
  maxPopulation: 24,
  power: 185,
  maxPower: 250,
  oxygen: 94,
  maxOxygen: 100,
  water: 78,
  maxWater: 100,
  food: 320,
  maxFood: 500,
  minerals: 1450,
  credits: 28500,
  safetyScore: 98,
};

export const COLONY_ZONES: ColonyZone[] = [
  { id: 1, name: 'Ares Prime', location: 'Valles Marineris', lat: -14, lon: -59, color: '#e2703a' },
  { id: 2, name: 'Olympus Station', location: 'Olympus Mons', lat: 18, lon: -133, color: '#9d7bff' },
  { id: 3, name: 'Arcadia Base', location: 'Arcadia Planitia', lat: 47, lon: -168, color: '#3ddc97' },
];

export const fetchAllColonies = async (): Promise<ColonyOverview[]> => {
  try {
    const res = await axiosClient.get<ColonyOverview[]>('/colonies');
    if (res.data && res.data.length > 0) {
      return res.data;
    }
    throw new Error('No colonies returned');
  } catch {
    return [
      {
        id: 1,
        name: 'Ares Prime',
        description: 'Ana merkez üssü',
        commander: 'John Ares',
        planet: 'Mars',
        location: 'Valles Marineris',
        stats: {
          sol: 2,
          population: 6,
          maxPopulation: 25,
          power: 250,
          maxPower: 250,
          water: 76,
          maxWater: 100,
          oxygen: 88,
          maxOxygen: 100,
          food: 296,
          maxFood: 500,
          minerals: 1000,
          credits: 25000,
          safetyScore: 100,
        },
      },
      {
        id: 2,
        name: 'Olympus Station',
        description: 'Olympus Mons volkanik araştırma üssü',
        commander: 'Dr. Hakan Vural',
        planet: 'Mars',
        location: 'Olympus Mons',
        stats: {
          sol: 142,
          population: 12,
          maxPopulation: 24,
          power: 380,
          maxPower: 500,
          water: 85,
          maxWater: 100,
          oxygen: 96,
          maxOxygen: 100,
          food: 410,
          maxFood: 600,
          minerals: 2850,
          credits: 45000,
          safetyScore: 94,
        },
      },
      {
        id: 3,
        name: 'Arcadia Base',
        description: 'Arcadia Planitia buzul madenciliği üssü',
        commander: 'Sarah Connor',
        planet: 'Mars',
        location: 'Arcadia Planitia',
        stats: {
          sol: 85,
          population: 8,
          maxPopulation: 20,
          power: 220,
          maxPower: 300,
          water: 95,
          maxWater: 100,
          oxygen: 92,
          maxOxygen: 100,
          food: 310,
          maxFood: 500,
          minerals: 1950,
          credits: 32000,
          safetyScore: 98,
        },
      },
    ];
  }
};

export const useColonies = () => {
  return useQuery({
    queryKey: ['colonies'],
    queryFn: fetchAllColonies,
    staleTime: 1000 * 60 * 5,
  });
};

export const fetchColonyById = async (id: number): Promise<ColonyOverview> => {
  try {
    const res = await axiosClient.get<ColonyOverview>(`/colonies/overview?id=${id}`);
    return res.data;
  } catch {
    const all = await fetchAllColonies();
    const found = all.find(c => c.id === id);
    if (found) return found;

    return {
      id,
      name: COLONY_ZONES.find(z => z.id === id)?.name ?? 'Bilinmeyen Koloni',
      description: 'Mars kolonisi',
      commander: 'Kaptan John Ares',
      planet: 'Mars',
      location: COLONY_ZONES.find(z => z.id === id)?.location ?? 'Mars',
      stats: mockColonyStats,
    };
  }
};

export const useColonyById = (id: number) => {
  return useQuery({
    queryKey: ['colony', id],
    queryFn: () => fetchColonyById(id),
    enabled: id > 0,
    staleTime: 1000 * 60 * 5,
  });
};

export const fetchColonyOverview = async (id: number = 1): Promise<ColonyOverview> => {
  return fetchColonyById(id);
};

export const useColonyOverview = (id: number = 1) => {
  return useColonyById(id);
};

export interface NextSolResponse {
  sol: number;
  powerProduced: number;
  powerConsumed: number;
  waterProduced: number;
  waterConsumed: number;
  foodProduced: number;
  foodConsumed: number;
  mineralsProduced: number;
  activeColonists: number;
  workingColonists: number;
  idleColonists: number;
  logMessages: string[];
}

export const advanceNextSol = async (colonyId: number = 1): Promise<NextSolResponse> => {
  const res = await axiosClient.post<NextSolResponse>(`/colonies/${colonyId}/nextSol`);
  return res.data;
};

export const useNextSol = (colonyId: number = 1) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => advanceNextSol(colonyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colony'] });
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      queryClient.invalidateQueries({ queryKey: ['colonists'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['research'] });
    },
  });
};

export interface OfflineProgressResponse {
  hasProgress: boolean;
  elapsedMinutes: number;
  solsAdvanced: number;
  powerChange: number;
  waterChange: number;
  foodChange: number;
  oxygenChange: number;
  mineralsChange: number;
  summaryMessage: string;
  details: string[];
  lastActiveDate: string;
  currentSyncDate: string;
}

export const processOfflineProgress = async (colonyId: number = 1): Promise<OfflineProgressResponse> => {
  const res = await axiosClient.post<OfflineProgressResponse>(`/colonies/${colonyId}/offline-progress`);
  return res.data;
};

export const useOfflineProgress = (colonyId: number = 1) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => processOfflineProgress(colonyId),
    onSuccess: (data) => {
      if (data.hasProgress) {
        queryClient.invalidateQueries({ queryKey: ['colony'] });
        queryClient.invalidateQueries({ queryKey: ['buildings'] });
        queryClient.invalidateQueries({ queryKey: ['colonists'] });
        queryClient.invalidateQueries({ queryKey: ['events'] });
        queryClient.invalidateQueries({ queryKey: ['research'] });
      }
    },
  });
};

export interface PerformColonyActionRequest {
  actionType: string;
  amount?: number;
  buildingId?: number;
  description?: string;
}

export interface PerformColonyActionResponse {
  success: boolean;
  message: string;
  actionType: string;
  resourceGained: number;
  resourceType: string;
  stats: ColonyStats;
}

export const performColonyAction = async (
  colonyId: number = 1,
  actionType: string,
  amount: number = 0,
  buildingId?: number,
  description?: string
): Promise<PerformColonyActionResponse> => {
  const res = await axiosClient.post<PerformColonyActionResponse>(`/colonies/${colonyId}/action`, {
    colonyId,
    actionType,
    amount,
    buildingId,
    description,
  });
  return res.data;
};

export const usePerformColonyAction = (colonyId: number = 1) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      actionType,
      amount,
      buildingId,
      description,
    }: {
      actionType: string;
      amount?: number;
      buildingId?: number;
      description?: string;
    }) => performColonyAction(colonyId, actionType, amount, buildingId, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colony'] });
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      queryClient.invalidateQueries({ queryKey: ['colonists'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['research'] });
    },
  });
};
