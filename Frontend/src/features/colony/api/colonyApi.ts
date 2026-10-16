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

// Mars globe'da gösterilecek koloni zone'ları
// Şimdilik statik, ileride backend'den çekilebilir
export const COLONY_ZONES: ColonyZone[] = [
  { id: 1, name: 'Ares Prime', location: 'Valles Marineris', lat: -14, lon: -59, color: '#e2703a' },
  { id: 2, name: 'Olympus Station', location: 'Olympus Mons', lat: 18, lon: -133, color: '#9d7bff' },
  { id: 3, name: 'Arcadia Base', location: 'Arcadia Planitia', lat: 47, lon: -168, color: '#3ddc97' },
];

export const fetchColonyById = async (id: number): Promise<ColonyOverview> => {
  try {
    const res = await axiosClient.get<ColonyOverview>(`/colonies/overview?id=${id}`);
    return res.data;
  } catch {
    // Fallback mock
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
    staleTime: 1000 * 60 * 5, // 5 dakika boyunca taze kabul et (gereksiz istek atma)
  });
};

// Geriye dönük uyumluluk için (ResourceBar hâlâ bunu kullanıyor)
export const fetchColonyOverview = async (): Promise<ColonyOverview> => {
  return fetchColonyById(1);
};

export const useColonyOverview = () => {
  return useColonyById(1);
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

// 1 Gün (Sol) ilerletme isteği
export const advanceNextSol = async (colonyId: number = 1): Promise<NextSolResponse> => {
  const res = await axiosClient.post<NextSolResponse>(`/colonies/${colonyId}/nextSol`);
  return res.data;
};
export const useNextSol = (colonyId: number = 1) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => advanceNextSol(colonyId),
    onSuccess: () => {
      // Tüm sistemi aynı anda yenile
      queryClient.invalidateQueries({ queryKey: ['colony'] });
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      queryClient.invalidateQueries({ queryKey: ['colonists'] });
    },
  });
};

  