import * as THREE from "three";
import { createColony, BUILD_DEFS, COLOR, rnd, irnd, clamp, fmt } from "./colony-data.js";
import { buildInterior } from "./interiors.js";

export function initMars3D() {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const listeners = [];
  const addEvt = (target, event, handler) => {
    target.addEventListener(event, handler);
    listeners.push({ target, event, handler });
  };

  const WORLD = 260;
  const colony = createColony();

  /* ---------------- SAHNE ---------------- */
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xb8603a, 120, 420);

  const camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.1, 900);

  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: "high-performance",
  });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;

  const sceneEl = $("#scene");
  if (!sceneEl) return () => {};
  sceneEl.appendChild(renderer.domElement);

  /* ---------------- ARAZİ ---------------- */
  function hash2(x, y) {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return s - Math.floor(s);
  }
  function valueNoise(x, y) {
    const xi = Math.floor(x),
      yi = Math.floor(y);
    const xf = x - xi,
      yf = y - yi;
    const u = xf * xf * (3 - 2 * xf),
      v = yf * yf * (3 - 2 * yf);
    const a = hash2(xi, yi),
      b = hash2(xi + 1, yi);
    const c = hash2(xi, yi + 1),
      d = hash2(xi + 1, yi + 1);
    return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
  }
  function fbm(x, y, oct = 4) {
    let v = 0,
      amp = 1,
      freq = 1,
      norm = 0;
    for (let i = 0; i < oct; i++) {
      v += valueNoise(x * freq, y * freq) * amp;
      norm += amp;
      amp *= 0.5;
      freq *= 2.07;
    }
    return v / norm;
  }

  const craters = Array.from({ length: 26 }, () => ({
    x: rnd(-WORLD / 2, WORLD / 2),
    z: rnd(-WORLD / 2, WORLD / 2),
    r: rnd(6, 30),
    d: rnd(0.6, 2.4),
  }));

  function baseHeight(x, z) {
    let h = (fbm(x * 0.012, z * 0.012, 5) - 0.5) * 22;
    h += (fbm(x * 0.05, z * 0.05, 3) - 0.5) * 3.4;
    h += (fbm(x * 0.16, z * 0.16, 2) - 0.5) * 0.9;
    for (const c of craters) {
      const d = Math.hypot(x - c.x, z - c.z);
      if (d < c.r * 2.1) {
        const t = d / c.r;
        if (t < 1) h -= c.d * (1 - t * t) * 3.2;
        else h += c.d * Math.exp(-(t - 1) * 4) * 1.5;
      }
    }
    h *= clamp(Math.hypot(x, z) / 55, 0.35, 1);
    return h;
  }

  const PAD_R = { habitat: 6.4, solar: 5.5, lab: 5.5, mine: 6.0, farm: 5.8, rocket: 7.0 };
  const pads = colony.builds.map((b) => {
    const r = PAD_R[b.t] ?? 5.5;
    return { x: b.x, z: b.z, r, y: baseHeight(b.x, b.z) };
  });

  function terrainHeight(x, z) {
    let h = baseHeight(x, z);
    for (const p of pads) {
      const d = Math.hypot(x - p.x, z - p.z);
      if (d < p.r * 2.0) {
        const t = d <= p.r ? 1 : 1 - (d - p.r) / (p.r * 1.0);
        const s = t * t * (3 - 2 * t);
        h = h + (p.y - h) * s;
      }
    }
    return h;
  }

  const groundGeo = new THREE.PlaneGeometry(WORLD, WORLD, 160, 160); // Segment sayısı düşürüldü
  groundGeo.rotateX(-Math.PI / 2);
  {
    const pos = groundGeo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const cLow = new THREE.Color(0x8a4a2c),
      cMid = new THREE.Color(0xc26138);
    const cHigh = new THREE.Color(0xe0a26a),
      cRock = new THREE.Color(0x5f3520);
    const tmp = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i),
        z = pos.getZ(i);
      const y = terrainHeight(x, z);
      pos.setY(i, y);
      const t = clamp((y + 8) / 26, 0, 1);
      tmp
        .copy(cLow)
        .lerp(cMid, clamp(t * 1.6, 0, 1))
        .lerp(cHigh, clamp((t - 0.55) * 2, 0, 1));
      const n = fbm(x * 0.09, z * 0.09, 2);
      const m = fbm(x * 0.4, z * 0.4, 2);
      tmp.offsetHSL(0, (n - 0.5) * 0.1, (n - 0.5) * 0.16);
      tmp.offsetHSL(0, (m - 0.5) * 0.08, (m - 0.5) * 0.1);
      const slope = Math.abs(terrainHeight(x + 1, z) - terrainHeight(x - 1, z)) / 2;
      if (slope > 0.5) tmp.lerp(cRock, clamp((slope - 0.5) * 0.7, 0, 0.65));
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }
    groundGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    groundGeo.computeVertexNormals();
  }
  const ground = new THREE.Mesh(
    groundGeo,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.94,
      metalness: 0.02,
      flatShading: false,
    }),
  );
  ground.receiveShadow = true;
  ground.userData = { kind: "terrain" };
  scene.add(ground);

  {
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x6a3a26,
      roughness: 1,
      flatShading: true,
    });
    const rockMat2 = new THREE.MeshStandardMaterial({
      color: 0x8a5334,
      roughness: 1,
      flatShading: true,
    });
    for (let i = 0; i < 200; i++) {
      // Kaya sayısı azaltıldı
      const rx = rnd(-WORLD / 2 + 6, WORLD / 2 - 6);
      const rz = rnd(-WORLD / 2 + 6, WORLD / 2 - 6);
      if (Math.hypot(rx - 2, rz - 40) < 14) continue;
      if (pads.some((p) => Math.hypot(rx - p.x, rz - p.z) < p.r + 2.5)) continue;
      const s = rnd(0.25, 1.1);
      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(s, 0),
        Math.random() > 0.5 ? rockMat : rockMat2,
      );
      rock.position.set(rx, terrainHeight(rx, rz) + s * 0.35, rz);
      rock.rotation.set(rnd(0, 3), rnd(0, 3), rnd(0, 3));
      rock.scale.y = rnd(0.5, 0.9);
      rock.castShadow = false;
      rock.receiveShadow = true;
      rock.userData = { kind: "rock" };
      scene.add(rock);
    }
  }

  /* ---------------- GÖKYÜZÜ & IŞIK ---------------- */
  scene.add(new THREE.HemisphereLight(0xffc79a, 0x6b3520, 1.5));
  scene.add(new THREE.AmbientLight(0xffa878, 0.5));

  const sun = new THREE.DirectionalLight(0xfff0d8, 2.5);
  sun.position.set(-70, 80, 55);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024); // Gölge çözünürlüğü optimize edildi
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 300;
  const sc = 95;
  sun.shadow.camera.left = -sc;
  sun.shadow.camera.right = sc;
  sun.shadow.camera.top = sc;
  sun.shadow.camera.bottom = -sc;
  scene.add(sun);
  scene.add(sun.target);

  {
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        topColor: { value: new THREE.Color(0x8a6a63) },
        midColor: { value: new THREE.Color(0xcf8354) },
        bottomColor: { value: new THREE.Color(0x7d4526) },
      },
      vertexShader:
        "varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: `
        uniform vec3 topColor, midColor, bottomColor;
        varying vec3 vPos;
        void main(){
          float h = normalize(vPos).y;
          vec3 c = mix(bottomColor, midColor, smoothstep(-0.12, 0.20, h));
          c = mix(c, topColor, smoothstep(0.18, 0.78, h));
          gl_FragColor = vec4(c, 1.0);
        }`,
    });
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(600, 32, 20), skyMat));
  }

  for (let i = 0; i < 70; i++) {
    const a = (i / 90) * Math.PI * 2,
      r = rnd(230, 320),
      hgt = rnd(14, 62);
    const g = new THREE.ConeGeometry(rnd(14, 40), hgt, 5);
    g.translate(0, hgt / 2, 0);
    const mesh = new THREE.Mesh(
      g,
      new THREE.MeshStandardMaterial({
        color: 0x7a4028,
        roughness: 1,
        flatShading: true,
      }),
    );
    mesh.applyMatrix4(new THREE.Matrix4().makeRotationY(rnd(0, 3)));
    mesh.position.set(Math.cos(a) * r, -6, Math.sin(a) * r);
    scene.add(mesh);
  }

  const dust = (() => {
    const N = 900,
      pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = rnd(-120, 120);
      pos[i * 3 + 1] = rnd(0.3, 26);
      pos[i * 3 + 2] = rnd(-120, 120);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const p = new THREE.Points(
      g,
      new THREE.PointsMaterial({
        color: 0xffb27a,
        size: 0.13,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      }),
    );
    scene.add(p);
    return p;
  })();

  /* ---------------- YAPI MODELLERİ ---------------- */
  const MAT = {
    metal: new THREE.MeshStandardMaterial({ color: 0xb8bdc4, roughness: 0.42, metalness: 0.72 }),
    metalD: new THREE.MeshStandardMaterial({ color: 0x6e747c, roughness: 0.55, metalness: 0.6 }),
    glass: new THREE.MeshStandardMaterial({
      color: 0x2f6b8f,
      roughness: 0.12,
      metalness: 0.3,
      transparent: true,
      opacity: 0.72,
      emissive: 0x12384d,
      emissiveIntensity: 0.5,
    }),
    panel: new THREE.MeshStandardMaterial({
      color: 0x1b3a6b,
      roughness: 0.22,
      metalness: 0.55,
      emissive: 0x0a1c3a,
      emissiveIntensity: 0.35,
    }),
    white: new THREE.MeshStandardMaterial({ color: 0xe8e4dc, roughness: 0.6, metalness: 0.15 }),
    orange: new THREE.MeshStandardMaterial({
      color: 0xe2703a,
      roughness: 0.55,
      metalness: 0.3,
      emissive: 0x5c2408,
      emissiveIntensity: 0.4,
    }),
    rock: new THREE.MeshStandardMaterial({ color: 0x6b4030, roughness: 1, flatShading: true }),
    green: new THREE.MeshStandardMaterial({ color: 0x4f9a3a, roughness: 0.85 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x2a1f1c, roughness: 0.7, metalness: 0.4 }),
    deck: new THREE.MeshStandardMaterial({ color: 0x9aa0a6, roughness: 0.75, metalness: 0.15 }),
    wall: new THREE.MeshStandardMaterial({
      color: 0xd7d2c8,
      roughness: 0.85,
      side: THREE.BackSide,
    }),
    cloth: new THREE.MeshStandardMaterial({ color: 0x4a6fa5, roughness: 0.95 }),
    pillow: new THREE.MeshStandardMaterial({ color: 0xf1ece2, roughness: 0.95 }),
    lamp: new THREE.MeshStandardMaterial({
      color: 0xfff2d0,
      emissive: 0xffd9a0,
      emissiveIntensity: 1.6,
      roughness: 1,
    }),
    screen: new THREE.MeshStandardMaterial({
      color: 0x0d1b2a,
      emissive: 0x2a6f9e,
      emissiveIntensity: 0.9,
      roughness: 0.3,
    }),
  };
  function box(w, h, d, mat, x = 0, y = 0, z = 0) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  }
  function cyl(rt, rb, h, mat, seg = 12) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  }

  const BUILDERS = {
    habitat() {
      const g = new THREE.Group();
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(4.2, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2),
        MAT.metal,
      );
      dome.castShadow = true;
      dome.receiveShadow = true;
      g.add(dome);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.34, 8, 26), MAT.glass);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 1.9;
      g.add(ring);
      g.add(cyl(4.5, 4.8, 0.7, MAT.metalD, 18).translateY(0.35));
      g.add(box(1.1, 2.6, 0.9, MAT.metalD, 4.0, 1.3, 0));
      const ant = cyl(0.07, 0.07, 5, MAT.white, 6);
      ant.position.set(-2.4, 6.4, -1.2);
      g.add(ant);
      const dish = new THREE.Mesh(
        new THREE.SphereGeometry(0.85, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
        MAT.white,
      );
      dish.position.set(-2.4, 8.9, -1.2);
      dish.rotation.x = Math.PI;
      g.add(dish);
      g.add(box(1.3, 2.2, 0.3, MAT.orange, 0, 1.1, 4.2));

      g.add(
        cyl(0.28, 0.28, 2.4, MAT.metal, 10)
          .rotateX(Math.PI / 2)
          .translateY(1.6)
          .translateZ(-4.6),
      );
      const tunnel = new THREE.Group();
      tunnel.position.set(0, 0, -4.6);
      tunnel.add(box(1.9, 2.3, 2.2, MAT.metalD, 0, 1.15, 0));
      tunnel.add(box(2.1, 0.3, 2.3, MAT.orange, 0, 2.4, 0));
      const entryGlow = box(1.5, 2.0, 0.12, MAT.glass, 0, 1.05, -1.05);
      tunnel.add(entryGlow);
      const eSign = box(0.9, 0.22, 0.06, MAT.lamp, 0, 2.15, -1.0);
      tunnel.add(eSign);
      g.add(tunnel);

      const interior = buildInterior("habitat");
      g.add(interior.group);
      g.interiorData = interior;
      return g;
    },
    solar() {
      const g = new THREE.Group();
      g.add(box(9, 0.35, 5, MAT.metalD, 0, 0.6, 0));
      for (let r = 0; r < 2; r++)
        for (let c = 0; c < 4; c++) {
          const p = box(1.9, 0.12, 4.2, MAT.panel, -3.4 + c * 2.25, 1.5 + r * 1.55, r * 0.9);
          p.rotation.x = -0.42;
          g.add(p);
        }
      g.add(cyl(0.24, 0.3, 2, MAT.metal, 8).translateY(1));
      return g;
    },
    lab() {
      const g = new THREE.Group();
      g.add(box(9, 3.4, 6, MAT.white, 0, 1.7, 0));
      g.add(box(9.3, 0.4, 6.3, MAT.orange, 0, 3.55, 0));
      g.add(box(7.4, 1.2, 0.2, MAT.glass, 0, 2.1, 3.05));
      g.add(box(0.2, 1.2, 4.6, MAT.glass, -4.55, 2.1, 0));
      const tank = cyl(1.7, 1.7, 3, MAT.glass, 14);
      tank.position.set(5.4, 1.5, 2.2);
      g.add(tank);
      const cap = cyl(1.85, 1.85, 0.35, MAT.metalD, 14);
      cap.position.set(5.4, 0.2, 2.2);
      g.add(cap);
      const cap2 = cyl(1.85, 1.85, 0.35, MAT.metalD, 14);
      cap2.position.set(5.4, 3.05, 2.2);
      g.add(cap2);
      return g;
    },
    mine() {
      const g = new THREE.Group();
      g.add(cyl(3.1, 4.2, 2.2, MAT.rock, 9).translateY(1.1));
      const cone = new THREE.Mesh(new THREE.ConeGeometry(3.1, 2.2, 9), MAT.dark);
      cone.position.y = 3.2;
      g.add(cone);
      const conv = box(1.4, 0.5, 7, MAT.metalD, 3.4, 2.6, -1);
      conv.rotation.x = -0.32;
      g.add(conv);
      const tower = cyl(0.35, 0.45, 6, MAT.metal, 8);
      tower.position.set(4.6, 3, 0);
      g.add(tower);
      const arm = box(0.5, 0.5, 4.2, MAT.orange, 2.6, 5.4, 0);
      arm.rotation.y = 0.5;
      g.add(arm);
      g.add(box(1.5, 1.2, 1.5, MAT.dark, 0.9, 5.9, -1.6));
      for (let i = 0; i < 5; i++) {
        const r = new THREE.Mesh(new THREE.DodecahedronGeometry(rnd(0.4, 0.8), 0), MAT.rock);
        r.position.set(rnd(-6, -3.4), 0.4, rnd(-3, 3));
        r.castShadow = true;
        g.add(r);
      }
      return g;
    },
    farm() {
      // Büyük hidroponik sera: geniş platform, yüksek kubbe, dış ekim alanı
      const g = new THREE.Group();
      g.add(box(21, 0.6, 15, MAT.metalD, 0, 0.3, 0));
      g.add(box(21.4, 0.25, 15.4, MAT.orange, 0, 0.68, 0));

      const domeMat = new THREE.MeshStandardMaterial({
        color: 0xa8e6c0,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(11, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        domeMat,
      );
      dome.scale.set(1, 0.66, 0.7);
      dome.position.y = 0.75;
      g.add(dome);

      // kubbe kemerleri
      for (let i = -2; i <= 2; i++) {
        const rib = new THREE.Mesh(
          new THREE.TorusGeometry(11 * (i === 0 ? 0.18 : 1), 0.16, 6, 20, Math.PI),
          MAT.metal,
        );
        rib.scale.set(1, 0.66, 0.7);
        rib.rotation.y = Math.PI / 2;
        rib.position.set(i * 4.4, 0.75, 0);
        g.add(rib);
      }
      const spine = new THREE.Mesh(new THREE.TorusGeometry(11, 0.22, 6, 24, Math.PI), MAT.metal);
      spine.scale.set(1, 0.66, 0.7);
      spine.position.y = 0.75;
      g.add(spine);

      // dış ekim alanı (çatı üstü küvetler)
      for (let r = 0; r < 4; r++)
        for (let c = 0; c < 7; c++) {
          const x = -7.2 + c * 2.4,
            z = -5 + r * 3.1;
          g.add(box(1.9, 0.5, 1.6, MAT.metalD, x, 1.0, z));
          for (let i = 0; i < 3; i++) {
            const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.9, 5), MAT.green);
            leaf.position.set(x - 0.55 + i * 0.55, 1.75, z);
            leaf.castShadow = true;
            g.add(leaf);
          }
        }

      // giriş tüneli + kapı
      g.add(
        cyl(0.3, 0.3, 2.6, MAT.metal, 10)
          .rotateX(Math.PI / 2)
          .translateY(1.6)
          .translateZ(-8.6),
      );
      const tunnel = new THREE.Group();
      tunnel.position.set(0, 0, -8.6);
      tunnel.add(box(2.2, 2.6, 2.6, MAT.metalD, 0, 1.3, 0));
      tunnel.add(box(2.4, 0.35, 2.7, MAT.orange, 0, 2.75, 0));
      tunnel.add(box(1.7, 2.2, 0.14, MAT.glass, 0, 1.15, -1.25));
      tunnel.add(box(1.0, 0.24, 0.08, MAT.lamp, 0, 2.35, -1.2));
      g.add(tunnel);

      // su tankı
      const tank = cyl(0.6, 0.6, 2.2, MAT.white, 10);
      tank.position.set(10.2, 1.6, 5.6);
      g.add(tank);
      const tankTop = cyl(0.66, 0.66, 0.25, MAT.orange, 10);
      tankTop.position.set(10.2, 2.75, 5.6);
      g.add(tankTop);
      return g;
    },
    rocket() {
      const g = new THREE.Group();
      g.add(cyl(6, 6.6, 1, MAT.rock, 12).translateY(0.5));
      const body = cyl(1.5, 1.9, 12, MAT.white, 14);
      body.position.y = 7;
      g.add(body);
      const nose = new THREE.Mesh(new THREE.ConeGeometry(1.5, 3.4, 14), MAT.orange);
      nose.position.y = 14.7;
      g.add(nose);
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2;
        const p = cyl(0.75, 0.85, 6, MAT.white, 10);
        p.position.set(Math.cos(a) * 2.6, 3.6, Math.sin(a) * 2.6);
        g.add(p);
      }
      g.add(cyl(5.4, 5.4, 0.25, MAT.metalD, 16).translateY(1.1));
      g.add(box(2.2, 0.3, 1, MAT.orange, 4.4, 1.6, 0));
      for (let i = 0; i < 6; i++)
        g.add(box(2.2, 0.16, 0.5, MAT.metal, 4.4, 0.4 + i * 0.55, -0.9 - i * 0.55));
      return g;
    },
  };

  const buildMeshes = [];
  const interiors = [];
  const habitats = [];

  const ENTRY_TEXT = {
    habitat: "Uyuyan ve çalışan mürettebat",
    farm: "Çapala, sula, hasat et",
    mine: "Cevher kaz, vagonu yükle",
    lab: "Numune al, analiz et",
    solar: "İnvertör ve batarya bakımı",
    rocket: "Fırlatma sırasını hazırla",
    default: "İçeri gir",
  };
  colony.builds.forEach((b) => {
    const g = BUILDERS[b.t]();
    g.position.set(b.x, terrainHeight(b.x, b.z), b.z);
    g.rotation.y = rnd(0, Math.PI * 2);
    g.userData = { kind: "build", ref: b };
    g.traverse((o) => {
      o.userData = g.userData;
    });
    scene.add(g);
    buildMeshes.push(g);
    const glow = new THREE.Mesh(
      new THREE.CircleGeometry(6, 24),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(COLOR[b.k]),
        transparent: true,
        opacity: 0.13,
        depthWrite: false,
      }),
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.set(b.x, terrainHeight(b.x, b.z) + 0.06, b.z);
    scene.add(glow);

    const interior = g.interiorData || buildInterior(b.t);
    if (interior) {
      g.add(interior.group);
      interior.group.visible = false;
      const toWorld = (v) => g.localToWorld(v.clone());
      const s = interior.slots;
      const entry = {
        mesh: g,
        b,
        type: b.t,
        interior,
        floorY: g.position.y + interior.floorY,
        radius: interior.radius,
        door: toWorld(interior.doorLocal),
        innerDoor: toWorld(s.door),
        slots: {
          bed: (s.bed || []).map((sl) => {
            const w = toWorld(sl.p);
            return { x: w.x, y: w.y, z: w.z, yaw: sl.yaw };
          }),
          work: (s.work || []).map(toWorld),
          door: toWorld(s.door),
        },
        stations: interior.stations || [],
        planters: interior.planters || [],
      };
      entry.hint = ENTRY_TEXT[b.t] || ENTRY_TEXT.default;
      interiors.push(entry);
      if (interior.slots.bed.length) habitats.push(entry);
    }
  });

  const SUIT = {
    white: new THREE.MeshStandardMaterial({ color: 0xe6e2da, roughness: 0.55, metalness: 0.12 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x2e3338, roughness: 0.5, metalness: 0.45 }),
    visor: new THREE.MeshStandardMaterial({
      color: 0x1a2a3a,
      roughness: 0.08,
      metalness: 0.85,
      emissive: 0x2a5a7a,
      emissiveIntensity: 0.35,
    }),
  };

  function makeAstronaut(colorHex, name) {
    const root = new THREE.Group();
    const suit = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.5,
      metalness: 0.15,
    });
    const accent = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex).multiplyScalar(0.55),
      roughness: 0.6,
    });

    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 0.52, 6, 12), suit);
    torso.position.y = 1.18;
    torso.castShadow = true;
    root.add(torso);
    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.26, 0.14), accent);
    chest.position.set(0, 1.32, 0.3);
    root.add(chest);
    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.5, 0.26), SUIT.dark);
    pack.position.set(0, 1.24, -0.36);
    pack.castShadow = true;
    root.add(pack);
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.44, 8), SUIT.white);
    tank.position.set(0, 1.26, -0.5);
    root.add(tank);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 14), SUIT.white);
    head.position.y = 1.78;
    head.castShadow = true;
    root.add(head);
    const visor = new THREE.Mesh(
      new THREE.SphereGeometry(0.245, 16, 12, 0, Math.PI * 2, 0.5, 1.2),
      SUIT.visor,
    );
    visor.position.set(0, 1.78, 0.07);
    visor.rotation.x = Math.PI / 2;
    root.add(visor);

    const arms = [];
    for (const s of [-1, 1]) {
      const shoulder = new THREE.Group();
      shoulder.position.set(s * 0.42, 1.42, 0);
      const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.115, 0.42, 4, 8), suit);
      upper.position.y = -0.26;
      upper.castShadow = true;
      shoulder.add(upper);
      const glove = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), SUIT.dark);
      glove.position.y = -0.55;
      shoulder.add(glove);
      root.add(shoulder);
      arms.push(shoulder);
    }
    const legs = [];
    for (const s of [-1, 1]) {
      const hip = new THREE.Group();
      hip.position.set(s * 0.17, 0.78, 0);
      const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.46, 4, 8), suit);
      thigh.position.y = -0.28;
      thigh.castShadow = true;
      hip.add(thigh);
      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.15, 0.34), SUIT.dark);
      boot.position.set(0, -0.6, 0.05);
      hip.add(boot);
      root.add(hip);
      legs.push(hip);
    }

    const cvs = document.createElement("canvas");
    cvs.width = 256;
    cvs.height = 64;
    const ctx = cvs.getContext("2d");
    ctx.fillStyle = "rgba(18,10,9,.72)";
    ctx.beginPath();
    ctx.roundRect(2, 8, 252, 44, 12);
    ctx.fill();
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(2, 8, 252, 44, 12);
    ctx.stroke();
    ctx.fillStyle = "#f6ece6";
    ctx.font = "600 21px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name, 128, 31);
    const tex = new THREE.CanvasTexture(cvs);
    const label = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }),
    );
    label.position.y = 2.35;
    label.scale.set(2.2, 0.55, 1);
    root.add(label);

    root.traverse((o) => {
      if (o.isMesh) o.receiveShadow = true;
    });
    return {
      root,
      arms,
      legs,
      label,
      labelTex: tex,
      torso,
      head: root.children.find((c) => c.isGroup && c.children.length),
    };
  }

  function poseSleep(a, yaw = 0) {
    a.root.rotation.order = "YXZ";
    a.root.rotation.set(Math.PI / 2, yaw, 0);
    a.legs[0].rotation.x = 0.08;
    a.legs[1].rotation.x = -0.04;
    a.arms[0].rotation.x = -0.12;
    a.arms[1].rotation.x = -0.12;
    a.arms[0].rotation.z = 0;
    a.arms[1].rotation.z = 0;
  }
  function poseWork(a) {
    a.root.rotation.set(0, Math.PI, 0);
    a.root.position.y = a.seatY;
    a.legs[0].rotation.x = -1.35;
    a.legs[1].rotation.x = -1.35;
    a.arms[0].rotation.x = -0.9;
    a.arms[1].rotation.x = -0.9;
  }
  function poseStand(a) {
    a.root.rotation.order = "YXZ";
    a.root.rotation.set(0, a.heading, 0);
    a.legs[0].rotation.x = 0;
    a.legs[1].rotation.x = 0;
    a.arms[0].rotation.x = 0;
    a.arms[1].rotation.x = 0;
    a.arms[0].rotation.z = 0;
    a.arms[1].rotation.z = 0;
    a.torso.scale.set(1, 1, 1);
  }

  const STATE_TEXT = {
    patrol: "Devriye geziyor",
    follow: "Seni takip ediyor",
    inspect: "Yapıyı inceliyor",
    rest: "Dinleniyor",
    return: "Ana üsse dönüyor",
    sleep: "Uyuyor",
    work: "İçeride çalışıyor",
    gobed: "Yatağa gidiyor",
    gowork: "Çalışma istasyonuna gidiyor",
    job: "Görev istasyonunda çalışıyor",
    leave: "Dışarı çıkıyor",
  };

  function pickPatrolTarget(a) {
    const b = buildMeshes[irnd(0, buildMeshes.length - 1)];
    const ang = rnd(0, Math.PI * 2),
      r = rnd(9, 17);
    a.target = new THREE.Vector3(
      b.position.x + Math.cos(ang) * r,
      0,
      b.position.z + Math.sin(ang) * r,
    );
    a.state = "patrol";
    a.statusText = STATE_TEXT.patrol;
  }

  /** Bir görev istasyonuna yerleşip çalışmaya başlar. */
  function goToJob(a, entry) {
    if (!entry || !entry.stations.length) return;
    const st = entry.stations[astrons.indexOf(a) % entry.stations.length];
    const w = entry.mesh.localToWorld(st.position.clone());
    a.state = "job";
    a.statusText = STATE_TEXT.job;
    a.inside = entry;
    a.floorY = entry.floorY;
    a.root.position.set(w.x, entry.floorY, w.z);
    a.jobYaw = Math.atan2(entry.b.x - w.x, entry.b.z - w.z);
    a.heading = a.jobYaw;
    a.label.visible = false;
    poseStand(a);
    a.arms[0].rotation.x = -1.15;
    a.arms[1].rotation.x = -1.15;
  }

  const astrons = [];
  colony.crew.forEach((p) => {
    const astro = makeAstronaut(new THREE.Color(p.bg).getHex(), p.name);
    astro.root.userData = { kind: "crew", ref: p };
    astro.root.traverse((o) => {
      o.userData = astro.root.userData;
    });
    astro.root.position.set(p.wx, terrainHeight(p.wx, p.wz), p.wz);
    scene.add(astro.root);
    astrons.push({
      ...astro,
      crew: p,
      speed: rnd(1.5, 2.6),
      phase: rnd(0, Math.PI * 2),
      state: "patrol",
      target: null,
      home: new THREE.Vector3(p.wx, 0, p.wz),
      waitFor: rnd(0, 3),
      heading: rnd(0, Math.PI * 2),
      statusText: STATE_TEXT.patrol,
      inside: null,
      bedY: 0,
      seatY: 0,
      habitat: null,
      bed: null,
    });
  });

  astrons.forEach((a, i) => {
    a.habitat = habitats[i % habitats.length];
    if (i < 6) {
      goToBed(a);
    } else if (i < 12) {
      goToWork(a);
    } else {
      // kalan mürettebat diğer binaların görev istasyonlarında çalışır
      const jobs = interiors.filter((e) => e.type !== "habitat" && e.stations.length);
      if (jobs.length) goToJob(a, jobs[i % jobs.length]);
    }
  });

  function goToBed(a, h = a.habitat) {
    if (!h) return;
    a.state = "sleep";
    a.statusText = STATE_TEXT.sleep;
    a.inside = h;
    const slot = h.slots.bed[astrons.indexOf(a) % h.slots.bed.length];
    a.bed = slot;
    a.bedY = slot.y;
    a.root.position.set(slot.x, slot.y, slot.z);
    a.heading = 0;
    poseSleep(a, slot.yaw);
  }
  function goToWork(a, h = a.habitat) {
    if (!h) return;
    a.state = "work";
    a.statusText = STATE_TEXT.work;
    a.inside = h;
    const slot = h.slots.work[astrons.indexOf(a) % h.slots.work.length];
    a.seatY = h.floorY + 0.52;
    a.root.position.set(slot.x, a.seatY, slot.z);
    a.heading = 0;
    poseWork(a);
  }
  function sendOutside(a) {
    if (!a.inside) return;
    const h = a.inside;
    // her bina için dış kapı konumu kullanılır
    const door = h.slots.door && h.type === "habitat" ? h.slots.door : h.door;
    a.inside = null;
    a.state = "leave";
    a.statusText = STATE_TEXT.leave;
    a.root.position.set(door.x, terrainHeight(door.x, door.z), door.z);
    a.bed = null;
    a.heading = Math.atan2(h.b.x - door.x, h.b.z - door.z);
    poseStand(a);
    a.waitFor = 0.4;
    setTimeout(() => {
      if (!a.inside && a.state === "leave") {
        a.state = "patrol";
        a.statusText = STATE_TEXT.patrol;
        a.target = null;
      }
    }, 1500);
  }

  let selected = null;
  let following = null;

  function updateCrew(dt) {
    astrons.forEach((a) => {
      const p = a.crew;
      if (a.inside) {
        p.wx = a.root.position.x;
        p.wz = a.root.position.z;
        p.status = "ok";
        // oyuncu o binada değilse içerideki mürettebat görünmez
        a.root.visible = player.inside === a.inside;
        a.phase += dt * 1.1;
        if (a.state === "sleep") {
          const br = Math.sin(a.phase * 0.9) * 0.5 + 0.5;
          a.root.position.y = a.bedY + br * 0.035;
          a.torso.scale.set(1 + br * 0.035, 1 + br * 0.03, 1 + br * 0.035);
          a.arms[0].rotation.x = -0.12 + br * 0.04;
          a.arms[1].rotation.x = -0.12 + br * 0.04;
          a.legs[0].rotation.x = 0.08 + br * 0.02;
          a.legs[1].rotation.x = -0.04 - br * 0.02;
          a.root.rotation.x = Math.PI / 2 + Math.sin(a.phase * 0.45) * 0.015;
        } else if (a.state === "work") {
          const t = a.phase * 4.5;
          a.arms[0].rotation.x = -0.95 + Math.sin(t) * 0.13;
          a.arms[1].rotation.x = -0.95 + Math.sin(t + 1.2) * 0.13;
          a.arms[0].rotation.z = 0.14;
          a.arms[1].rotation.z = -0.14;
          a.root.rotation.y = Math.PI + Math.sin(a.phase * 0.8) * 0.1;
          a.torso.scale.set(1, 1 + Math.sin(a.phase * 2) * 0.012, 1);
          a.root.position.y = a.seatY;
        } else if (a.state === "job") {
          // istasyonda çalışma: kollar hareket eder, gövde hafif eğilir
          const t = a.phase * 5.5;
          a.arms[0].rotation.x = -1.15 + Math.sin(t) * 0.26;
          a.arms[1].rotation.x = -1.15 + Math.sin(t + 1.6) * 0.26;
          a.arms[0].rotation.z = 0.12;
          a.arms[1].rotation.z = -0.12;
          a.root.rotation.y = a.jobYaw + Math.sin(a.phase * 0.7) * 0.12;
          a.torso.scale.set(1, 1 + Math.sin(a.phase * 2.4) * 0.014, 1);
          a.root.position.y = a.floorY;
          a.legs[0].rotation.x = -0.13;
          a.legs[1].rotation.x = 0.13;
        }
        a.label.visible = false;
        if (selected === a) renderInspect();
        return;
      }
      a.root.visible = true;
      a.label.visible = true;
      a.torso.scale.set(1, 1, 1);
      a.arms[0].rotation.z = 0;
      a.arms[1].rotation.z = 0;

      p.wx = a.root.position.x;
      p.wz = a.root.position.z;
      p.status = p.hp > 75 ? "ok" : p.hp > 45 ? "warn" : "bad";
      let moving = false;

      if (a.waitFor > 0) {
        a.waitFor -= dt;
      } else if (a.state === "follow") {
        if (a.root.position.distanceTo(player.pos) > 4.5) {
          a.target = player.pos.clone();
          moving = true;
        } else a.target = null;
      } else if (a.state === "inspect" && a.inspectTarget) {
        a.target = a.inspectTarget;
        moving = a.root.position.distanceTo(a.target) > 5.5;
        if (!moving) {
          a.waitFor = rnd(3, 6);
          a.state = "patrol";
          a.inspectTarget = null;
        }
      } else if (a.state === "rest") {
        if (a.root.position.distanceTo(a.home) > 2.5) {
          a.target = a.home.clone();
          moving = true;
        } else if (a.waitFor <= 0) a.waitFor = rnd(8, 16);
      } else {
        if (!a.target || a.root.position.distanceTo(a.target) < 1.4) {
          a.waitFor = rnd(1.5, 5);
          a.target = null;
          pickPatrolTarget(a);
        } else moving = true;
      }

      if (moving && a.target) {
        const dir = new THREE.Vector3(
          a.target.x - a.root.position.x,
          0,
          a.target.z - a.root.position.z,
        );
        dir.normalize();
        a.root.position.addScaledVector(dir, a.speed * dt);
        const want = Math.atan2(dir.x, dir.z);
        let diff = want - a.heading;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        a.heading += diff * Math.min(1, dt * 6);
        a.phase += dt * a.speed * 3.4;
      } else a.phase += dt * 1.2;

      const gy = terrainHeight(a.root.position.x, a.root.position.z);
      a.root.position.y += (gy - a.root.position.y) * Math.min(1, dt * 9);
      a.root.rotation.order = "YXZ";
      a.root.rotation.set(0, a.heading, 0);

      const sw = moving ? Math.sin(a.phase) * 0.62 : Math.sin(a.phase) * 0.05;
      a.legs[0].rotation.x = sw;
      a.legs[1].rotation.x = -sw;
      a.arms[0].rotation.x = -sw * 0.75;
      a.arms[1].rotation.x = sw * 0.75;
      a.root.position.y += Math.abs(Math.sin(a.phase)) * (moving ? 0.055 : 0);
      a.root.rotation.z = moving ? Math.sin(a.phase) * 0.035 : 0;

      const dist = a.root.position.distanceTo(camera.position);
      a.label.visible = dist < 60;
      const s = clamp(dist * 0.062, 1.3, 2.6);
      a.label.scale.set(s, s * 0.25, 1);
    });
  }

  const camRay = new THREE.Raycaster();
  const CAM_IGNORE = new Set(["terrain", "rock", "crew"]);

  let meshCache = null;
  function raycastMeshes() {
    if (!meshCache) {
      meshCache = [];
      scene.traverse((o) => {
        if (o.isMesh) meshCache.push(o);
      });
    }
    return meshCache;
  }
  function visibleMeshes() {
    return raycastMeshes().filter((o) => o.visible);
  }

  function cameraBlockRay(from, to) {
    const dir = to.clone().sub(from);
    const len = dir.length();
    if (len < 0.01) return null;
    dir.divideScalar(len);
    camRay.set(from, dir);
    camRay.far = len;
    const hits = camRay.intersectObjects(camIntersectables, true);
    for (const h of hits) {
      const k = h.object.userData?.kind;
      if (CAM_IGNORE.has(k)) continue;
      if (!k) continue;
      const d = h.distance;
      if (d >= len) return null;
      const safe = Math.min(1.6, Math.max(0.6, d - 1.4));
      const p = from.clone().addScaledVector(dir, safe);
      p.y = from.y + 1.35;
      p.y = Math.max(p.y, groundY(p.x, p.z) + 1.5);
      p.y = Math.min(p.y, from.y + 2.2);
      return p;
    }
    return null;
  }
  const player = {
    pos: new THREE.Vector3(2, 0, 44),
    vel: new THREE.Vector3(),
    yaw: 0,
    pitch: -0.04,
    vy: 0,
    onGround: true,
    height: 1.7,
    speed: 7.5,
    runSpeed: 14,
    camMode: "fps",
    inside: null,
    heading: 0,
  };
  player.pos.y = terrainHeight(player.pos.x, player.pos.z);
  let bob = 0;
  let camSnap = true;
  const keys = {};

  const playerAvatar = makeAstronaut(0xe2703a, "Sen");
  playerAvatar.label.visible = false;
  playerAvatar.root.traverse((o) => {
    o.userData = {};
  });
  playerAvatar.root.position.copy(player.pos);
  playerAvatar.root.visible = false;
  scene.add(playerAvatar.root);

  function animateAvatar(av, moving, speedScale = 1) {
    av.phase += moving ? 0.075 * speedScale : 0.012;
    const sw = moving ? Math.sin(av.phase) * 0.62 : Math.sin(av.phase) * 0.04;
    av.legs[0].rotation.x = sw;
    av.legs[1].rotation.x = -sw;
    av.arms[0].rotation.x = -sw * 0.75;
    av.arms[1].rotation.x = sw * 0.75;
    av.arms[0].rotation.z = 0.06;
    av.arms[1].rotation.z = -0.06;
  }

  function toggleCam() {
    player.camMode = player.camMode === "fps" ? "tps" : "fps";
    camSnap = true;
    playerAvatar.root.visible = player.camMode === "tps";
    const cm = $("#camMode");
    if (cm) {
      cm.textContent = player.camMode === "fps" ? "FPS" : "TPS";
      cm.classList.toggle("on", player.camMode === "tps");
    }
    toast(
      player.camMode === "fps"
        ? "<b>Birinci şahıs</b> (FPS) kamera"
        : "<b>Üçüncü şahıs</b> (TPS) kamera — arkasından görüyorsun",
      "ok",
    );
  }

  function groundY(x, z) {
    return player.inside ? player.inside.floorY : terrainHeight(x, z);
  }

  function enterInterior(h) {
    if (!h || player.inside) return;
    player.inside = h;
    const d = h.door;
    const toC = new THREE.Vector3(h.b.x - d.x, 0, h.b.z - d.z).normalize();
    const start = new THREE.Vector3(d.x, 0, d.z).addScaledVector(toC, 2.2);
    player.pos.set(start.x, h.floorY, start.z);
    player.vy = 0;
    player.yaw = Math.atan2(-toC.x, -toC.z);
    player.pitch = -0.05;
    h.mesh.children.forEach((c) => {
      if (c !== h.interior.group) c.visible = false;
    });
    h.interior.group.visible = true;
    taskProgress = 0;
    taskTarget = null;
    taskListKey = "";
    lastTaskListKey = "";
    showTaskPanel(h);
    toast(`<b>${h.b.n}</b> içeri girdin · ${h.hint} · <kbd>Q</kbd> ile dışarı çık`, "ok");
  }

  function exitInterior() {
    const h = player.inside;
    if (!h) return;
    const d = h.door;
    const out = new THREE.Vector3(d.x, 0, d.z);
    const away = new THREE.Vector3(d.x - h.b.x, 0, d.z - h.b.z).normalize();
    out.addScaledVector(away, 1.6);
    player.inside = null;
    player.pos.set(out.x, terrainHeight(out.x, out.z), out.z);
    player.vy = 0;
    player.yaw = Math.atan2(-away.x, -away.z);
    h.mesh.children.forEach((c) => {
      c.visible = true;
    });
    h.interior.group.visible = false;
    taskProgress = 0;
    taskTarget = null;
    taskListKey = "";
    lastTaskListKey = "";
    hideTaskPanel();
    toast(`<b>${h.b.n}</b> dışına çıktın — EYLEM: basınç kaybı riski`, "warn");
  }

  const canvas = renderer.domElement;
  let locked = false;

  const onClickCanvas = () => {
    if (locked) return;
    try {
      canvas.requestPointerLock();
    } catch {}
  };
  addEvt(canvas, "click", onClickCanvas);

  const onPLock = () => {
    locked = document.pointerLockElement === canvas;
  };
  addEvt(document, "pointerlockchange", onPLock);

  const onMMove = (e) => {
    if (!locked) return;
    player.yaw -= e.movementX * 0.0022;
    player.pitch -= e.movementY * 0.0022;
    player.pitch = clamp(player.pitch, -1.35, 1.35);
  };
  addEvt(document, "mousemove", onMMove);

  let dragging = false,
    lastX = 0,
    lastY = 0;
  const onMD = (e) => {
    if (!locked) {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    }
  };
  const onMU = () => {
    dragging = false;
  };
  const onMM = (e) => {
    if (locked || !dragging) return;
    player.yaw -= (e.clientX - lastX) * 0.004;
    player.pitch -= (e.clientY - lastY) * 0.004;
    player.pitch = clamp(player.pitch, -1.35, 1.35);
    lastX = e.clientX;
    lastY = e.clientY;
  };
  addEvt(canvas, "mousedown", onMD);
  addEvt(window, "mouseup", onMU);
  addEvt(window, "mousemove", onMM);

  const onKD = (e) => {
    keys[e.code] = true;
    if (e.code === "Space" && !player.inside) {
      e.preventDefault();
      if (player.onGround) {
        player.vy = 6.2;
        player.onGround = false;
      }
    }
    if (e.code === "KeyE") {
      interact();
      taskHolding = true;
    }
    if (e.code === "KeyF") toggleFollow();
    if (e.code === "KeyV") toggleCam();
    if (e.code === "KeyQ") exitInterior();
  };
  const onKU = (e) => {
    keys[e.code] = false;
    if (e.code === "KeyE") taskHolding = false;
  };
  addEvt(window, "keydown", onKD);
  addEvt(window, "keyup", onKU);

  const touch = { move: { x: 0, y: 0 }, look: { x: 0, y: 0 } };
  function bindStick(elId, out) {
    const el = $(elId);
    if (!el) return;
    const knob = el.querySelector("i");
    const R = 56;
    let id = null;
    const set = (cx, cy) => {
      const r = el.getBoundingClientRect();
      let dx = cx - (r.left + r.width / 2),
        dy = cy - (r.top + r.height / 2);
      const len = Math.hypot(dx, dy);
      if (len > R) {
        dx = (dx / len) * R;
        dy = (dy / len) * R;
      }
      knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
      out.x = dx / R;
      out.y = dy / R;
    };
    addEvt(el, "pointerdown", (e) => {
      id = e.pointerId;
      set(e.clientX, e.clientY);
    });
    addEvt(el, "pointermove", (e) => {
      if (e.pointerId === id) set(e.clientX, e.clientY);
    });
    const end = (e) => {
      if (e.pointerId !== id) return;
      id = null;
      out.x = 0;
      out.y = 0;
      knob.style.transform = "translate(-50%,-50%)";
    };
    addEvt(el, "pointerup", end);
    addEvt(el, "pointercancel", end);
  }
  bindStick("#stickMove", touch.move);
  bindStick("#stickLook", touch.look);

  const btnUse = $("#tbtnUse");
  if (btnUse) {
    addEvt(btnUse, "pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      interact();
      taskHolding = true;
    });
    const release = (e) => {
      e.preventDefault();
      taskHolding = false;
    };
    addEvt(btnUse, "pointerup", release);
    addEvt(btnUse, "pointercancel", release);
    addEvt(btnUse, "pointerleave", release);
  }

  function updatePlayer(dt) {
    const fwd =
      (keys["KeyW"] || keys["ArrowUp"] ? 1 : 0) -
      (keys["KeyS"] || keys["ArrowDown"] ? 1 : 0) -
      touch.move.y;
    const strafe =
      (keys["KeyD"] || keys["ArrowRight"] ? 1 : 0) -
      (keys["KeyA"] || keys["ArrowLeft"] ? 1 : 0) +
      touch.move.x;
    if (touch.look.x) player.yaw -= touch.look.x * dt * 2.4;
    if (touch.look.y) player.pitch = clamp(player.pitch - touch.look.y * dt * 1.8, -1.35, 1.35);

    const sprint = keys["ShiftLeft"] || keys["ShiftRight"];
    const spd = player.inside ? player.speed * 0.62 : sprint ? player.runSpeed : player.speed;
    const target = new THREE.Vector3();
    target.addScaledVector(new THREE.Vector3(-Math.sin(player.yaw), 0, -Math.cos(player.yaw)), fwd);
    target.addScaledVector(
      new THREE.Vector3(Math.cos(player.yaw), 0, -Math.sin(player.yaw)),
      strafe,
    );
    if (target.lengthSq() > 0) target.normalize().multiplyScalar(spd);

    player.vel.x += (target.x - player.vel.x) * Math.min(1, dt * 11);
    player.vel.z += (target.z - player.vel.z) * Math.min(1, dt * 11);

    if (!player.inside) {
      player.pos.x = clamp(player.pos.x, -WORLD / 2 + 4, WORLD / 2 - 4);
      player.pos.z = clamp(player.pos.z, -WORLD / 2 + 4, WORLD / 2 - 4);
    }
    player.pos.x += player.vel.x * dt;
    player.pos.z += player.vel.z * dt;
    if (player.inside) {
      const h = player.inside;
      const dx = player.pos.x - h.b.x,
        dz = player.pos.z - h.b.z;
      const len = Math.hypot(dx, dz) || 1;
      const r = h.radius;
      if (len > r) {
        player.pos.x = h.b.x + (dx / len) * r;
        player.pos.z = h.b.z + (dz / len) * r;
      }
    }

    const gh = groundY(player.pos.x, player.pos.z);
    player.vy -= 20 * dt;
    player.pos.y += player.vy * dt;
    if (player.pos.y <= gh) {
      player.pos.y = gh;
      player.vy = 0;
      player.onGround = true;
    } else player.onGround = false;

    const moving = player.vel.lengthSq() > 1;
    bob += dt * (moving ? (sprint && !player.inside ? 13 : 9) : 0);

    playerAvatar.root.position.set(player.pos.x, player.pos.y, player.pos.z);
    if (moving) {
      const want = Math.atan2(player.vel.x, player.vel.z);
      let diff = want - player.heading;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      player.heading += diff * Math.min(1, dt * 9);
    }
    playerAvatar.root.rotation.y = player.heading;
    animateAvatar(playerAvatar, moving, sprint ? 1.35 : 1);
    playerAvatar.root.visible = player.camMode === "tps" && !player.inside;

    camera.rotation.order = "YXZ";
    camera.rotation.y = player.yaw;
    camera.rotation.x = player.pitch;

    if (player.camMode === "fps" || player.inside) {
      camera.position.set(
        player.pos.x,
        player.pos.y + player.height + Math.sin(bob) * (moving ? 0.055 : 0),
        player.pos.z,
      );
    } else {
      const dist = 5.4,
        side = 0.9,
        hgt = 2.1;
      const back = new THREE.Vector3(Math.sin(player.yaw), 0, Math.cos(player.yaw));
      const right = new THREE.Vector3(Math.cos(player.yaw), 0, -Math.sin(player.yaw));
      const focus = new THREE.Vector3(
        player.pos.x,
        player.pos.y + hgt + Math.sin(bob) * 0.05,
        player.pos.z,
      );
      const want = focus
        .clone()
        .addScaledVector(back, dist)
        .addScaledVector(right, side * 0.5);
      want.y = Math.max(want.y, groundY(want.x, want.z) + 0.9);
      want.y = Math.min(want.y, player.pos.y + 3.4);
      const occ = cameraBlockRay(player.pos, want);
      if (occ) want.copy(occ);
      if (camSnap) {
        camera.position.copy(want);
        camSnap = false;
      } else camera.position.lerp(want, Math.min(1, dt * 12));
      playerAvatar.root.visible =
        player.camMode === "tps" && !player.inside && camera.position.distanceTo(player.pos) > 1.7;
    }
  }

  function updateFollowCam(dt) {
    if (!following || following.inside) return;
    const t = following.root.position.clone().add(new THREE.Vector3(0, 1.7, 0));
    if (camera.position.distanceTo(t) > 9) camera.position.lerp(t, Math.min(1, dt * 3));
    const look = following.root.position.clone().sub(camera.position);
    const yaw = Math.atan2(-look.x, -look.z);
    const pitch = Math.atan2(look.y, Math.hypot(look.x, look.z));
    let dy = yaw - player.yaw;
    while (dy > Math.PI) dy -= Math.PI * 2;
    while (dy < -Math.PI) dy += Math.PI * 2;
    player.yaw += dy * Math.min(1, dt * 4);
    player.pitch += (pitch - player.pitch) * Math.min(1, dt * 4);
  }

  const ray = new THREE.Raycaster();
  ray.far = 70;
  let hovered = null;
  let lastHoverKey = "";

  function pickFromCenter() {
    ray.setFromCamera(new THREE.Vector2(0, 0), camera);
    ray.camera = camera;
    for (const h of ray.intersectObjects(interactables, true)) {
      const ud = h.object.userData;
      if (!ud) continue;
      if (ud.kind === "terrain" || ud.kind === "rock") return null;
      if (ud.kind === "interior" || ud.kind === "task") return null;
      if (ud.kind === "crew" || ud.kind === "build") return ud;
    }
    return null;
  }

  function interact() {
    if (player.inside) {
      // içeride: görev nişanı yoksa çıkış
      if (!taskTarget) exitInterior();
      return;
    }
    const h = nearDoor();
    if (h) {
      enterInterior(h);
      return;
    }
    if (!hovered) return;
    if (hovered.kind === "crew") {
      const a = astrons.find((x) => x.crew === hovered.ref);
      if (a) selectAstronaut(a);
    } else showInspectBuild(hovered.ref);
  }

  /** Sera bitkileri oyuncu içeride olmasa da büyür. */
  function updatePlanters(dt) {
    interiors.forEach((h) => {
      if (!h.planters.length) return;
      h.planters.forEach((p) => {
        if (p.stage !== "growing") return;
        p.water = Math.max(0, p.water - dt * 0.012);
        if (p.weeds.visible || p.water <= 0) return;
        p.growth = Math.min(1, p.growth + dt * 0.012 * (0.4 + p.water));
        const s = 0.35 + p.growth * 0.75;
        p.plant.scale.set(s, s, s);
        if (p.growth >= 1) {
          p.stage = "ripe";
          p.fruit.scale.setScalar(1.35);
          renderTaskList();
        }
      });
    });
  }

  /** İçeride fan animasyonu + görev ilerlemesi. */
  function updateTasks(dt) {
    const h = player.inside;

    if (h && h.interior.fans) {
      h.interior.fans.forEach((f, i) => {
        f.rotation.x += dt * (i ? -4 : 4);
      });
    }

    if (!taskTarget) {
      if (taskProgress > 0) {
        taskProgress = Math.max(0, taskProgress - dt * 2.2);
        renderTaskBar();
      }
      return;
    }

    if (taskHolding) {
      taskProgress += dt / (taskTarget.dur || 2.5);
      if (taskProgress >= 1) {
        taskProgress = 0;
        completeTask(taskTarget);
      }
    } else {
      taskProgress = Math.max(0, taskProgress - dt * 1.6);
    }
    renderTaskBar();
    // liste yalnızca durum değiştiğinde yenilenir
    taskListKey = h.planters.length
      ? h.planters.map((p) => p.stage + Math.round(p.growth * 10)).join()
      : `${h.b.hp.toFixed(0)}-${h.b.lvl}-${astrons.filter((a) => a.inside === h).length}`;
    if (taskListKey !== lastTaskListKey) {
      lastTaskListKey = taskListKey;
      renderTaskList();
    }
  }

  function renderTaskBar() {
    const fill = $("#tpFill");
    const text = $("#tpText");
    if (!fill || !text) return;
    fill.style.width = Math.round(taskProgress * 100) + "%";
    fill.classList.toggle("active", taskProgress > 0);
    text.textContent = taskTarget
      ? taskProgress > 0
        ? "Çalışıyor..."
        : taskTarget.hint || "E basılı tut"
      : "Bir görev istasyonuna nişan al";
  }

  function nearDoor() {
    let best = null,
      bd = 4.2;
    for (const h of interiors) {
      const d = Math.hypot(h.door.x - player.pos.x, h.door.z - player.pos.z);
      if (d < bd) {
        bd = d;
        best = h;
      }
    }
    return best;
  }

  /* ---------------- GÖREV SİSTEMİ ---------------- */
  let taskTarget = null;
  let taskProgress = 0;
  let taskHolding = false;
  let taskListKey = "";
  let lastTaskListKey = "";

  const PLOT_LABEL = {
    empty: "Ekim yapılabilir",
    growing: "Büyüyor",
    ripe: "Hasat edilebilir",
  };

  function plotLabelFor(p) {
    if (!p) return "";
    if (p.stage === "empty") return PLOT_LABEL.empty;
    if (p.stage === "ripe") return PLOT_LABEL.ripe;
    return `${PLOT_LABEL.growing} · %${Math.round(p.growth * 100)}`;
  }

  function gain(resKey, amount) {
    const r = colony.res[resKey];
    if (!r) return;
    r.v = clamp(r.v + amount, 0, r.cap);
  }

  function showTaskPanel(h) {
    const el = $("#taskpanel");
    if (!el) return;
    el.hidden = false;
    el.innerHTML = `
      <header>
        <b id="tpName">${h.b.n}</b>
        <button class="mini-btn" id="tpClose">✕</button>
      </header>
      <div class="tp-sub">${h.hint} · <kbd>Q</kbd> ile çık</div>
      <div class="tp-hintbar">
        <div class="tp-fill" id="tpFill"></div>
        <span class="tp-text" id="tpText">Bir görev istasyonuna nişan al</span>
      </div>
      <ul class="tp-list" id="tpList"></ul>`;
    const close = $("#tpClose");
    if (close) addEvt(close, "click", exitInterior);
    renderTaskList();
  }

  function hideTaskPanel() {
    const el = $("#taskpanel");
    if (el) el.hidden = true;
  }

  function renderTaskList() {
    const ul = $("#tpList");
    if (!ul || !player.inside) return;
    const h = player.inside;
    let items = "";
    if (h.type === "farm") {
      items = h.planters
        .map(
          (p, i) =>
            `<li><span>Yatak ${i + 1}</span><b class="${p.stage}">${plotLabelFor(p)}</b></li>`,
        )
        .join("");
    } else if (h.type === "habitat") {
      const sleepers = astrons.filter((a) => a.inside === h && a.state === "sleep").length;
      const workers = astrons.filter((a) => a.inside === h && a.state === "work").length;
      items = `<li><span>Uyuyan</span><b>${sleepers}</b></li>
               <li><span>Çalışan</span><b>${workers}</b></li>
               <li><span>Bütünlük</span><b>%${h.b.hp.toFixed(0)}</b></li>`;
    } else {
      items = `<li><span>Bütünlük</span><b>%${h.b.hp.toFixed(0)}</b></li>
               <li><span>Seviye</span><b>Sv ${h.b.lvl}</b></li>`;
    }
    ul.innerHTML = items;
  }

  /** İçeride crosshair ile görev hedefi arar. */
  function pickTask() {
    if (!player.inside) return null;
    const list = player.inside.stations;
    if (!list || !list.length) return null;
    ray.setFromCamera(new THREE.Vector2(0, 0), camera);
    const hits = ray.intersectObjects(list, true);
    for (const h of hits) {
      let o = h.object;
      while (o && !o.userData.task) o = o.parent;
      if (o?.userData.task) return o.userData.task;
    }
    return null;
  }
  function completeTask(task) {
    const h = player.inside;
    if (!h) return;
    const b = h.b;
    switch (task.effect) {
      case "plot": {
        const p = h.planters[task.planter];
        if (!p) return;
        if (p.stage === "empty") {
          p.stage = "growing";
          p.growth = 0.04;
          p.water = Math.max(p.water, 0.75);
          p.plant.visible = true;
          p.weeds.visible = true;
          toast(`Yatak ${p.index + 1}: tohum eklendi · otlar çıktı — <b>çapala</b>`, "ok");
        } else if (p.weeds.visible) {
          p.weeds.visible = false;
          toast(`Yatak ${p.index + 1}: otlar çapalandı`, "ok");
        } else if (p.stage === "growing") {
          if (p.water < 0.5) {
            p.water = 1;
            toast(`Yatak ${p.index + 1}: sulandı 💧`, "ok");
          } else {
            p.growth = Math.min(1, p.growth + 0.3);
            if (p.growth >= 1) {
              p.stage = "ripe";
              toast(`Yatak ${p.index + 1}: mahsul olgunlaştı — <b>hasat</b> edebilirsin`, "ok");
            } else toast(`Yatak ${p.index + 1}: büyüme hızlandı`, "ok");
          }
        } else {
          p.stage = "empty";
          p.growth = 0;
          p.harvested = (p.harvested || 0) + 42;
          p.plant.visible = false;
          p.weeds.visible = false;
          toast(`Yatak ${p.index + 1}: <b>hasat</b> edildi · +42 ürün (kasaya)`, "ok");
        }
        break;
      }
      case "water_tank":
        gain("su", 220);
        h.planters.forEach((p) => (p.water = 1));
        toast("Su tankı doldu · +220 L", "ok");
        break;
      case "harvest_bin": {
        const total = h.planters.reduce((s, p) => s + (p.harvested || 0), 0);
        if (total <= 0) {
          toast("Önce olgunlaşmış bitkileri hasat et", "warn");
          return;
        }
        h.planters.forEach((p) => (p.harvested = 0));
        gain("besin", Math.round(total * 0.4));
        toast(`Hasat koloni deposuna sevk edildi · +${Math.round(total * 0.4)} besin`, "ok");
        break;
      }
      case "seed_box":
        h.planters.forEach((p) => {
          if (p.stage !== "growing") return;
          p.growth = clamp(p.growth + 0.1, 0, 1);
          if (p.growth >= 1) p.stage = "ripe";
        });
        toast("Tohumlar ıslatıldı · büyüme hızlandı", "ok");
        break;
      case "ore":
        if (task.seam) task.seam.scale.multiplyScalar(0.75);
        gain("parça", 14);
        b.hp = clamp(b.hp - 1.5, 10, 100);
        toast("Cevher çıkarıldı · +14 parça", "ok");
        break;
      case "cart":
        gain("parça", 8);
        toast("Vagon yüzeye kalktı · +8 parça", "ok");
        break;
      case "sample":
        b.hp = clamp(b.hp + 1, 0, 100);
        toast("Biyokültür numunesi alındı", "ok");
        break;
      case "analyze":
        gain("enerji", 6);
        toast("Analiz tamamlandı · +6 enerji", "ok");
        break;
      case "centrifuge":
        gain("oksijen", 1.5);
        toast("Santrifüj çalıştı · +1.5 oksijen", "ok");
        break;
      case "inverter":
        b.hp = clamp(b.hp + 6, 0, 100);
        gain("enerji", 18);
        toast("İnvertör kalibre edildi · +18 enerji", "ok");
        break;
      case "battery":
        gain("enerji", 10);
        toast("Bataryalar şarj edildi · +10 enerji", "ok");
        break;
      case "fuel":
        b.hp = clamp(b.hp + 4, 0, 100);
        toast("Yakıt tankları dolduruldu", "ok");
        break;
      case "launch":
        b.lvl = Math.min(9, b.lvl + 1);
        toast(`<b>Fırlatma sırası hazır!</b> Fırlatma Kullesi → Sv ${b.lvl}`, "ok");
        break;
      case "repair":
      default:
        b.hp = clamp(b.hp + 8, 0, 100);
        toast(`Bakım tamamlandı · ${b.n} bütünlüğü %${b.hp.toFixed(0)}`, "ok");
        break;
    }
    renderTaskList();
  }

  function updateHover() {
    const hit = player.inside ? null : pickFromCenter();
    hovered = hit;
    const h = player.inside ? null : nearDoor();
    taskTarget = player.inside ? pickTask() : null;
    const key =
      (hit ? hit.kind + (hit.ref.name ?? hit.ref.n ?? "") : "") +
      (h ? "D" : "") +
      (player.inside ? "I" + (taskTarget ? taskTarget.id : "") : "");
    if (key === lastHoverKey) return;
    lastHoverKey = key;

    const crosshair = $("#crosshair");
    if (crosshair) crosshair.classList.toggle("active", !!hit || !!h || !!taskTarget);

    const hint = $("#hint");
    if (hint) {
      hint.innerHTML = player.inside
        ? taskTarget
          ? `<b>${taskTarget.label}</b> — <b>E</b> basılı tut · ${taskTarget.hint || ""} · <kbd>Q</kbd> çıkış`
          : `<b>${player.inside.b.n}</b> içindesin · <kbd>WASD</kbd> dolaş · görev istasyonuna nişan al · <kbd>Q</kbd> çıkış`
        : h
          ? `<b>${h.b.n}</b> kapısı — <kbd>E</kbd> ile içeri gir (${h.hint})`
          : hit
            ? hit.kind === "crew"
              ? `<b>${hit.ref.name}</b> · ${hit.ref.role} — etkileşim için <kbd>E</kbd>`
              : `<b>${hit.ref.n}</b> · ${BUILD_DEFS[hit.ref.t].name} — <kbd>E</kbd> ile incele`
            : "Yürü: <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> · Koş: <kbd>Shift</kbd> · Kamera: <kbd>V</kbd> · Etkileşim: <kbd>E</kbd>";
    }
  }

  function toast(html, type = "") {
    const toasts = $("#toasts");
    if (!toasts) return;
    const el = document.createElement("div");
    el.className = "toast " + type;
    el.innerHTML = html;
    toasts.prepend(el);
    setTimeout(() => el.remove(), 4600);
  }

  function renderRoster() {
    if (!$("#rosterCount")) return;
    $("#rosterCount").textContent = colony.crew.length;
    const inH = astrons.filter((a) => a.inside).length;
    $("#rosterSub").textContent = `${inH} içeride · ${astrons.length - inH} dışarıda`;
    $("#rosterList").innerHTML = colony.crew
      .map(
        (p, i) => `
      <div class="pitem ${selected === astrons[i] ? "sel" : ""}" data-id="${i}">
        <div class="av" style="background:${p.bg}">${p.initials}</div>
        <div class="pi"><b>${p.name}</b><small>${p.role} · ${astrons[i].statusText}</small></div>
        <div class="dot ${p.status}"></div>
      </div>`,
      )
      .join("");
    $$(".pitem").forEach((el) =>
      addEvt(el, "click", () => selectAstronaut(astrons[+el.dataset.id])),
    );
  }

  function selectAstronaut(a) {
    selected = a;
    following = null;
    renderRoster();
    renderInspect();
    toast(
      `<b>${a.crew.name}</b> seçildi — ${a.crew.role}, ${Math.round(a.root.position.distanceTo(player.pos))} m`,
      "ok",
    );
  }

  function showInspectBuild(b) {
    $("#inspect").hidden = false;
    $("#insName").textContent = b.n;
    $("#insRole").textContent = BUILD_DEFS[b.t].name;
    const barColor = b.hp > 60 ? "var(--green)" : b.hp > 35 ? "var(--gold)" : "var(--red)";
    const hab = interiors.find((h) => h.b === b);
    const sleepers = hab ? astrons.filter((a) => a.inside === hab && a.state === "sleep") : [];
    const workers = hab ? astrons.filter((a) => a.inside === hab && a.state === "work") : [];
    const farmPlots = hab?.planters?.length
      ? `<div class="ins-row"><span>Ekim</span><b>${
          hab.planters.filter((p) => p.stage === "ripe").length
        } olgun / ${hab.planters.length} yatak</b></div>`
      : "";
    $("#insRows").innerHTML = `
      <div class="ins-row"><span>Durum</span><b>${b.hp > 60 ? "Çalışıyor" : b.hp > 35 ? "Bakım gerekli" : "Arızalı"}</b></div>
      <div class="ins-bar"><i style="width:${b.hp}%;background:${barColor}"></i></div>
      <div class="ins-row"><span>Bütünlük</span><b>%${b.hp.toFixed(0)}</b></div>
      ${hab ? `<div class="ins-row"><span>İçeride</span><b>${sleepers.length} uyuyan · ${workers.length} çalışan</b></div>` : ""}
      ${farmPlots}
      <div class="ins-row"><span>Seviye</span><b>Sv ${b.lvl}</b></div>
      <div class="ins-row"><span>Uzaklık</span><b>${Math.round(Math.hypot(b.x - player.pos.x, b.z - player.pos.z))} m</b></div>`;
    $("#insActions").innerHTML =
      (hab ? `<button class="act" data-enter="1">İçeri gir · ${hab.hint}</button>` : "") +
      '<button class="act" data-goto="1">Bu yapıya git</button>';
    if (hab) {
      const enterBtn = $("#insActions [data-enter]");
      if (enterBtn) addEvt(enterBtn, "click", () => enterInterior(hab));
    }
    const gotoBtn = $("#insActions [data-goto]");
    if (gotoBtn)
      addEvt(gotoBtn, "click", () => {
        teleportNear(b.x, b.z);
        toast(`<b>${b.n}</b> yakınına inildi`, "ok");
      });
  }

  function renderInspect() {
    const inspectEl = $("#inspect");
    if (!inspectEl) return;
    if (!selected) {
      inspectEl.hidden = true;
      return;
    }
    const a = selected,
      p = a.crew;
    inspectEl.hidden = false;
    $("#insName").textContent = p.name;
    $("#insRole").textContent = p.role;
    const barColor = p.hp > 75 ? "var(--green)" : p.hp > 45 ? "var(--gold)" : "var(--red)";
    $("#insRows").innerHTML = `
      <div class="ins-row"><span>Görev</span><b>${a.statusText}</b></div>
      <div class="ins-row"><span>Konum</span><b>${a.inside ? a.inside.b.n : "Yüzey"}</b></div>
      <div class="ins-row"><span>Sağlık</span><b>%${p.hp.toFixed(0)}</b></div>
      <div class="ins-bar"><i style="width:${p.hp}%;background:${barColor}"></i></div>
      <div class="ins-row"><span>Uzaklık</span><b>${Math.round(a.root.position.distanceTo(player.pos))} m</b></div>`;
    $("#insActions").innerHTML = `
      ${
        a.inside
          ? `<button class="act" data-act="wake">Uyandır &amp; dışarı çıkar</button>
           <button class="act" data-act="towork">Çalıştır</button>`
          : `<button class="act ${following === a ? "on" : ""}" data-act="follow">${following === a ? "Takipte" : "Takip et"}</button>
           <button class="act" data-act="sleep">Uyumaya gönder</button>`
      }
      <button class="act" data-act="inspect">Yapıya gönder</button>
      <button class="act" data-act="rest">Dinlen</button>`;
    $$("#insActions .act").forEach((btn) =>
      addEvt(btn, "click", () => {
        const act = btn.dataset.act;
        if (act === "follow") toggleFollow();
        if (act === "wake") {
          sendOutside(a);
          toast(`<b>${p.name}</b> uyandırıldı ve dışarı çıkarıldı`, "ok");
        }
        if (act === "sleep") {
          goToBed(a);
          toast(`<b>${p.name}</b> yatağına çekildi`, "ok");
        }
        if (act === "towork") {
          goToWork(a);
          toast(`<b>${p.name}</b> çalışma istasyonuna oturdu`, "ok");
        }
        if (act === "inspect") {
          if (a.inside) sendOutside(a);
          const b = buildMeshes[irnd(0, buildMeshes.length - 1)];
          a.state = "inspect";
          a.waitFor = 0;
          a.inspectTarget = new THREE.Vector3(
            b.position.x + rnd(-10, 10),
            0,
            b.position.z + rnd(-10, 10),
          );
          a.statusText = STATE_TEXT.inspect;
          toast(`<b>${p.name}</b> → ${b.userData.ref.n} incelemesine gönderildi`, "ok");
        }
        if (act === "rest") {
          if (a.inside) sendOutside(a);
          a.state = "rest";
          a.statusText = STATE_TEXT.rest;
          toast(`<b>${p.name}</b> dinlenmeye gönderildi`, "ok");
        }
        renderInspect();
        renderRoster();
      }),
    );
  }

  function toggleFollow() {
    if (!selected) return;
    following = following ? null : selected;
    if (following) {
      following.state = "follow";
      following.waitFor = 0;
      following.statusText = STATE_TEXT.follow;
      toast(`<b>${following.crew.name}</b> seni takip ediyor`, "ok");
    } else toast("Takip modu kapatıldı");
    renderInspect();
    renderRoster();
  }

  function teleportNear(x, z) {
    const ang = rnd(0, Math.PI * 2);
    player.pos.x = clamp(x + Math.cos(ang) * 10, -WORLD / 2 + 4, WORLD / 2 - 4);
    player.pos.z = clamp(z + Math.sin(ang) * 10, -WORLD / 2 + 4, WORLD / 2 - 4);
    player.pos.y = terrainHeight(player.pos.x, player.pos.z);
    toast("Konumlandırıldı", "ok");
  }

  function sendCommand() {
    const a = astrons[+$("#cmdTarget").value];
    const act = $("#cmdAction").value;
    a.waitFor = 0;
    if (act === "follow") {
      if (a.inside) sendOutside(a);
      a.state = "follow";
      a.statusText = STATE_TEXT.follow;
      selected = a;
      following = null;
      toast(`<b>${a.crew.name}</b> takibe geçti`, "ok");
    } else if (act === "inspect") {
      if (a.inside) sendOutside(a);
      const b = buildMeshes[irnd(0, buildMeshes.length - 1)];
      a.state = "inspect";
      a.inspectTarget = new THREE.Vector3(b.position.x + rnd(-9, 9), 0, b.position.z + rnd(-9, 9));
      a.statusText = STATE_TEXT.inspect;
      toast(`<b>${a.crew.name}</b> → ${b.userData.ref.n}`, "ok");
    } else if (act === "sleep") {
      goToBed(a);
      toast(`<b>${a.crew.name}</b> ${a.habitat.b.n} içindeki yatağına çekildi`, "ok");
    } else if (act === "work") {
      goToWork(a);
      toast(`<b>${a.crew.name}</b> ${a.habitat.b.n} içinde çalışmaya başladı`, "ok");
    } else if (act === "job") {
      const jobs = interiors.filter((e) => e.type !== "habitat" && e.stations.length);
      const target = jobs[irnd(0, jobs.length - 1)];
      goToJob(a, target);
      toast(`<b>${a.crew.name}</b> → ${target.b.n} görev istasyonu`, "ok");
    } else if (act === "enter") {
      if (a.inside) {
        toast(`<b>${a.crew.name}</b> zaten ${a.inside.b.n} içinde`);
      } else {
        const target = interiors[irnd(0, interiors.length - 1)];
        teleportNear(target.door.x, target.door.z);
        a.state = "inspect";
        a.waitFor = 0;
        a.inspectTarget = new THREE.Vector3(target.door.x, 0, target.door.z);
        a.statusText = STATE_TEXT.inspect;
        toast(`<b>${a.crew.name}</b> → ${target.b.n} kapısına gönderildi`, "ok");
      }
    } else if (act === "outside") {
      if (a.inside) {
        sendOutside(a);
        toast(`<b>${a.crew.name}</b> uyandırıldı ve dışarı çıkarıldı`, "ok");
      } else toast(`<b>${a.crew.name}</b> zaten dışarıda`);
    } else if (act === "rest") {
      if (a.inside) sendOutside(a);
      a.state = "rest";
      a.statusText = STATE_TEXT.rest;
      toast(`<b>${a.crew.name}</b> dinlenmeye gitti`, "ok");
    } else {
      if (a.inside) sendOutside(a);
      a.state = "patrol";
      a.target = null;
      a.statusText = STATE_TEXT.patrol;
      toast(`<b>${a.crew.name}</b> devriye gezmeye başladı`, "ok");
    }
    renderRoster();
    if (selected === a) renderInspect();
  }

  const cmdTarget = $("#cmdTarget");
  if (cmdTarget)
    cmdTarget.innerHTML = colony.crew
      .map((p, i) => `<option value="${i}">${p.name}</option>`)
      .join("");
  const cmdSend = $("#cmdSend");
  if (cmdSend) addEvt(cmdSend, "click", sendCommand);
  const camModeBtn = $("#camMode");
  if (camModeBtn) addEvt(camModeBtn, "click", toggleCam);
  const tbtnCam = $("#tbtnCam");
  if (tbtnCam)
    addEvt(tbtnCam, "click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleCam();
    });
  const rosterToggle = $("#rosterToggle");
  if (rosterToggle) addEvt(rosterToggle, "click", () => $("#roster").classList.toggle("collapsed"));
  const insClose = $("#insClose");
  if (insClose)
    addEvt(insClose, "click", () => {
      selected = null;
      following = null;
      renderRoster();
      renderInspect();
    });

  const mm = $("#minimap");
  const mctx = mm ? mm.getContext("2d") : null;
  const MM_RANGE = 95;

  function drawMinimap() {
    if (!mctx) return;
    const w = mm.width,
      h = mm.height,
      cx = w / 2,
      cy = h / 2;
    const k = w / 2 / MM_RANGE;
    mctx.fillStyle = "#1d0f0b";
    mctx.fillRect(0, 0, w, h);
    // Removed 1600 random terrain samples per frame for performance.

    mctx.strokeStyle = "rgba(255,255,255,.05)";
    for (let i = 1; i < 4; i++) {
      mctx.beginPath();
      mctx.moveTo((w * i) / 4, 0);
      mctx.lineTo((w * i) / 4, h);
      mctx.stroke();
      mctx.beginPath();
      mctx.moveTo(0, (h * i) / 4);
      mctx.lineTo(w, (h * i) / 4);
      mctx.stroke();
    }

    const toMM = (x, z) => [cx + (x - player.pos.x) * k, cy + (z - player.pos.z) * k];

    buildMeshes.forEach((b) => {
      const [bx, by] = toMM(b.position.x, b.position.z);
      mctx.fillStyle = COLOR[b.userData.ref.k];
      mctx.globalAlpha = hovered?.ref === b.userData.ref ? 1 : 0.8;
      mctx.beginPath();
      mctx.arc(bx, by, 5, 0, Math.PI * 2);
      mctx.fill();
      mctx.globalAlpha = 1;
    });

    astrons.forEach((a) => {
      const [ax, ay] = toMM(a.root.position.x, a.root.position.z);
      const isSel = selected === a;
      mctx.fillStyle = isSel ? "#fff" : a.crew.bg;
      mctx.globalAlpha = a.inside ? 0.4 : 1;
      mctx.beginPath();
      mctx.arc(ax, ay, isSel ? 4.5 : 3, 0, Math.PI * 2);
      mctx.fill();
      mctx.globalAlpha = 1;
      if (a.inside) {
        mctx.strokeStyle = "rgba(255,255,255,.35)";
        mctx.lineWidth = 1;
        mctx.stroke();
      }
      if (isSel) {
        mctx.strokeStyle = "#e2703a";
        mctx.lineWidth = 1.5;
        mctx.beginPath();
        mctx.arc(ax, ay, 7.5, 0, Math.PI * 2);
        mctx.stroke();
      }
    });

    mctx.save();
    mctx.translate(cx, cy);
    mctx.rotate(-player.yaw + Math.PI);
    mctx.fillStyle = "#fff";
    mctx.beginPath();
    mctx.moveTo(0, -8);
    mctx.lineTo(6, 6);
    mctx.lineTo(0, 3);
    mctx.lineTo(-6, 6);
    mctx.closePath();
    mctx.fill();
    mctx.restore();
  }

  const clock = new THREE.Clock();
  let mmT = 0,
    hudT = 0,
    rosterT = 0;
  let reqId = null;

  function tick() {
    reqId = requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    updatePlayer(dt);
    updateFollowCam(dt);
    updateCrew(dt);
    updateHover();
    updateTasks(dt);
    updatePlanters(dt);

    dust.rotation.y = t * 0.006;
    dust.position.x = Math.sin(t * 0.15) * 6;

    const sa = t * 0.012;
    sun.position.set(Math.cos(sa) * 95, 72 + Math.sin(sa * 0.7) * 14, Math.sin(sa) * 95);
    sun.target.position.copy(camera.position);

    mmT += dt;
    if (mmT > 0.12) {
      mmT = 0;
      drawMinimap();
    }

    hudT += dt;
    if (hudT > 0.5) {
      hudT = 0;
      const seasons = ["İlkbahar", "Yaz", "Sonbahar", "Kış"];
      if ($("#solNum")) $("#solNum").textContent = colony.sol;
      if ($("#season"))
        $("#season").textContent =
          `${seasons[Math.floor(colony.sol / 68) % 4]} · Ls ${colony.sol % 360}°`;
      if ($("#o2")) $("#o2").textContent = colony.res.oksijen.v.toFixed(0) + "%";
      if ($("#o2bar i")) $("#o2bar i").style.width = colony.res.oksijen.v + "%";
      if ($("#su")) $("#su").textContent = fmt(colony.res.su.v) + " L";
      if ($("#pwr")) $("#pwr").textContent = fmt(colony.res.enerji.v) + " kWh";
      if ($("#weather b"))
        $("#weather b").textContent = `${(-63 - Math.sin(colony.sol / 18) * 12).toFixed(0)}°C`;
      if (selected) renderInspect();
    }

    rosterT += dt;
    if (rosterT > 0.7) {
      rosterT = 0;
      renderRoster();
    }

    renderer.render(scene, camera);
  }

  function fitCamera() {
    const aspect = innerWidth / innerHeight;
    camera.aspect = aspect;
    camera.fov =
      aspect < 1
        ? clamp(
            (2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(74) / 2) / aspect) * 180) / Math.PI,
            60,
            96,
          )
        : 72;
    camera.updateProjectionMatrix();
  }
  fitCamera();

  const onResize = () => {
    fitCamera();
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  };
  addEvt(window, "resize", onResize);

  const camIntersectables = buildMeshes;
  const interactables = [...buildMeshes];
  astrons.forEach((a) => interactables.push(a.root));

  renderRoster();
  drawMinimap();
  tick();

  const loader = $("#loader");
  if (loader) setTimeout(() => loader.classList.add("hide"), 400);

  toast(
    "<b>Ares Vallis</b> — Her binanın kapısı var: yaklaş ve <b>E</b> ile içeri gir. İçeride görev istasyonlarına nişan alıp <b>E</b> basılı tut (farmda ekim yap, çapala, hasat et). <b>V</b> kamera, <b>Q</b> çıkış.",
    "ok",
  );

  return () => {
    if (reqId) cancelAnimationFrame(reqId);
    listeners.forEach(({ target, event, handler }) => {
      target.removeEventListener(event, handler);
    });
    renderer.dispose();
    if (sceneEl) sceneEl.innerHTML = "";
  };
}
