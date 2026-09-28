import { Apple, BatteryCharging, Droplets, Factory, Leaf, PackageOpen, Pickaxe, Sun, Wind } from "lucide-react";

export const resources = [
  { name: "Food", value: 100, max: 500, production: 12, consumption: 10, icon: Apple, tone: "positive" },
  { name: "Water", value: 100, max: 500, production: 14, consumption: 10, icon: Droplets, tone: "info" },
  { name: "Oxygen", value: 100, max: 500, production: 12, consumption: 10, icon: Wind, tone: "cyan" },
  { name: "Energy", value: 100, max: 500, production: 15, consumption: 11, icon: BatteryCharging, tone: "warning" },
  { name: "Iron", value: 50, max: 500, production: 13, consumption: 0, icon: Pickaxe, tone: "iron" },
] as const;

export const buildings = [
  { name: "Solar Panel", level: 1, output: "+15 Energy/hour", workers: "0 / 0", icon: Sun, cost: 80, capacity: "15 kW" },
  { name: "Farm", level: 1, output: "+12 Food/hour", workers: "2 / 3", icon: Leaf, cost: 100, capacity: "500 Food" },
  { name: "Water Extractor", level: 1, output: "+14 Water/hour", workers: "2 / 2", icon: Droplets, cost: 120, capacity: "500 Water" },
  { name: "Oxygen Generator", level: 1, output: "+12 Oxygen/hour", workers: "2 / 2", icon: Wind, cost: 140, capacity: "500 Oxygen" },
  { name: "Iron Mine", level: 1, output: "+13 Iron/hour", workers: "4 / 4", icon: Pickaxe, cost: 160, capacity: "500 Iron" },
  { name: "Warehouse", level: 1, output: "+500 Storage", workers: "0 / 0", icon: PackageOpen, cost: 90, capacity: "2,500 Units" },
] as const;

export const colonists = [
  { name: "Alex Morgan", initials: "AM", age: 32, health: 100, happiness: 82, job: "Farm", status: "Working" },
  { name: "Maya Chen", initials: "MC", age: 27, health: 100, happiness: 90, job: "Iron Mine", status: "Working" },
  { name: "Jordan Okafor", initials: "JO", age: 38, health: 94, happiness: 76, job: "Water Extractor", status: "Working" },
  { name: "Elena Rossi", initials: "ER", age: 29, health: 98, happiness: 88, job: "Oxygen Generator", status: "Working" },
  { name: "Samir Patel", initials: "SP", age: 35, health: 100, happiness: 71, job: "Iron Mine", status: "Working" },
  { name: "Noah Williams", initials: "NW", age: 24, health: 96, happiness: 67, job: "Unassigned", status: "Idle" },
  { name: "Sofia Reyes", initials: "SR", age: 31, health: 100, happiness: 85, job: "Farm", status: "Working" },
  { name: "Liam Brooks", initials: "LB", age: 42, health: 89, happiness: 64, job: "Iron Mine", status: "Resting" },
] as const;

export const researchBranches = [
  { name: "Agriculture", icon: Leaf, nodes: [{ name: "Improved Agriculture", effect: "Farm production +20%", cost: 50, duration: "30 min", state: "Researching" }, { name: "Advanced Farming", effect: "Farm production +30%", cost: 100, duration: "1 hour", state: "Locked" }] },
  { name: "Engineering", icon: Factory, nodes: [{ name: "Improved Engineering", effect: "Construction cost -10%", cost: 50, duration: "30 min", state: "Available" }, { name: "Advanced Mining", effect: "Iron Mine production +25%", cost: 100, duration: "1 hour", state: "Locked" }] },
  { name: "Life Support", icon: Wind, nodes: [{ name: "Improved Life Support", effect: "Oxygen +20% · Water +10%", cost: 50, duration: "30 min", state: "Completed" }, { name: "Advanced Life Support", effect: "Oxygen +30% · Water +20%", cost: 100, duration: "1 hour", state: "Available" }] },
] as const;
