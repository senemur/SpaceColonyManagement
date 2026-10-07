import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '@/shared/api/axiosClient';
import { ColonyStats, ColonyOverview } from '../types';

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

export const fetchColonyOverview = async (): Promise<ColonyOverview> => {
  try {
    const res = await axiosClient.get<ColonyOverview>('/colony/overview');
    return res.data;
  } catch {
    // Return mock data for client offline/demo fallback
    return {
      name: 'Ares Prime Colony',
      commander: 'Kaptan John Ares',
      location: 'Valles Marineris, Mars',
      stats: mockColonyStats,
    };
  }
};

export const useColonyOverview = () => {
  return useQuery({
    queryKey: ['colony', 'overview'],
    queryFn: fetchColonyOverview,
    refetchInterval: 10000,
  });
};
