import { Link } from "@tanstack/react-router";
import { Backpack, BatteryCharging, Droplets, Gauge, ListChecks, Map, Menu, Pause, Play, Utensils, Wind, X } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useGameStore } from "./store";

export function GameHUD() {
  const { hour, paused, inventory, inventoryOpen, questOpen, objective, scene, togglePause, toggleInventory, toggleQuest, enterScene } = useGameStore();
  const displayHour = Math.floor(hour).toString().padStart(2, "0") + ":" + Math.floor((hour % 1) * 60).toString().padStart(2, "0");
  return <div className="pointer-events-none absolute inset-0 z-20 text-foreground">
    <div className="pointer-events-auto absolute left-3 top-3 flex items-center gap-2 sm:left-5 sm:top-5">
      <Link to="/" className="grid size-10 place-items-center rounded-md border border-game-border bg-game-panel text-primary shadow-panel" aria-label="Return to command center"><Gauge size={18}/></Link>
      <div className="rounded-md border border-game-border bg-game-panel px-4 py-2 shadow-panel"><p className="text-[10px] font-bold uppercase text-primary">New Horizon</p><p className="text-sm font-semibold">Sol 23 · {displayHour}</p></div>
    </div>
    <div className="absolute right-3 top-3 grid grid-cols-4 gap-1 rounded-md border border-game-border bg-game-panel p-2 shadow-panel sm:right-5 sm:top-5 sm:gap-2">
      {[{icon:Utensils,v:"100"},{icon:Droplets,v:"100"},{icon:Wind,v:"100"},{icon:BatteryCharging,v:"100"}].map(({icon:Icon,v},i)=><div key={i} className="flex items-center gap-1.5 px-2 py-1 text-xs"><Icon size={14} className="text-primary"/><b>{v}</b></div>)}
    </div>
    <div className="absolute bottom-4 left-4 hidden rounded-md border border-game-border bg-game-panel p-3 shadow-panel sm:block"><div className="relative h-32 w-32 overflow-hidden rounded bg-map"><span className="absolute left-[48%] top-[48%] size-2 rounded-full bg-primary shadow-beacon"/><span className="absolute left-[20%] top-[30%] size-3 rounded-sm bg-info"/><span className="absolute right-[20%] top-[38%] size-3 rounded-sm bg-warning"/><span className="absolute bottom-[20%] left-[35%] size-3 rounded-sm bg-positive"/><Map className="absolute bottom-2 right-2 text-muted-foreground" size={14}/></div></div>
    <div className="pointer-events-auto absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-md border border-game-border bg-game-panel p-2 shadow-panel"><Button size="icon" variant={inventoryOpen?"primary":"ghost"} aria-label="Inventory" onClick={toggleInventory}><Backpack size={18}/></Button><Button size="icon" variant={questOpen?"primary":"ghost"} aria-label="Quest log" onClick={toggleQuest}><ListChecks size={18}/></Button><Button size="icon" variant="ghost" aria-label={paused?"Resume":"Pause"} onClick={togglePause}>{paused?<Play size={18}/>:<Pause size={18}/>}</Button><Button size="icon" variant="ghost" aria-label="Game menu"><Menu size={18}/></Button></div>
    <div className="absolute bottom-4 right-4 hidden rounded-md border border-game-border bg-game-panel px-4 py-3 text-xs shadow-panel lg:block"><p className="font-semibold">WASD / Arrow keys</p><p className="mt-1 text-muted-foreground">Move · Click colonists to talk</p></div>
    {scene==="interior"&&<Button className="pointer-events-auto absolute left-1/2 top-5 -translate-x-1/2" variant="secondary" onClick={()=>enterScene("surface")}><X size={15}/>Exit habitat</Button>}
    {inventoryOpen&&<div className="pointer-events-auto absolute bottom-20 left-1/2 w-72 -translate-x-1/2 rounded-md border border-game-border bg-game-panel p-5 shadow-panel"><p className="mb-4 text-xs font-bold uppercase text-primary">Field inventory</p><div className="grid grid-cols-3 gap-2">{Object.entries(inventory).map(([name,value])=><div key={name} className="rounded bg-secondary p-3 text-center"><strong>{value}</strong><p className="mt-1 text-[10px] capitalize text-muted-foreground">{name}</p></div>)}</div></div>}
    {questOpen&&<div className="pointer-events-auto absolute bottom-20 left-1/2 w-80 -translate-x-1/2 rounded-md border border-game-border bg-game-panel p-5 shadow-panel"><p className="mb-3 text-xs font-bold uppercase text-primary">Active objective</p><p className="text-sm font-semibold">First harvest</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{objective}. Learn why today’s ore shipment is delayed.</p></div>}
    {paused&&<div className="pointer-events-auto absolute inset-0 grid place-items-center bg-overlay-light"><div className="rounded-md border border-game-border bg-game-panel p-8 text-center shadow-panel"><p className="text-xs font-bold uppercase text-primary">Simulation paused</p><h2 className="mt-2 text-2xl font-semibold">New Horizon is waiting</h2><Button className="mt-6" onClick={togglePause}><Play size={16}/>Resume colony</Button></div></div>}
  </div>;
}
