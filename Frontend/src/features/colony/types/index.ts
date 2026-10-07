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
  name: string;
  commander: string;
  location: string;
  stats: ColonyStats;
}
