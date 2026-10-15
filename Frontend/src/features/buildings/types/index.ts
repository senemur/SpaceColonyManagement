export enum BuildingType {
  Habitat = 1,
  SolarPanel = 2,
  Greenhouse = 3,
  Mine = 4,
  WaterExtractor = 5,
  ResearchLab = 6,
}

export interface Building {
  id: number;
  colonyId: number;
  name: string;
  buildingType: BuildingType;
  level: number;
  health: number;
  workers: number;
  maxWorkers: number;
  powerConsumption: number;
  powerProduction: number;
  isActive: boolean;
}

export interface CreateBuildingDto {
  colonyId: number;
  name: string;
  buildingType: BuildingType;
  maxWorkers?: number;
  powerConsumption?: number;
  powerProduction?: number;
}