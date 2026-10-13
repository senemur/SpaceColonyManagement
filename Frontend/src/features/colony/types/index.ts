export interface ColonyStats {
  sol: number;
  population: number;
  maxPopulation: number;
  power: number;
  maxPower: number;
  oxygen: number;
  maxOxygen: number;
  water: number;
  maxWater: number;
  food: number;
  maxFood: number;
  minerals: number;
  credits: number;
  safetyScore: number;
}

export interface ColonyOverview {
  id: number;
  name: string;
  description: string;
  commander: string;
  planet: string;
  location: string;
  stats: ColonyStats;
}

// Mars globe üzerinde gösterilecek koloni zone tanımları
export interface ColonyZone {
  id: number;           // Backend'deki Colony.Id
  name: string;
  location: string;
  lat: number;
  lon: number;
  color: string;        // marker rengi (hex)
}