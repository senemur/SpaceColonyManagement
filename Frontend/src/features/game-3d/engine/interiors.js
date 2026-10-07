import * as THREE from "three";

/* =========================================================
   ARES — bina iç mekânları
   Her bina tipi için oda + görev istasyonları üretir.
   Dönen: { group, radius, doorLocal, floorY, slots, stations, ... }
   ========================================================= */

let M = null;
function mats() {
  if (M) return M;
  M = {
    wall: new THREE.MeshStandardMaterial({
      color: 0xd7d2c8,
      roughness: 0.85,
      side: THREE.DoubleSide,
    }),
    rockWall: new THREE.MeshStandardMaterial({
      color: 0x7a4a33,
      roughness: 1,
      flatShading: true,
      side: THREE.DoubleSide,
    }),
    deck: new THREE.MeshStandardMaterial({ color: 0x9aa0a6, roughness: 0.7, metalness: 0.25 }),
    soil: new THREE.MeshStandardMaterial({ color: 0x4a3226, roughness: 1 }),
    metal: new THREE.MeshStandardMaterial({ color: 0xb8bdc4, roughness: 0.42, metalness: 0.72 }),
    metalD: new THREE.MeshStandardMaterial({ color: 0x6e747c, roughness: 0.55, metalness: 0.6 }),
    white: new THREE.MeshStandardMaterial({ color: 0xe8e4dc, roughness: 0.6, metalness: 0.15 }),
    orange: new THREE.MeshStandardMaterial({
      color: 0xe2703a,
      roughness: 0.55,
      metalness: 0.3,
      emissive: 0x5c2408,
      emissiveIntensity: 0.4,
    }),
    dark: new THREE.MeshStandardMaterial({ color: 0x33383d, roughness: 0.6, metalness: 0.4 }),
    cloth: new THREE.MeshStandardMaterial({ color: 0x4a6fa5, roughness: 0.95 }),
    pillow: new THREE.MeshStandardMaterial({ color: 0xf1ece2, roughness: 0.95 }),
    lamp: new THREE.MeshStandardMaterial({
      color: 0xfff2d0,
      emissive: 0xffd9a0,
      emissiveIntensity: 1.7,
      roughness: 1,
    }),
    screen: new THREE.MeshStandardMaterial({
      color: 0x0d1b2a,
      emissive: 0x2a6f9e,
      emissiveIntensity: 1.1,
      roughness: 0.3,
    }),
    glass: new THREE.MeshStandardMaterial({
      color: 0x8fd6ff,
      roughness: 0.08,
      metalness: 0.1,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    }),
    water: new THREE.MeshStandardMaterial({
      color: 0x2f8fbf,
      roughness: 0.05,
      transparent: true,
      opacity: 0.55,
      emissive: 0x0d3448,
      emissiveIntensity: 0.4,
    }),
    leaf: new THREE.MeshStandardMaterial({ color: 0x4f9a3a, roughness: 0.85 }),
    leafDry: new THREE.MeshStandardMaterial({ color: 0x9aa03a, roughness: 0.9 }),
    ore: new THREE.MeshStandardMaterial({
      color: 0xffcf6b,
      roughness: 0.3,
      metalness: 0.8,
      emissive: 0x6b4a00,
      emissiveIntensity: 0.7,
    }),
    crop: new THREE.MeshStandardMaterial({
      color: 0x86e06a,
      roughness: 0.6,
      emissive: 0x1e3d12,
      emissiveIntensity: 0.5,
    }),
    rock: new THREE.MeshStandardMaterial({ color: 0x6b4030, roughness: 1, flatShading: true }),
  };
  return M;
}

const rnd2 = (a, b) => a + Math.random() * (b - a);

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
function lampStrip(g, w, y, z) {
  g.add(box(w, 0.12, 0.5, mats().lamp, 0, y, z));
  const l = new THREE.PointLight(0xffd9a8, 30, 16, 2);
  l.position.set(0, y - 0.4, z);
  g.add(l);
}

