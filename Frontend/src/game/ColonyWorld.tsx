import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Html, Lightformer } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three/webgpu";
import { useKeyboard } from "./useKeyboard";
import { useGameStore } from "./store";

const MOVE = new THREE.Vector3();
const CAMERA_TARGET = new THREE.Vector3();
const LOOK_TARGET = new THREE.Vector3();
const NPCS = [
  { name: "Maya", role: "Miner", color: "#e7b04d", path: [[-8, 5],[-4, 3],[-7,0]] },
  { name: "Alex", role: "Farmer", color: "#5da86c", path: [[6, 4],[9, 1],[5,-1]] },
  { name: "Elena", role: "Engineer", color: "#69a8cc", path: [[-1,-5],[4,-6],[1,-1]] },
  { name: "Noah", role: "Hauler", color: "#c37b61", path: [[-5,-5],[0,1],[6,5]] },
] as const;

function createGroundTexture() {
  const canvas=document.createElement("canvas"); canvas.width=canvas.height=256; const ctx=canvas.getContext("2d"); if(!ctx)return null;
  ctx.fillStyle="#813e2d";ctx.fillRect(0,0,256,256);let seed=37;const rand=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};
  for(let i=0;i<650;i++){ctx.fillStyle=rand()>.5?"rgba(48,22,18,.22)":"rgba(225,130,82,.12)";ctx.fillRect(rand()*256,rand()*256,1+rand()*4,1+rand()*3)}
  const tex=new THREE.CanvasTexture(canvas);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(10,10);tex.colorSpace=THREE.SRGBColorSpace;return tex;
}

function Person({ color, player=false, name, path }: { color:string; player?:boolean; name?:string; path?: readonly (readonly [number,number])[] }) {
  const group=useRef<THREE.Group>(null);const leftArm=useRef<THREE.Group>(null);const rightArm=useRef<THREE.Group>(null);const leftLeg=useRef<THREE.Group>(null);const rightLeg=useRef<THREE.Group>(null);const keys=useKeyboard();const waypoint=useRef(0);const walking=useRef(false);
  useFrame(({camera,clock},rawDelta)=>{const delta=Math.min(rawDelta,.05);if(!group.current||useGameStore.getState().paused)return;walking.current=false;
    if(player){const k=keys.current;const dx=(k.has("KeyD")||k.has("ArrowRight")?1:0)-(k.has("KeyA")||k.has("ArrowLeft")?1:0);const dz=(k.has("KeyS")||k.has("ArrowDown")?1:0)-(k.has("KeyW")||k.has("ArrowUp")?1:0);MOVE.set(dx,0,dz);if(MOVE.lengthSq()>0){MOVE.normalize();group.current.position.addScaledVector(MOVE,4.2*delta);group.current.position.x=THREE.MathUtils.clamp(group.current.position.x,-16,16);group.current.position.z=THREE.MathUtils.clamp(group.current.position.z,-12,12);group.current.rotation.y=Math.atan2(MOVE.x,MOVE.z);walking.current=true;useGameStore.getState().setPlayer(group.current.position.x,group.current.position.z)}CAMERA_TARGET.set(group.current.position.x+9,10,group.current.position.z+12);camera.position.lerp(CAMERA_TARGET,1-Math.exp(-3*delta));LOOK_TARGET.copy(group.current.position);LOOK_TARGET.y=1.3;camera.lookAt(LOOK_TARGET);
    } else if(path){const target=path[waypoint.current];const vx=target[0]-group.current.position.x;const vz=target[1]-group.current.position.z;const dist=Math.hypot(vx,vz);if(dist<.25){waypoint.current=(waypoint.current+1)%path.length}else{group.current.position.x+=vx/dist*1.25*delta;group.current.position.z+=vz/dist*1.25*delta;group.current.rotation.y=Math.atan2(vx,vz);walking.current=true}}
    const swing=walking.current?Math.sin(clock.elapsedTime*9)*.55:0;if(leftArm.current)leftArm.current.rotation.x=swing;if(rightArm.current)rightArm.current.rotation.x=-swing;if(leftLeg.current)leftLeg.current.rotation.x=-swing*.7;if(rightLeg.current)rightLeg.current.rotation.x=swing*.7;
  });
  const select=()=>{if(name)useGameStore.getState().selectNpc(name)};
  return <group ref={group} position={player?[0,0,4]:path?[path[0][0],0,path[0][1]]:[0,0,0]} onClick={(e)=>{e.stopPropagation();select()}}>
    <mesh position={[0,1.65,0]} castShadow><sphereGeometry args={[.28,12,10]}/><meshStandardMaterial color="#d7a981" roughness={.9}/></mesh>
    <mesh position={[0,1.05,0]} castShadow><capsuleGeometry args={[.28,.65,4,8]}/><meshStandardMaterial color={color} roughness={.72}/></mesh>
    {[[-.38,1.3,0,leftArm,1],[.38,1.3,0,rightArm,-1]] as const}.flat().length && <></>
    <group ref={leftArm} position={[-.34,1.3,0]}><mesh position={[0,-.3,0]} castShadow><capsuleGeometry args={[.09,.45,3,6]}/><meshStandardMaterial color={color}/></mesh></group>
    <group ref={rightArm} position={[.34,1.3,0]}><mesh position={[0,-.3,0]} castShadow><capsuleGeometry args={[.09,.45,3,6]}/><meshStandardMaterial color={color}/></mesh></group>
    <group ref={leftLeg} position={[-.14,.7,0]}><mesh position={[0,-.38,0]} castShadow><capsuleGeometry args={[.11,.5,3,6]}/><meshStandardMaterial color="#28313a"/></mesh></group>
    <group ref={rightLeg} position={[.14,.7,0]}><mesh position={[0,-.38,0]} castShadow><capsuleGeometry args={[.11,.5,3,6]}/><meshStandardMaterial color="#28313a"/></mesh></group>
    {name&&<Html position={[0,2.25,0]} center distanceFactor={12}><div className="whitespace-nowrap rounded bg-game-panel px-2 py-1 text-[10px] font-semibold text-foreground shadow-panel">{name}</div></Html>}
  </group>;
}

