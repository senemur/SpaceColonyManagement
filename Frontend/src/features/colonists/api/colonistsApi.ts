import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/shared/api/axiosClient';
import { Colonist, CreateColonistDto, AssignColonistDto } from '../types';

interface GetListResponse<T> {
  items: T[];
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// Kolonistleri backend'den getir
export const fetchColonistsByColonyId = async (colonyId: number = 1): Promise<Colonist[]> => {
  try {
    const res = await axiosClient.get<GetListResponse<Colonist>>(`/colonists/colony/${colonyId}`);
    return res.data.items ?? [];
  } catch (error) {
    console.error('Kolonistler çekilemedi:', error);
    return [];
  }
};

// Kolonisti binaya ata veya görevden çıkar (PUT /api/colonists/assign-to-building)
export const assignColonistToBuilding = async (dto: AssignColonistDto): Promise<Colonist> => {
  const res = await axiosClient.put<Colonist>('/colonists/assign-to-building', dto);
  return res.data;
};

// Yeni kolonist oluştur / mekik indir (POST /api/colonists)
export const createColonist = async (dto: CreateColonistDto): Promise<Colonist> => {
  const res = await axiosClient.post<Colonist>('/colonists', dto);
  return res.data;
};

export const useColonists = (colonyId: number = 1) => {
  return useQuery({
    queryKey: ['colonists', colonyId],
    queryFn: () => fetchColonistsByColonyId(colonyId),
    staleTime: 1000 * 60 * 5,
  });
};

export const useAssignColonist = (colonyId: number = 1) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignColonistToBuilding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colonists', colonyId] });
      queryClient.invalidateQueries({ queryKey: ['buildings', colonyId] });
      queryClient.invalidateQueries({ queryKey: ['colony'] });
    },
  });
};

export const useCreateColonist = (colonyId: number = 1) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createColonist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colonists', colonyId] });
      queryClient.invalidateQueries({ queryKey: ['colony'] });
    },
  });
};