/** Ters kutu yöntemiyle oda (içerisi rahat görülür). */
function room(w, h, d, wallMat = null, floorMat = null) {
  const mt = mats();
  const g = new THREE.Group();
  // Use BackSide so the walls are visible from inside
  const wallM = wallMat
    ? wallMat.clone()
    : mt.wall.clone();
  wallM.side = THREE.BackSide;
  const shell = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallM);
  shell.position.y = h / 2;
  shell.receiveShadow = true;
  g.add(shell);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.2, d - 0.2), floorMat || mt.deck);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  g.add(floor);
  return g;
}

/** Görev istasyonu: crosshair ile nişan alınabilir hedef. */
function station(parent, mesh, task) {
  mesh.userData = { kind: "task", task };
  parent.add(mesh);
  return mesh;
}

function label(text, x, y, z, w = 1.4) {
  const cvs = document.createElement("canvas");
  cvs.width = 256;
  cvs.height = 64;
  const ctx = cvs.getContext("2d");
  ctx.fillStyle = "rgba(14,20,26,.82)";
  ctx.beginPath();
  ctx.roundRect(2, 10, 252, 44, 10);
  ctx.fill();
  ctx.strokeStyle = "#5bc8ff";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#eaf6ff";
  ctx.font = "600 22px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 128, 32);
  const tex = new THREE.CanvasTexture(cvs);
  const sp = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }),
  );
  sp.position.set(x, y, z);
  sp.scale.set(w, w * 0.25, 1);
  sp.renderOrder = 5;
  return sp;
}
/* ---------------------------------------------------------------- */
/* 1) HABİTAT — yataklar, çalışma masaları, bakım konsolu            */
/* ---------------------------------------------------------------- */
function habitatInterior() {
  const mt = mats();
  const g = new THREE.Group();
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(4.05, 22, 14, 0, Math.PI * 2, 0, Math.PI / 2),
    mt.wall,
  );
  shell.receiveShadow = true;
  g.add(shell);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(4.0, 26), mt.deck);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  g.add(floor);
  for (let i = -3; i <= 3; i++) g.add(box(0.12, 0.02, 7.6, mt.metalD, i * 1.1, 0.02, 0));
  const ringFloor = new THREE.Mesh(new THREE.RingGeometry(3.72, 3.95, 26), mt.orange);
  ringFloor.rotation.x = -Math.PI / 2;
  ringFloor.position.y = 0.03;
  g.add(ringFloor);

  g.add(box(1.6, 0.12, 0.5, mt.lamp, 0, 3.55, -1.4));
  g.add(box(1.6, 0.12, 0.5, mt.lamp, 0, 3.55, 1.4));
  const amb = new THREE.PointLight(0xffd9a8, 26, 9, 2);
  amb.position.set(0, 3.0, 0);
  g.add(amb);
  g.add(box(3.4, 0.1, 0.1, mt.metal, 0, 3.62, 0));

  const bedSlots = [];
  for (let s = 0; s < 2; s++)
    for (let i = 0; i < 2; i++) {
      const x = (i ? 1 : -1) * 3.0;
      const z = -2.3 + i * 2.4 + s * 0.1;
      const yaw = x > 0 ? -Math.PI / 2 : Math.PI / 2;
      const bed = new THREE.Group();
      bed.position.set(x, 0, z);
      bed.rotation.y = yaw;
      bed.add(box(0.98, 0.4, 2.1, mt.metalD, 0, 0.2, 0));
      bed.add(box(0.92, 0.18, 2.0, mt.cloth, 0, 0.48, 0));
      bed.add(box(0.82, 0.16, 0.44, mt.pillow, 0, 0.54, -0.74));
      bed.add(box(0.94, 0.72, 0.1, mt.metalD, 0, 0.5, -1.02));
      bed.add(box(0.08, 1.5, 0.08, mt.metal, 0.46, 0.85, -0.98));
      bed.add(box(0.14, 0.18, 0.14, mt.lamp, 0.46, 1.62, -0.98));
      g.add(bed);
      bedSlots.push({ p: new THREE.Vector3(x + (x > 0 ? -0.2 : 0.2), 0.62, z + 0.06), yaw });
    }
  g.add(box(0.9, 0.1, 4.6, mt.metalD, 3.0, 1.85, 0.1));
  g.add(box(0.9, 0.1, 4.6, mt.metalD, -3.0, 1.85, 0.1));

  const workSlots = [];
  for (let i = 0; i < 2; i++) {
    const x = -1.5 + i * 3.0;
    const desk = new THREE.Group();
    desk.position.set(x, 0, 2.55);
    desk.add(box(2.2, 0.12, 0.8, mt.white, 0, 0.95, 0));
    desk.add(box(0.1, 0.95, 0.1, mt.metal, -1.0, 0.47, 0));
    desk.add(box(0.1, 0.95, 0.1, mt.metal, 1.0, 0.47, 0));
    const s1 = box(0.9, 0.55, 0.06, mt.screen, -0.5, 1.32, -0.28);
    s1.rotation.x = 0.18;
    desk.add(s1);
    const s2 = box(0.9, 0.55, 0.06, mt.screen, 0.5, 1.32, -0.28);
    s2.rotation.x = 0.18;
    desk.add(s2);
    desk.add(box(0.5, 0.05, 0.2, mt.metalD, 0, 1.03, 0.1));
    const chair = new THREE.Group();
    chair.position.set(0, 0, 0.85);
    chair.add(cyl(0.34, 0.36, 0.12, mt.dark, 10).translateY(0.5));
    chair.add(box(0.5, 0.55, 0.1, mt.dark, 0, 0.85, 0.28));
    chair.add(cyl(0.08, 0.1, 0.5, mt.metal, 8).translateY(0.25));
    desk.add(chair);
    g.add(desk);
    workSlots.push(new THREE.Vector3(x, 0, 3.4));
  }

  const doorFrame = new THREE.Group();
  doorFrame.position.set(0, 0, -3.6);
  doorFrame.add(box(1.9, 2.3, 0.16, mt.metalD, 0, 1.15, 0));
  doorFrame.add(box(1.55, 2.0, 0.1, mt.orange, 0, 1.05, 0.1));
  doorFrame.add(box(0.3, 0.06, 0.06, mt.lamp, 0, 2.2, 0.14));
  g.add(doorFrame);
  g.add(
    cyl(0.14, 0.14, 6, mt.metal, 8)
      .rotateZ(Math.PI / 2)
      .translateY(3.1),
  );
  for (const x of [-2.2, 2.2]) {
    g.add(cyl(0.32, 0.26, 0.4, mt.white, 8).translateY(0.2).translateX(x).translateZ(2.6));
    const pl = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.8, 6), mt.leaf);
    pl.position.set(x, 0.75, 2.6);
    g.add(pl);
  }

  const maint = new THREE.Group();
  maint.position.set(0, 0, -0.3);
  maint.add(box(1.6, 1.0, 0.6, mt.white, 0, 0.5, 0));
  maint.add(box(1.4, 0.7, 0.1, mt.screen, 0, 1.15, -0.2));
  maint.add(box(1.7, 0.12, 0.7, mt.metal, 0, 1.02, 0.05));
  maint.add(label("BAKIM", 0, 2.0, 0, 1.5));
  station(g, maint, {
    id: "repair",
    label: "Yaşam desteği bakımı",
    hint: "Basınç ve ısıtma sistemini tara",
    dur: 3.2,
    effect: "repair",
  });

  g.add(cyl(4.06, 4.06, 0.6, mt.deck, 26).translateY(-0.3));

  return {
    type: "habitat",
    group: g,
    radius: 3.4,
    doorLocal: new THREE.Vector3(0, 0, -5.1),
    floorY: 0.42,
    slots: { bed: bedSlots, work: workSlots, door: new THREE.Vector3(0, 0, -3.9) },
    stations: [maint],
  };
}