function Building({position,color,label,type,onEnter}:{position:[number,number,number];color:string;label:string;type:"dome"|"block"|"tower";onEnter?:()=>void}){return <group position={position} onClick={(e)=>{e.stopPropagation();onEnter?.()}}>{type==="dome"?<mesh castShadow receiveShadow><sphereGeometry args={[2.3,24,12,0,Math.PI*2,0,Math.PI/2]}/><meshStandardMaterial color={color} roughness={.55} metalness={.25}/></mesh>:type==="tower"?<><mesh position={[0,1.8,0]} castShadow><cylinderGeometry args={[1.1,1.5,3.6,10]}/><meshStandardMaterial color={color} metalness={.35} roughness={.5}/></mesh><mesh position={[0,4,0]}><cylinderGeometry args={[.3,.5,1.3,8]}/><meshStandardMaterial color="#d6cab9"/></mesh></>:<mesh position={[0,1,0]} castShadow><boxGeometry args={[4,2,3]}/><meshStandardMaterial color={color} metalness={.25} roughness={.6}/></mesh>}<Html position={[0,type==="tower"?5:3,0]} center distanceFactor={16}><div className="whitespace-nowrap rounded border border-game-border bg-game-panel px-2 py-1 text-[10px] font-bold text-foreground">{label}</div></Html></group>}

function Surface(){const ground=useMemo(createGroundTexture,[]);const enter=useGameStore(s=>s.enterScene);return <><mesh rotation-x={-Math.PI/2} receiveShadow><planeGeometry args={[42,32,1,1]}/><meshStandardMaterial map={ground??undefined} roughness={1}/></mesh><gridHelper args={[40,20,"#a95b3e","#773d30"]} position={[0,.015,0]}/><Building position={[-9,0,-4]} color="#667886" label="IRON MINE" type="block"/><Building position={[8,0,-3]} color="#7f8c68" label="HYDROPONICS" type="dome"/><Building position={[0,0,-7]} color="#788a96" label="HABITAT · ENTER" type="dome" onEnter={()=>enter("interior")}/><Building position={[10,0,6]} color="#6f7072" label="OXYGEN" type="tower"/><Building position={[-10,0,6]} color="#7d7365" label="SOLAR ARRAY" type="block"/>{[[-14,-8],[-12,10],[13,-7],[15,9],[-3,10]].map(([x,z],i)=><mesh key={i} position={[x,.35,z]} rotation={[i*.2,i,.1]} castShadow><dodecahedronGeometry args={[.55+i*.06,0]}/><meshStandardMaterial color="#5e3028" roughness={1}/></mesh>)}<Person player color="#d96b43"/>{NPCS.map(n=><Person key={n.name} color={n.color} name={n.name} path={n.path}/>)}</>}

function Interior(){return <><mesh rotation-x={-Math.PI/2} receiveShadow><planeGeometry args={[22,18]}/><meshStandardMaterial color="#384049" roughness={.8}/></mesh><mesh position={[0,3,-8]}><boxGeometry args={[22,6,.4]}/><meshStandardMaterial color="#505b63"/></mesh>{[-7,0,7].map((x,i)=><group key={x} position={[x,0,-5]}><mesh position={[0,.6,0]} castShadow><boxGeometry args={[4,1.2,2]}/><meshStandardMaterial color={i===1?"#6b7d69":"#69747c"}/></mesh><mesh position={[0,1.8,-.8]}><boxGeometry args={[3,.08,1]}/><meshStandardMaterial color="#8bc2d8" emissive="#4b8da8" emissiveIntensity={.3}/></mesh></group>)}<Person player color="#d96b43"/><Person color="#69a8cc" name="Dr. Elena" path={[[-4,2],[4,2],[0,-2]]}/></>}

function Dialogue(){const selected=useGameStore(s=>s.selectedNpc);if(!selected)return null;return <Html fullscreen><div className="pointer-events-none absolute inset-0 flex items-end justify-center p-6"><div className="pointer-events-auto mb-20 w-full max-w-2xl rounded-md border border-game-border bg-game-panel p-5 shadow-panel"><div className="flex items-start justify-between gap-5"><div><p className="text-xs font-bold uppercase text-primary">{selected}</p><p className="mt-2 text-sm leading-6 text-foreground">The colony feels alive today, Commander. The next shift is already moving supplies. Check the mine before sunset.</p></div><button className="text-xs text-muted-foreground" onClick={()=>useGameStore.getState().selectNpc(null)}>Close</button></div></div></div></Html>}

export function ColonyWorld(){const scene=useGameStore(s=>s.scene);const weather=useGameStore(s=>s.weather);const hour=useGameStore(s=>s.hour);const sky=hour>18||hour<6?"#121520":"#68372d";return <Canvas shadows dpr={1} camera={{position:[9,10,16],fov:42}}><color attach="background" args={[sky]}/><fog attach="fog" args={[weather==="dust"?"#8b4e38":sky,18,42]}/><hemisphereLight args={["#d7a18d","#3f2925",1.2]}/><directionalLight position={[-10,16,8]} intensity={2.8} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}/><Environment resolution={64}><Lightformer intensity={2} position={[0,8,4]} scale={[12,12,1]} color="#ffd0b1"/></Environment>{scene==="surface"?<Surface/>:<Interior/>}<Dialogue/></Canvas>}
