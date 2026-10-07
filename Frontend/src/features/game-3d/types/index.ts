export type CameraMode = 'TPS' | 'FPS';

export interface GameEngineState {
  isPointerLocked: boolean;
  camMode: CameraMode;
  insideBuilding: string | null; // null if outside, or building ID/name if inside interior
  selectedBuilding: {
    id: string;
    name: string;
    type: string;
    level: number;
    health: number;
    description: string;
  } | null;
  selectedCrew: {
    id: string;
    name: string;
    role: string;
    stamina: number;
  } | null;
  showHelpModal: boolean;
}