/* ---------------------------------------------------------------- */
/* 2) FARM — büyük sera: 3x6 ekim yatağı, çapala / sula / hasat et   */
/* ---------------------------------------------------------------- */
function farmInterior() {
  const mt = mats();
  const W = 20,
    H = 8,
    D = 14;
  const g = room(W, H, D, mt.wall);

  for (let i = -2; i <= 2; i++) g.add(box(0.22, 0.22, D - 0.4, mt.metal, i * (W / 5), H - 0.35, 0));
  g.add(box(W - 0.5, 0.2, 0.2, mt.metal, 0, H - 0.6, 0));
  for (const z of [-4, 0, 4]) {
    g.add(box(W - 0.6, 0.18, 0.18, mt.metal, 0, H - 0.95, z));
    lampStrip(g, 5, H - 1.25, z);
  }

  // havalandırma fanları (animasyon için saklanır)
  const fans = [];
  for (const x of [-7.6, 7.6]) {
    const fan = new THREE.Group();
    fan.position.set(x, H - 1.6, 0);
    const ring = cyl(0.75, 0.75, 0.3, mt.metalD, 12);
    ring.rotation.z = Math.PI / 2;
    fan.add(ring);
    const blades = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const bl = box(1.3, 0.5, 0.06, mt.metal, 0, 0, 0);
      bl.position.x = Math.cos((i / 4) * Math.PI * 2) * 0.5;
      bl.position.y = Math.sin((i / 4) * Math.PI * 2) * 0.5;
      bl.rotation.z = (i / 4) * Math.PI * 2;
      blades.add(bl);
    }
    fan.add(blades);
    fan.userData.blades = blades;
    g.add(fan);
    fans.push(blades);
  }

  const planters = [];
  const stations = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 6; c++) {
      const x = -7.6 + c * 3.05;
      const z = -3.4 + r * 3.3;
      const bed = new THREE.Group();
      bed.position.set(x, 0, z);
      bed.add(box(2.5, 0.35, 2.2, mt.metalD, 0, 0.18, 0));
      bed.add(box(2.3, 0.12, 2.0, mt.soil, 0, 0.4, 0));
      bed.add(box(2.5, 0.5, 0.12, mt.orange, 0, 0.42, -1.06));
      bed.add(box(2.5, 0.5, 0.12, mt.orange, 0, 0.42, 1.06));

      const plant = new THREE.Group();
      plant.position.set(0, 0.46, 0);
      for (let i = 0; i < 4; i++) {
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.85, 5), mt.leaf);
        leaf.position.set((i - 1.5) * 0.5, 0.42, i % 2 ? 0.3 : -0.3);
        leaf.castShadow = true;
        plant.add(leaf);
      }
      const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 8), mt.crop);
      fruit.position.y = 0.85;
      plant.add(fruit);
      plant.scale.setScalar(0.001);
      plant.visible = false;
      bed.add(plant);

      const weeds = new THREE.Group();
      for (let i = 0; i < 5; i++) {
        const w = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.42, 4), mt.leafDry);
        w.position.set(rnd2(-0.9, 0.9), 0.6, rnd2(-0.8, 0.8));
        weeds.add(w);
      }
      weeds.visible = false;
      bed.add(weeds);

      g.add(bed);
      const p = {
        index: planters.length,
        group: bed,
        plant,
        fruit,
        weeds,
        growth: 0,
        water: 0.5,
        stage: "empty", // empty | growing | ripe
      };
      planters.push(p);

      // her yatak için nişan alınabilir hedef kutusu
      const target = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 1.2, 2.1),
        new THREE.MeshBasicMaterial({ visible: false }),
      );
      target.position.set(x, 0.85, z);
      g.add(target);
      station(g, target, {
        id: "plot_" + p.index,
        planter: p.index,
        label: "Ekim yatağı " + (p.index + 1),
        dur: 2.6,
        effect: "plot",
      });
      stations.push(target);
    }
  }

  // Başlangıçta bazı yatakları ekili göster
  planters.forEach((p, i) => {
    if (i < 6) {
      p.stage = "growing";
      p.growth = 0.3 + (i % 3) * 0.25;
      p.water = 0.7;
      p.plant.visible = true;
      if (i % 2 === 0) p.weeds.visible = true;
      const s = 0.35 + p.growth * 0.75;
      p.plant.scale.set(s, s, s);
    } else if (i < 9) {
      p.stage = "ripe";
      p.growth = 1;
      p.plant.visible = true;
      const s = 0.35 + 0.75;
      p.plant.scale.set(s, s, s);
      p.fruit.scale.setScalar(1.35);
    }
  });

  const tank = new THREE.Group();
  tank.position.set(8.3, 0, 5.2);
  const tankBody = cyl(1.1, 1.1, 3.2, mt.white, 14);
  tankBody.position.y = 1.6;
  tank.add(tankBody);
  const water = cyl(1.0, 1.0, 2.2, mt.water, 14);
  water.position.y = 1.0;
  tank.add(water);
  tank.add(box(2.4, 0.2, 0.5, mt.metal, 0, 3.3, 0));
  tank.add(label("SU TANKI", 0, 4.0, 0, 1.8));
  station(g, tank, {
    id: "water_tank",
    label: "Su tankını doldur",
    hint: "Sulama hattındaki basıncı yükselt",
    dur: 2.6,
    effect: "water_tank",
  });

  const bin = new THREE.Group();
  bin.position.set(-8.1, 0, 5.4);
  bin.add(box(1.8, 1.2, 1.6, mt.metalD, 0, 0.6, 0));
  bin.add(box(1.9, 0.12, 1.7, mt.metal, 0, 1.24, 0));
  bin.add(box(1.6, 0.1, 0.4, mt.orange, 0, 0.95, -0.82));
  bin.add(label("HASAT", 0, 2.1, 0, 1.6));
  station(g, bin, {
    id: "harvest_bin",
    label: "Hasadı sevk et",
    hint: "Toplanan ürünü koloni deposuna gönder",
    dur: 2.0,
    effect: "harvest_bin",
  });

  const seed = new THREE.Group();
  seed.position.set(-8.1, 0, -5.4);
  seed.add(box(1.6, 0.9, 1.2, mt.orange, 0, 0.45, 0));
  seed.add(box(1.7, 0.12, 1.3, mt.metal, 0, 0.92, 0));
  seed.add(label("TOHUM", 0, 1.7, 0, 1.5));
  station(g, seed, {
    id: "seed_box",
    label: "Tohumları hazırla",
    hint: "Çimlenme için tohumları ıslat",
    dur: 1.8,
    effect: "seed_box",
  });

  const door = new THREE.Group();
  door.position.set(0, 0, -D / 2 + 0.2);
  door.add(box(2.6, 3.0, 0.2, mt.metalD, 0, 1.5, 0));
  door.add(box(2.1, 2.5, 0.12, mt.glass, 0, 1.35, 0.12));
  door.add(box(2.8, 0.3, 0.4, mt.orange, 0, 3.1, 0));
  g.add(door);

  return {
    type: "farm",
    group: g,
    radius: 8.4,
    doorLocal: new THREE.Vector3(0, 0, -D / 2 - 1.8),
    floorY: 0.5,
    slots: { bed: [], work: [], door: new THREE.Vector3(0, 0, -D / 2 + 0.8) },
    stations: [...stations, tank, bin, seed],
    planters,
    fans,
  };
}

