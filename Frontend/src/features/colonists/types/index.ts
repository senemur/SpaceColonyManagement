export interface Colonist {
  id: string;
  name: string;
  role: string;
  health: number;
  stamina: number;
  morale: number;
  status: 'Idle' | 'Working' | 'Resting' | 'Exploring' | 'Assigned';
  currentBuilding?: string;
  avatarColor?: string;
}

export interface TaskAssignment {
  colonistId: string;
  taskId: string;
  buildingId?: string;
}
