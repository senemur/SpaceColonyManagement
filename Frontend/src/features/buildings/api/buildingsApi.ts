import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/shared/api/axiosClient';
import { Building, CreateBuildingDto } from '../types';

interface GetListResponse<T> {
  items: T[];
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// Koloniye ait binaları backend'den çek
export const fetchBuildingsByColonyId = async (colonyId: number = 1): Promise<Building[]> => {
  try {
    const res = await axiosClient.get<GetListResponse<Building>>(`/buildings/colony/${colonyId}`);
    return res.data.items ?? [];
  } catch (error) {
    console.error('Binalar çekilemedi:', error);
    return [];
  }
};

// Bina seviyesini yükselt (PUT /api/buildings/upgrade)
export const upgradeBuilding = async (id: number): Promise<Building> => {
  const res = await axiosClient.put<Building>('/buildings/upgrade', { id });
  return res.data;
};

// Yeni bina inşa et (POST /api/buildings)
export const createBuilding = async (dto: CreateBuildingDto): Promise<Building> => {
  const res = await axiosClient.post<Building>('/buildings', dto);
  return res.data;
};

export const useBuildings = (colonyId: number = 1) => {
  return useQuery({
    queryKey: ['buildings', colonyId],
    queryFn: () => fetchBuildingsByColonyId(colonyId),
    staleTime: 1000 * 60 * 5, // 5 dakika boyunca taze kabul et
  });
};

export const useUpgradeBuilding = (colonyId: number = 1) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upgradeBuilding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings', colonyId] });
      queryClient.invalidateQueries({ queryKey: ['colony'] });
    },
  });
};

export const useCreateBuilding = (colonyId: number = 1) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBuilding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings', colonyId] });
      queryClient.invalidateQueries({ queryKey: ['colony'] });
    },
  });
};

// Binayı aktif/pasif yap
export const toggleBuildingStatus = async (id: number): Promise<Building> => {
  const res = await axiosClient.put<Building>(`/buildings/${id}/toggle-status`);
  return res.data;
};

export const useToggleBuildingStatus = (colonyId: number = 1) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleBuildingStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings', colonyId] });
      queryClient.invalidateQueries({ queryKey: ['colony'] });
    },
  });
};