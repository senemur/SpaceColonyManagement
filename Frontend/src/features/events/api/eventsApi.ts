import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '@/shared/api/axiosClient';

export interface ColonyEvent {
  id: number;
  colonyId: number;
  sol: number;
  time: string;
  type: number;
  typeName: 'Info' | 'Success' | 'Warning' | 'Critical';
  title: string;
  message: string;
  effectType: number;
  effectTypeName: string;
  effectValue: number;
  durationInSols: number;
  remainingSols: number;
  isActive: boolean;
}

export const fetchEvents = async (colonyId: number = 1): Promise<ColonyEvent[]> => {
  try {
    const res = await axiosClient.get<ColonyEvent[]>(`/Events/colony/${colonyId}`);
    return res.data;
  } catch (err) {
    console.error('Failed to fetch events from backend:', err);
    return [];
  }
};

export const useEvents = (colonyId: number = 1) => {
  return useQuery({
    queryKey: ['events', colonyId],
    queryFn: () => fetchEvents(colonyId),
    refetchInterval: 5000,
  });
};
