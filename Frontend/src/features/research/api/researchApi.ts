import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/shared/api/axiosClient';

export interface Technology {
  id: number;
  colonyId: number;
  code: string;
  name: string;
  description: string;
  category: number;
  categoryName: string;
  mineralCost: number;
  creditCost: number;
  durationInSols: number;
  progress: number;
  status: number; // 1: Locked, 2: Available, 3: InProgress, 4: Completed
  statusName: string;
  prerequisiteCode?: string | null;
  prerequisiteName?: string | null;
  bonusType: number;
  bonusTypeName: string;
  bonusValue: number;
  bonusDescription: string;
}

export interface StartResearchDto {
  colonyId: number;
  technologyId: number;
}

export interface StartResearchResponse {
  technologyId: number;
  code: string;
  name: string;
  status: number;
  statusName: string;
  progress: number;
  durationInSols: number;
  remainingMinerals: number;
  remainingCredits: number;
  message: string;
}

export const fetchTechTree = async (colonyId: number = 1): Promise<Technology[]> => {
  const res = await axiosClient.get<Technology[]>(`/research/colony/${colonyId}`);
  return res.data;
};

export const startResearch = async (dto: StartResearchDto): Promise<StartResearchResponse> => {
  const res = await axiosClient.post<StartResearchResponse>('/research/start', dto);
  return res.data;
};

export const useTechTree = (colonyId: number = 1) => {
  return useQuery({
    queryKey: ['research', 'tech-tree', colonyId],
    queryFn: () => fetchTechTree(colonyId),
  });
};

export const useStartResearch = (colonyId: number = 1) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (technologyId: number) => startResearch({ colonyId, technologyId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research', 'tech-tree', colonyId] });
      queryClient.invalidateQueries({ queryKey: ['colony', colonyId] });
      queryClient.invalidateQueries({ queryKey: ['colonies'] });
    },
  });
};
