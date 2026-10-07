export interface Building {
  id: string;
  name: string;
  type: 'Hab' | 'Farm' | 'Mine' | 'Lab' | 'Solar' | 'Water';
  level: number;
  status: 'Operational' | 'Upgrading' | 'Maintenance' | 'Disabled';
  production: string;
  consumption: string;
  capacity: string;
  description: string;
}