/* ---------------------------------------------------------------- */
/* 3) MINE — kaya tüneli + cevher damarları                          */
/* ---------------------------------------------------------------- */
function mineInterior() {
  const mt = mats();
  const g = new THREE.Group();
  const tunnel = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, 18, 16, 1, true), mt.rockWall);
  tunnel.rotation.x = Math.PI / 2;
  tunnel.position.y = 1.4;
  tunnel.receiveShadow = true;
  g.add(tunnel);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(5, 18), mt.deck);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  g.add(floor);

  for (let i = -2; i <= 2; i++) {
    const arch = new THREE.Mesh(new THREE.TorusGeometry(3.3, 0.16, 6, 14, Math.PI), mt.metalD);
    arch.position.set(0, 0.15, i * 3.6);
    g.add(arch);
    g.add(box(6.4, 0.12, 0.12, mt.metalD, 0, 0.06, i * 3.6));
  }
  lampStrip(g, 2.2, 3.3, -5.5);
  lampStrip(g, 2.2, 3.3, 0.5);
  lampStrip(g, 2.2, 3.3, 6.5);

  for (let i = 0; i < 5; i++) {
    const a = 1.1 + i * 1.15;
    const node = new THREE.Group();
    node.position.set(Math.cos(a) * 3.0, 1.3 + (i % 2) * 0.7, -6 + i * 3);
    for (let k = 0; k < 7; k++) {
      const c = new THREE.Mesh(new THREE.DodecahedronGeometry(rnd2(0.18, 0.36), 0), mt.ore);
      c.position.set(rnd2(-0.5, 0.5), rnd2(-0.4, 0.4), rnd2(-0.3, 0.3));
      node.add(c);
    }
    station(g, node, {
      id: "ore_" + i,
      label: "Cevher damarını kaz",
      hint: "Kazıcıyla parça ve metal çıkar",
      dur: 3.4,
      effect: "ore",
      seam: node,
    });
  }

  const cart = new THREE.Group();
  cart.position.set(1.6, 0, 2.0);
  cart.add(box(1.4, 0.9, 2.2, mt.metal, 0, 0.6, 0));
  cart.add(box(1.5, 0.12, 2.3, mt.metalD, 0, 1.05, 0));
  const w1 = cyl(0.32, 0.32, 0.16, mt.dark, 10);
  w1.rotation.z = Math.PI / 2;
  w1.position.set(0.72, 0.3, 0);
  cart.add(w1);
  const w2 = w1.clone();
  w2.position.x = -0.72;
  cart.add(w2);
  for (let i = 0; i < 9; i++) {
    const r = new THREE.Mesh(new THREE.DodecahedronGeometry(rnd2(0.15, 0.26), 0), mt.rock);
    r.position.set(rnd2(-0.5, 0.5), 1.1 + rnd2(0, 0.2), rnd2(-0.7, 0.7));
    cart.add(r);
  }
  cart.add(label("TAÅIMA VAGONU", 0, 2.2, 0, 2.2));
  station(g, cart, {
    id: "cart",
    label: "Cevheri yüzeye taşı",
    hint: "Vagonu asansör kuyusuna gönder",
    dur: 3.0,
    effect: "cart",
  });

  const rail = new THREE.Group();
  for (const x of [0.9, 2.3]) rail.add(box(0.1, 0.1, 17, mt.metal, x, 0.05, 0));
  g.add(rail);

  return {
    type: "mine",
    group: g,
    radius: 2.7,
    doorLocal: new THREE.Vector3(0, 0, -10.2),
    floorY: 0.2,
    slots: { bed: [], work: [], door: new THREE.Vector3(0, 0, -8.6) },
    stations: [],
  };
}

