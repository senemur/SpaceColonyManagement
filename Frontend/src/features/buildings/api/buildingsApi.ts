import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/shared/api/axiosClient';
import { Building } from '../types';

export const mockBuildings: Building[] = [
  { id: 'b1', name: 'Ana Yaşam Kubbesi (Habitat)', type: 'Hab', level: 2, status: 'Operational', production: '+12 Oksijen/sol', consumption: '-30 kW Güç', capacity: '16 Mürettebat', description: 'Koloni sakinlerinin yaşadığı ve dinlendiği ana yaşam alanı.' },
  { id: 'b2', name: 'Hidroponik Sera Modülü', type: 'Farm', level: 3, status: 'Operational', production: '+45 kg Besin/sol', consumption: '-20 kW Güç, -15 L Su', capacity: '4 Çiftçi', description: 'Mars toprağı ve yapay ışıklandırma ile besin üretilen tarım alanı.' },
  { id: 'b3', name: 'Maden İletim Kompleksi', type: 'Mine', level: 1, status: 'Operational', production: '+120 t Maden/sol', consumption: '-50 kW Güç', capacity: '6 Madenci', description: 'Demir, titanyum ve nadir Mars metalleri çıkaran ağır sanayi tesisi.' },
  { id: 'b4', name: 'Gelişmiş Biyoloji Laboratuvarı', type: 'Lab', level: 2, status: 'Operational', production: '+15 Araştırma Puanı/sol', consumption: '-25 kW Güç', capacity: '3 Bilim İnsanı', description: 'Uzay biyolojisi ve yeni teknolojiler geliştiren araştırma merkezi.' },
  { id: 'b5', name: 'Güneş Paneli Tarlası', type: 'Solar', level: 4, status: 'Operational', production: '+200 kW Güç/sol', consumption: 'Bakım gerektirir', capacity: 'Sınırsız', description: 'Mars güneş enerjisini elektriğe dönüştüren panel dizilimi.' },
  { id: 'b6', name: 'Yeraltı Buz Çıkarma Tesisi', type: 'Water', level: 2, status: 'Operational', production: '+80 L Su/sol', consumption: '-35 kW Güç', capacity: '2 Teknisyen', description: 'Mars kutup buzullarını eritip içme suyuna dönüştüren arıtma tesisi.' },
];

export const fetchBuildings = async (): Promise<Building[]> => {
  try {
    const res = await axiosClient.get<Building[]>('/buildings');
    return res.data;
  } catch {
    return mockBuildings;
  }
};

export const upgradeBuilding = async (buildingId: string): Promise<Building> => {
  const res = await axiosClient.post<Building>(`/buildings/${buildingId}/upgrade`);
  return res.data;
};

export const useBuildings = () => {
  return useQuery({
    queryKey: ['buildings'],
    queryFn: fetchBuildings,
  });
};

export const useUpgradeBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upgradeBuilding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
    },
  });
};
