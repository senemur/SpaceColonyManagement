import * as THREE from 'three';
import { CameraMode } from '../types';

export interface MarsEngineCallbacks {
  onPointerLockChange?: (locked: boolean) => void;
  onBuildingSelect?: (building: any) => void;
  onInsideBuildingChange?: (buildingName: string | null) => void;
}

export class MarsEngine {
  private container: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  private callbacks: MarsEngineCallbacks;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  private animationFrameId: number | null = null;
  private isRunning = false;

  // Player & Camera
  public camMode: CameraMode = 'TPS';
  private playerPos = new THREE.Vector3(0, 0, 15);
  private playerYaw = 0;
  private playerPitch = 0;
  private velocityY = 0;
  private isGrounded = true;
  private isPointerLocked = false;

  // Interior state
  public insideBuildingName: string | null = null;
  private exteriorGroup!: THREE.Group;
  private interiorGroup!: THREE.Group;

  // Keys
  private keys: Record<string, boolean> = {};

  constructor(container: HTMLDivElement, canvas: HTMLCanvasElement, callbacks: MarsEngineCallbacks = {}) {
    this.container = container;
    this.canvas = canvas;
    this.callbacks = callbacks;

    this.initThree();
    this.createEnvironment();
    this.createColonyBuildings();
    this.createInteriors();
    this.bindEvents();
  }