/* ---------------------------------------------------------------- */
/* 4) LAB — örnek tankları, analiz konsolu, santrifüj                */
/* ---------------------------------------------------------------- */
function labInterior() {
  const mt = mats();
  const g = room(13, 4.2, 10, mt.white);
  lampStrip(g, 4, 3.9, -2.8);
  lampStrip(g, 4, 3.9, 2.8);
  for (const x of [-4.4, 0, 4.4]) {
    g.add(box(2.6, 1.0, 0.7, mt.metalD, x, 0.5, -4.5));
    g.add(box(2.4, 0.12, 0.8, mt.metal, x, 1.05, -4.5));
    g.add(box(2.2, 0.6, 0.08, mt.screen, x, 0.65, -4.12));
  }

  const tanks = [];
  for (const x of [-4.4, 4.4]) {
    const t = new THREE.Group();
    t.position.set(x, 0, -1.4);
    const body = cyl(0.95, 0.95, 2.4, mt.glass, 16);
    body.position.y = 1.3;
    t.add(body);
    const b1 = cyl(1.0, 1.0, 0.25, mt.metalD, 16);
    b1.position.y = 0.12;
    t.add(b1);
    const b2 = cyl(1.0, 1.0, 0.25, mt.metalD, 16);
    b2.position.y = 2.5;
    t.add(b2);
    const sp = new THREE.Mesh(new THREE.IcosahedronGeometry(0.45, 0), mt.crop);
    sp.position.y = 1.3;
    t.add(sp);
    t.userData.specimen = sp;
    g.add(t);
    g.add(label("BİYOKÜLTÜR", x, 3.2, -1.4, 1.8));
    tanks.push(t);
    station(g, t, {
      id: "sample_" + (x > 0 ? "b" : "a"),
      label: "Biyokültür numunesi al",
      hint: "Tanktan analiz için numune al",
      dur: 2.4,
      effect: "sample",
    });
  }

  const cons = new THREE.Group();
  cons.position.set(0, 0, 2.8);
  cons.add(box(3.6, 1.0, 1.0, mt.white, 0, 0.5, 0));
  const scr = box(3.0, 1.2, 0.1, mt.screen, 0, 1.55, -0.35);
  scr.rotation.x = 0.14;
  cons.add(scr);
  cons.add(box(3.8, 0.14, 1.2, mt.metal, 0, 1.05, 0));
  for (let i = 0; i < 3; i++) cons.add(box(0.25, 0.1, 0.1, mt.lamp, -1 + i, 1.12, -0.45));
  cons.add(label("ANALİZ HATTI", 0, 2.7, 0, 2.2));
  station(g, cons, {
    id: "analyze",
    label: "Analiz çalıştır",
    hint: "Numuneyi laboratuvar hattından geçir",
    dur: 3.6,
    effect: "analyze",
  });

  const cen = new THREE.Group();
  cen.position.set(-5.2, 0, 2.8);
  cen.add(box(1.6, 1.4, 1.6, mt.metalD, 0, 0.7, 0));
  const lid = cyl(0.75, 0.75, 0.2, mt.glass, 14);
  lid.position.y = 1.5;
  cen.add(lid);
  cen.add(box(0.6, 0.4, 0.08, mt.screen, 0, 0.9, -0.82));
  cen.add(label("SANTRİFÜJ", 0, 2.5, 0, 2.0));
  station(g, cen, {
    id: "centrifuge",
    label: "Santrifüjü çalıştır",
    hint: "Hücre kültürünü ayrıştır",
    dur: 2.8,
    effect: "centrifuge",
  });

  const door = new THREE.Group();
  door.position.set(0, 0, -4.8);
  door.add(box(2.4, 2.8, 0.2, mt.metalD, 0, 1.4, 0));
  door.add(box(2.0, 2.3, 0.12, mt.orange, 0, 1.3, 0.12));
  g.add(door);

  return {
    type: "lab",
    group: g,
    radius: 5.4,
    doorLocal: new THREE.Vector3(0, 0, -6.4),
    floorY: 0.3,
    slots: { bed: [], work: [], door: new THREE.Vector3(0, 0, -5.1) },
    stations: [],
    tanks,
  };
}

