export enum ColonistRole {
  Worker = 0,     // Düz İşçi / Genel Kolonist
  Commander = 1,  // Kaptan / Yönetici
  Engineer = 2,   // Mühendis
  Biologist = 3,  // Biyolog / Tarımcı
  Miner = 4,      // Madenci
  Doctor = 5,     // Doktor
  Technician = 6, // Teknisyen
  Scientist = 7,  // Bilim İnsanı
  Civilian = 8,   // Sivil Yerleşimci
}

export interface Colonist {
  id: number;
  colonyId: number;
  name: string;
  role: ColonistRole;
  health: number;
  morale: number;
  stamina: number;
  buildingId: number | null;
  buildingName?: string | null;
  isAssigned: boolean;
}

export interface CreateColonistDto {
  colonyId: number;
  name: string;
  role: ColonistRole;
}

export interface AssignColonistDto {
  colonistId: number;
  buildingId: number | null;
}