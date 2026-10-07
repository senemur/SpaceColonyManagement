import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '@/shared/api/axiosClient';

export interface Mission {
  id: string;
  name: string;
  target: string;
  reward: string;
  risk: 'Düşük' | 'Orta' | 'Yüksek';
  duration: string;
  status: 'Hazır' | 'Devam Ediyor' | 'Tamamlandı';
}

export const mockMissions: Mission[] = [
  { id: 'm1', name: 'Olympus Mons Vadi Taraması', target: 'Kuzey Sektörü 4', reward: '+350 Maden, +100 Su', risk: 'Orta', duration: '2 Sol', status: 'Hazır' },
  { id: 'm2', name: 'Görünmeyen Kanyon Buz Analizi', target: 'Güney Krateri', reward: '+500 Su Buz Kristali', risk: 'Düşük', duration: '1 Sol', status: 'Hazır' },
  { id: 'm3', name: 'Eski Yeraltı Mağara Araştırması', target: 'Derin Mağara B-9', reward: '+200 Nadir Element, Gizemli Artefakt', risk: 'Yüksek', duration: '3 Sol', status: 'Hazır' },
];

export const fetchMissions = async (): Promise<Mission[]> => {
  try {
    const res = await axiosClient.get<Mission[]>('/exploration/missions');
    return res.data;
  } catch {
    return mockMissions;
  }
};

export const useMissions = () => {
  return useQuery({
    queryKey: ['exploration', 'missions'],
    queryFn: fetchMissions,
  });
};