/* ---------------------------------------------------------------- */
/* 5) SOLAR — invertör kabini + batarya bankası                      */
/* ---------------------------------------------------------------- */
function solarInterior() {
  const mt = mats();
  const g = room(9.5, 3.6, 7.5, mt.metalD);
  lampStrip(g, 3, 3.3, -1.8);
  lampStrip(g, 3, 3.3, 1.8);
  for (let i = 0; i < 4; i++) {
    g.add(box(1.6, 2.4, 0.6, mt.dark, -3 + i * 2, 1.2, -3.3));
    g.add(box(1.4, 0.6, 0.1, mt.screen, -3 + i * 2, 1.9, -2.98));
    g.add(box(0.2, 0.2, 0.1, mt.lamp, -3 + i * 2, 1.1, -2.96));
  }
  const inv = new THREE.Group();
  inv.position.set(2.7, 0, 1.4);
  inv.add(box(2.2, 2.4, 1.2, mt.white, 0, 1.2, 0));
  inv.add(box(1.8, 1.0, 0.1, mt.screen, 0, 1.7, -0.62));
  inv.add(box(2.4, 0.16, 1.4, mt.orange, 0, 2.45, 0));
  inv.add(label("İNVERTÖR", 0, 3.3, 0, 2.0));
  station(g, inv, {
    id: "inverter",
    label: "İnvertörü onar",
    hint: "DCâ†’AC dönüştürücüyü kalibre et",
    dur: 3.0,
    effect: "inverter",
  });
  const batt = new THREE.Group();
  batt.position.set(-2.7, 0, 1.4);
  for (let i = 0; i < 3; i++) {
    const b = new THREE.Group();
    b.position.set(i * 1.1, 0, 0);
    b.add(box(1.0, 1.8, 1.0, mt.dark, 0, 0.9, 0));
    b.add(box(0.9, 0.3, 0.1, mt.screen, 0, 1.3, -0.52));
    batt.add(b);
  }
  batt.add(label("BATARYA BANKASI", 0, 2.6, 0, 2.4));
  station(g, batt, {
    id: "battery",
    label: "Bataryayı şarj et",
    hint: "Gece için enerji depolaması yap",
    dur: 2.6,
    effect: "battery",
  });
  const door = new THREE.Group();
  door.position.set(0, 0, -3.5);
  door.add(box(2.2, 2.6, 0.2, mt.metalD, 0, 1.3, 0));
  door.add(box(1.8, 2.1, 0.12, mt.glass, 0, 1.2, 0.12));
  g.add(door);
  return {
    type: "solar",
    group: g,
    radius: 4.0,
    doorLocal: new THREE.Vector3(0, 0, -5.4),
    floorY: 0.2,
    slots: { bed: [], work: [], door: new THREE.Vector3(0, 0, -3.8) },
    stations: [],
  };
}

