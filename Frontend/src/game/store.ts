import { create } from "zustand";

export type GameScene = "surface" | "interior";
export type Weather = "clear" | "dust";

type GameStore = {
  scene: GameScene;
  paused: boolean;
  hour: number;
  weather: Weather;
  player: { x: number; z: number };
  selectedNpc: string | null;
  questOpen: boolean;
  inventoryOpen: boolean;
  inventory: { iron: number; rations: number; water: number };
  objective: string;
  moveTarget: { x: number; z: number } | null;
  setPlayer: (x: number, z: number) => void;
  setMoveTarget: (x: number, z: number) => void;
  clearMoveTarget: () => void;
  selectNpc: (name: string | null) => void;
  enterScene: (scene: GameScene) => void;
  togglePause: () => void;
  toggleQuest: () => void;
  toggleInventory: () => void;
  setWeather: (weather: Weather) => void;
  tickHour: (hour: number) => void;
};

export const useGameStore = create<GameStore>((set) => ({
  scene: "surface",
  paused: false,
  hour: 14.5,
  weather: "clear",
  player: { x: 0, z: 4 },
  selectedNpc: null,
  questOpen: false,
  inventoryOpen: false,
  inventory: { iron: 24, rations: 3, water: 2 },
  objective: "Speak with Maya at the iron mine",
  moveTarget: null,
  setPlayer: (x, z) => set({ player: { x, z } }),
  setMoveTarget: (x, z) => set({ moveTarget: { x, z } }),
  clearMoveTarget: () => set({ moveTarget: null }),
  selectNpc: (selectedNpc) => set({ selectedNpc }),
  enterScene: (scene) => set({ scene, selectedNpc: null, moveTarget: null }),
  togglePause: () => set((state) => ({ paused: !state.paused })),
  toggleQuest: () => set((state) => ({ questOpen: !state.questOpen, inventoryOpen: false })),
  toggleInventory: () => set((state) => ({ inventoryOpen: !state.inventoryOpen, questOpen: false })),
  setWeather: (weather) => set({ weather }),
  tickHour: (hour) => set({ hour }),
}));
