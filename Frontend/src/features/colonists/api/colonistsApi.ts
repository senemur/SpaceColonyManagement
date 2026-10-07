import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/shared/api/axiosClient';
import { Colonist, TaskAssignment } from '../types';

export const mockColonists: Colonist[] = [
  { id: '1', name: 'Dr. Elena Rostova', role: 'Mühendis', health: 95, stamina: 88, morale: 92, status: 'Working', currentBuilding: 'Sera Modülü', avatarColor: '#38bdf8' },
  { id: '2', name: 'Marcus Vance', role: 'Biyolog', health: 90, stamina: 82, morale: 85, status: 'Working', currentBuilding: 'Sera Modülü', avatarColor: '#4ade80' },
  { id: '3', name: 'Aleksei Volkov', role: 'Madenci', health: 100, stamina: 95, morale: 90, status: 'Working', currentBuilding: 'Maden Kompleksi', avatarColor: '#fb923c' },
  { id: '4', name: 'Sarah Connor', role: 'Güvenlik', health: 98, stamina: 94, morale: 96, status: 'Idle', currentBuilding: 'Komuta Merkezi', avatarColor: '#f43f5e' },
  { id: '5', name: 'Chen Wei', role: 'Teknisyen', health: 85, stamina: 75, morale: 80, status: 'Working', currentBuilding: 'Güneş Panelleri', avatarColor: '#a855f7' },
  { id: '6', name: 'Sophia Martinez', role: 'Doktor', health: 92, stamina: 88, morale: 95, status: 'Idle', currentBuilding: 'Yaşam Alanı', avatarColor: '#ec4899' },
];

export const fetchColonists = async (): Promise<Colonist[]> => {
  try {
    const res = await axiosClient.get<Colonist[]>('/colonists');
    return res.data;
  } catch {
    return mockColonists;
  }
};

export const assignColonistTask = async (assignment: TaskAssignment): Promise<Colonist> => {
  const res = await axiosClient.post<Colonist>('/colonists/assign', assignment);
  return res.data;
};

export const useColonists = () => {
  return useQuery({
    queryKey: ['colonists'],
    queryFn: fetchColonists,
  });
};

export const useAssignTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignColonistTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colonists'] });
    },
  });
};