/* ---------------------------------------------------------------- */
/* 6) ROCKET — fırlatma kontrol odası                                */
/* ---------------------------------------------------------------- */
function rocketInterior() {
  const mt = mats();
  const g = room(12, 4.6, 10, mt.white);
  lampStrip(g, 4, 4.3, -2.8);
  lampStrip(g, 4, 4.3, 2.8);
  g.add(box(5.4, 1.9, 0.12, mt.screen, -2.4, 2.5, -4.7));
  for (let i = 0; i < 3; i++) g.add(box(1.4, 0.9, 0.1, mt.screen, 2.4 + i * 1.5, 2.4, -4.7));

  const cons = new THREE.Group();
  cons.position.set(0, 0, 1.8);
  cons.add(box(4.2, 1.1, 1.2, mt.metalD, 0, 0.55, 0));
  const scr = box(3.4, 1.3, 0.1, mt.screen, 0, 1.7, -0.4);
  scr.rotation.x = 0.16;
  cons.add(scr);
  for (let i = 0; i < 3; i++) cons.add(box(0.3, 0.12, 0.12, mt.lamp, -1 + i, 1.15, -0.5));
  cons.add(label("FIRLATMA KONSOLU", 0, 3.0, 0, 2.6));
  station(g, cons, {
    id: "launch_console",
    label: "Fırlatma sırasını hazırla",
    hint: "Yörünge penceresini kilitle",
    dur: 4.0,
    effect: "launch",
  });

  const fuel = new THREE.Group();
  fuel.position.set(3.8, 0, -2.6);
  for (let i = 0; i < 2; i++) {
    const t = cyl(0.72, 0.72, 2.6, mt.metal, 12);
    t.position.set(i * 1.7 - 0.85, 1.3, 0);
    fuel.add(t);
    const cap = cyl(0.78, 0.78, 0.22, mt.orange, 12);
    cap.position.set(i * 1.7 - 0.85, 2.62, 0);
    fuel.add(cap);
  }
  fuel.add(label("YAKIT TANKLARI", 0, 3.5, 0, 2.2));
  station(g, fuel, {
    id: "fuel",
    label: "Yakıtı yükle",
    hint: "Oksijen ve metan tanklarını doldur",
    dur: 3.6,
    effect: "fuel",
  });

  const door = new THREE.Group();
  door.position.set(0, 0, -4.8);
  door.add(box(2.4, 2.8, 0.2, mt.metalD, 0, 1.4, 0));
  door.add(box(2.0, 2.3, 0.12, mt.orange, 0, 1.3, 0.12));
  g.add(door);

  return {
    type: "rocket",
    group: g,
    radius: 4.8,
    doorLocal: new THREE.Vector3(0, 0, -6.4),
    floorY: 0.3,
    slots: { bed: [], work: [], door: new THREE.Vector3(0, 0, -5.1) },
    stations: [],
  };
}

const FACTORIES = {
  habitat: habitatInterior,
  farm: farmInterior,
  mine: mineInterior,
  lab: labInterior,
  solar: solarInterior,
  rocket: rocketInterior,
};

export function hasInterior(type) {
  return !!FACTORIES[type];
}

/** Bina tipi için iç mekân üretir (her çağrıda yeni obje). */
export function buildInterior(type) {
  const f = FACTORIES[type];
  if (!f) return null;
  const data = f();
  data.group.userData.interiorKind = true;
  data.group.traverse((o) => {
    if (o.isMesh && !o.userData.kind) o.userData = { kind: "interior" };
  });
  return data;
}
