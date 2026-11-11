import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/shared/api/axiosClient';

export interface ExplorationMission {
  id: number;
  colonyId: number;
  name: string;
  targetZone: string;
  description: string;
  riskLevel: number; // 1: Low, 2: Medium, 3: High
  riskLevelName: string; // "Düşük", "Orta", "Yüksek"
  status: number; // 1: Available, 2: InProgress, 3: Completed, 4: Failed
  statusName: string; // "Hazır", "Devam Ediyor", "Tamamlandı", "Başarısız"
  durationInSols: number;
  remainingSols: number;
  energyCost: number;
  waterCost: number;
  creditsCost: number;
  rewardMinerals: number;
  rewardWater: number;
  rewardCredits: number;
  rewardDescription: string;
  resultSummary?: string | null;
  startSol?: number | null;
  completedSol?: number | null;
}

export const fetchMissions = async (colonyId: number = 1): Promise<ExplorationMission[]> => {
  try {
    const res = await axiosClient.get<ExplorationMission[]>(`/exploration/colony/${colonyId}`);
    return res.data;
  } catch (err) {
    console.error('Failed to fetch exploration missions from backend:', err);
    return [];
  }
};

export const useMissions = (colonyId: number = 1) => {
  return useQuery({
    queryKey: ['exploration', 'missions', colonyId],
    queryFn: () => fetchMissions(colonyId),
    refetchInterval: 5000,
  });
};

export const startMission = async (colonyId: number, missionId: number): Promise<ExplorationMission> => {
  const res = await axiosClient.post<ExplorationMission>('/exploration/start', {
    colonyId,
    missionId,
  });
  return res.data;
};

export const useStartMission = (colonyId: number = 1) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (missionId: number) => startMission(colonyId, missionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exploration'] });
      queryClient.invalidateQueries({ queryKey: ['colony'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
