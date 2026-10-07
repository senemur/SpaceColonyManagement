import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '@/shared/api/axiosClient';

export interface TechNode {
  id: string;
  name: string;
  category: 'Enerji' | 'Biyoloji' | 'Madencilik' | 'Uzay';
  cost: number;
  progress: number;
  status: 'Tamamlandı' | 'Araştırılıyor' | 'Kilitli';
  description: string;
}

export const mockTechs: TechNode[] = [
  { id: 't1', name: 'Derin Buz Sondajı', category: 'Biyoloji', cost: 100, progress: 100, status: 'Tamamlandı', description: 'Yeraltı donmuş su kaynaklarını hızla çıkarma teknolojisi.' },
  { id: 't2', name: 'Füzyon Reaktörü Prototipi', category: 'Enerji', cost: 250, progress: 45, status: 'Araştırılıyor', description: 'Güneş fırtınalarında kesintisiz enerji sağlayan reaktör.' },
  { id: 't3', name: 'Otomatik Maden Roverları', category: 'Madencilik', cost: 180, progress: 0, status: 'Kilitli', description: 'İnsan müdahalesi olmadan cevher toplayan AI roverlar.' },
  { id: 't4', name: 'Mars Toprağı Gübreleme', category: 'Biyoloji', cost: 150, progress: 0, status: 'Kilitli', description: 'Kızıl gezegen toprağında bitki verimini 2 katına çıkarır.' },
];

export const fetchTechTree = async (): Promise<TechNode[]> => {
  try {
    const res = await axiosClient.get<TechNode[]>('/research/tech-tree');
    return res.data;
  } catch {
    return mockTechs;
  }
};

export const useTechTree = () => {
  return useQuery({
    queryKey: ['research', 'tech-tree'],
    queryFn: fetchTechTree,
  });
};