  private initThree() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a0a07);
    this.scene.fog = new THREE.FogExp2(0x2a100a, 0.008);

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffd5cc, 0.4);
    this.scene.add(ambientLight);

    const sun = new THREE.DirectionalLight(0xffebd8, 1.2);
    sun.position.set(50, 80, 40);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 300;
    sun.shadow.camera.left = -60;
    sun.shadow.camera.right = 60;
    sun.shadow.camera.top = 60;
    sun.shadow.camera.bottom = -60;
    this.scene.add(sun);
  }

  private createEnvironment() {
    // Mars Terrain
    const terrainGeo = new THREE.PlaneGeometry(300, 300, 64, 64);
    terrainGeo.rotateX(-Math.PI / 2);

    // Height displacement
    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const h = Math.sin(x * 0.05) * Math.cos(z * 0.05) * 2.5 + Math.sin(x * 0.02) * 1.5;
      posAttr.setY(i, h);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0xc85a32,
      roughness: 0.9,
      metalness: 0.1,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.receiveShadow = true;
    this.scene.add(terrain);

    // Starfield sky
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 1000;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 800;
      positions[i + 1] = Math.random() * 400 + 50;
      positions[i + 2] = (Math.random() - 0.5) * 800;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.2 });
    const starField = new THREE.Points(starsGeo, starsMat);
    this.scene.add(starField);
  }

  private createColonyBuildings() {
    this.exteriorGroup = new THREE.Group();

    // Habitat Dome
    const habGeo = new THREE.SphereGeometry(12, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const habMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3, metalness: 0.7 });
    const hab = new THREE.Mesh(habGeo, habMat);
    hab.position.set(0, 0, 0);
    hab.castShadow = true;
    hab.receiveShadow = true;
    hab.userData = { id: 'b1', name: 'Ana Yaşam Kubbesi', type: 'Hab', level: 2 };
    this.exteriorGroup.add(hab);

    // Farm Greenhouse (Glass Cylinder/Dome)
    const farmGeo = new THREE.CylinderGeometry(8, 8, 7, 16);
    const farmMat = new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, roughness: 0.1, transmission: 0.8, transparent: true, opacity: 0.7 });
    const farm = new THREE.Mesh(farmGeo, farmMat);
    farm.position.set(-30, 3.5, -20);
    farm.castShadow = true;
    farm.userData = { id: 'b2', name: 'Hidroponik Sera Modülü', type: 'Farm', level: 3 };
    this.exteriorGroup.add(farm);

    // Mine Complex (Scalable, detailed cylinder & structure)
    const mineGeo = new THREE.CylinderGeometry(7, 9, 8, 16);
    const mineMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8, metalness: 0.6 });
    const mine = new THREE.Mesh(mineGeo, mineMat);
    mine.position.set(35, 4, -30);
    mine.castShadow = true;
    mine.userData = { id: 'b3', name: 'Maden Kompleksi', type: 'Mine', level: 1 };
    this.exteriorGroup.add(mine);

    // Lab
    const labGeo = new THREE.BoxGeometry(16, 6, 10);
    const labMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4, metalness: 0.5 });
    const lab = new THREE.Mesh(labGeo, labMat);
    lab.position.set(-25, 3, 25);
    lab.castShadow = true;
    lab.userData = { id: 'b4', name: 'Araştırma Laboratuvarı', type: 'Lab', level: 2 };
    this.exteriorGroup.add(lab);

    this.scene.add(this.exteriorGroup);
  }

  private createInteriors() {
    this.interiorGroup = new THREE.Group();
    this.interiorGroup.visible = false;

    // Interior Room Shell
    const roomGeo = new THREE.BoxGeometry(24, 8, 24);
    const roomMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, side: THREE.BackSide, roughness: 0.7 });
    const room = new THREE.Mesh(roomGeo, roomMat);
    room.position.set(0, 4, 0);
    this.interiorGroup.add(room);

    // Farm Crops (hydroponic green plants)
    for (let x = -8; x <= 8; x += 4) {
      for (let z = -8; z <= 8; z += 4) {
        const cropGeo = new THREE.ConeGeometry(0.8, 1.8, 6);
        const cropMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.6 });
        const crop = new THREE.Mesh(cropGeo, cropMat);
        crop.position.set(x, 0.9, z);
        this.interiorGroup.add(crop);

        // Rack / Pot base
        const potGeo = new THREE.BoxGeometry(2, 0.5, 2);
        const potMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
        const pot = new THREE.Mesh(potGeo, potMat);
        pot.position.set(x, 0.25, z);
        this.interiorGroup.add(pot);
      }
    }

    // Interior Light
    const intLight = new THREE.PointLight(0x38bdf8, 1.5, 30);
    intLight.position.set(0, 7, 0);
    this.interiorGroup.add(intLight);

    this.scene.add(this.interiorGroup);
  }

  private bindEvents() {
    window.addEventListener('resize', this.onResize);

    // Mouse Pointer Lock
    document.addEventListener('pointerlockchange', this.onPointerLockChange);
    this.canvas.addEventListener('click', this.requestPointerLock);

    // Mouse Movement
    document.addEventListener('mousemove', this.onMouseMove);

    // Keyboard
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  private onResize = () => {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private requestPointerLock = () => {
    try {
      this.canvas.requestPointerLock();
    } catch {}
  };

  private onPointerLockChange = () => {
    this.isPointerLocked = document.pointerLockElement === this.canvas;
    if (this.callbacks.onPointerLockChange) {
      this.callbacks.onPointerLockChange(this.isPointerLocked);
    }
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isPointerLocked) return;
    const sensitivity = 0.0025;
    this.playerYaw -= e.movementX * sensitivity;
    this.playerPitch -= e.movementY * sensitivity;

    // Pitch clamping (-85 deg to +85 deg)
    const maxPitch = Math.PI / 2 - 0.05;
    this.playerPitch = Math.max(-maxPitch, Math.min(maxPitch, this.playerPitch));
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

    this.keys[e.code] = true;

    if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyE', 'KeyQ', 'KeyV', 'Space'].includes(e.code)) {
      e.preventDefault();
    }

    // Toggle Camera Mode
    if (e.code === 'KeyV') {
      this.camMode = this.camMode === 'TPS' ? 'FPS' : 'TPS';
    }

    // Enter / Exit Interior building
    if (e.code === 'KeyE') {
      this.toggleEnterBuilding();
    }

    if (e.code === 'KeyQ' && this.insideBuildingName) {
      this.exitBuilding();
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
  };

  public toggleEnterBuilding() {
    if (this.insideBuildingName) {
      this.exitBuilding();
    } else {
      // Check nearest building
      let nearestName: string | null = null;
      let minDistance = 25; // interact radius

      this.exteriorGroup.children.forEach((child) => {
        const dist = this.playerPos.distanceTo(child.position);
        if (dist < minDistance) {
          minDistance = dist;
          nearestName = child.userData?.name || 'Modül İçi';
        }
      });

      if (nearestName) {
        this.enterBuilding(nearestName);
      }
    }
  }

  public enterBuilding(name: string) {
    this.insideBuildingName = name;
    this.exteriorGroup.visible = false;
    this.interiorGroup.visible = true;
    this.playerPos.set(0, 1, 5); // move player into room center

    if (this.callbacks.onInsideBuildingChange) {
      this.callbacks.onInsideBuildingChange(this.insideBuildingName);
    }
  }

  public exitBuilding() {
    this.insideBuildingName = null;
    this.interiorGroup.visible = false;
    this.exteriorGroup.visible = true;
    this.playerPos.set(0, 1, 18);

    if (this.callbacks.onInsideBuildingChange) {
      this.callbacks.onInsideBuildingChange(null);
    }
  }

  private updatePlayer(delta: number) {
    const speed = (this.keys['ShiftLeft'] || this.keys['ShiftRight']) ? 14 : 7;
    const moveDir = new THREE.Vector3();

    if (this.keys['KeyW'] || this.keys['ArrowUp']) moveDir.z -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) moveDir.z += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveDir.x -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) moveDir.x += 1;

    if (moveDir.lengthSq() > 0) {
      moveDir.normalize();
      moveDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.playerYaw);
      this.playerPos.addScaledVector(moveDir, speed * delta);
    }

    // Jump / Gravity
    if (this.keys['Space'] && this.isGrounded) {
      this.velocityY = 7;
      this.isGrounded = false;
    }

    if (!this.isGrounded) {
      this.velocityY -= 18 * delta; // Mars gravity approx
      this.playerPos.y += this.velocityY * delta;
      if (this.playerPos.y <= 1) {
        this.playerPos.y = 1;
        this.velocityY = 0;
        this.isGrounded = true;
      }
    }

    // Camera positioning
    if (this.camMode === 'FPS') {
      this.camera.position.copy(this.playerPos).add(new THREE.Vector3(0, 0.7, 0));
    } else {
      // TPS Camera (Height & distance clamped mathematically - NO Raycast Freeze!)
      const dist = 6;
      const camOffset = new THREE.Vector3(
        Math.sin(this.playerYaw) * Math.cos(this.playerPitch) * dist,
        Math.sin(this.playerPitch) * dist + 2,
        Math.cos(this.playerYaw) * Math.cos(this.playerPitch) * dist
      );

      const wantCamPos = this.playerPos.clone().add(camOffset);
      // Math height clamping above ground level
      wantCamPos.y = Math.max(wantCamPos.y, 1.2);
      wantCamPos.y = Math.min(wantCamPos.y, this.playerPos.y + 6);

      this.camera.position.copy(wantCamPos);
      this.camera.lookAt(this.playerPos.clone().add(new THREE.Vector3(0, 1, 0)));
      return;
    }

    // Camera Rotation for FPS
    const euler = new THREE.Euler(this.playerPitch, this.playerYaw, 0, 'YXZ');
    this.camera.quaternion.setFromEuler(euler);
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    let lastTime = performance.now();

    const loop = (time: number) => {
      if (!this.isRunning) return;
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      this.updatePlayer(delta);
      this.renderer.render(this.scene, this.camera);

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  public destroy() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
    this.canvas.removeEventListener('click', this.requestPointerLock);
    document.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);

    this.renderer.dispose();
  }
}
