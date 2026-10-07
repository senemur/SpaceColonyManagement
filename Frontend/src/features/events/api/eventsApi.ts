import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '@/shared/api/axiosClient';

export interface ColonyEvent {
  id: string;
  sol: number;
  time: string;
  type: 'Info' | 'Warning' | 'Success' | 'Critical';
  title: string;
  message: string;
}

export const mockEvents: ColonyEvent[] = [
  { id: 'e1', sol: 142, time: '10:45', type: 'Success', title: 'Hasat Tamamlandı', message: 'Hidroponik Sera Modülü 45 kg taze patates üretti.' },
  { id: 'e2', sol: 142, time: '08:12', type: 'Info', title: 'Yeni Mürettebat', message: 'Uzay mekiği Ares-7 ile Dr. Elena Rostova üsse iniş yaptı.' },
  { id: 'e3', sol: 141, time: '22:30', type: 'Warning', title: 'Toz Fırtınası Yaklaşıyor', message: 'Kuzey Güneş panellerinin verimi %15 düştü.' },
  { id: 'e4', sol: 140, time: '14:18', type: 'Critical', title: 'Su Sızıntısı', message: 'Maden Tesisi soğutma hattında ufak bir sızıntı onarıldı.' },
];

export const fetchEvents = async (): Promise<ColonyEvent[]> => {
  try {
    const res = await axiosClient.get<ColonyEvent[]>('/events');
    return res.data;
  } catch {
    return mockEvents;
  }
};

export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });
};
