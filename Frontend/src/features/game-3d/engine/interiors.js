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

/** 3D Holografik İstasyon İşareti / Billboard */
function createHoloBeacon(title, sub, x = 0, y = 2.4, z = 0, w = 2.1) {
  const cvs = document.createElement("canvas");
  cvs.width = 384;
  cvs.height = 112;
  const ctx = cvs.getContext("2d");

  // Yarı saydam koyu zemin
  ctx.fillStyle = "rgba(10, 18, 30, 0.88)";
  ctx.beginPath();
  ctx.roundRect(6, 6, 372, 100, 16);
  ctx.fill();

  // Parlayan neon çerçeve
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 3;
  ctx.shadowColor = "#0284c7";
  ctx.shadowBlur = 10;
  ctx.stroke();

  // [E] Tuşu rozeti
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#e2703a";
  ctx.beginPath();
  ctx.roundRect(16, 20, 52, 44, 8);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("E", 42, 42);

  // İstasyon Başlığı
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px 'Inter', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(title, 80, 36);

  // Görev Ödülü / İpucu Alt Başlık
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 15px 'Inter', sans-serif";
  ctx.fillText(sub, 80, 64);

  const tex = new THREE.CanvasTexture(cvs);
  const sp = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }),
  );
  sp.position.set(x, y, z);
  sp.scale.set(w, w * 0.3, 1);
  sp.renderOrder = 10;
  sp.userData.isBeacon = true;
  sp.userData.baseY = y;
  return sp;
}

/** Zemin etkileşim halkası */
function createFloorRing(x = 0, y = 0.04, z = 0, radius = 1.25) {
  const geom = new THREE.RingGeometry(radius * 0.78, radius, 28);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.38,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const ring = new THREE.Mesh(geom, mat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(x, y, z);
  ring.userData.isFloorRing = true;
  return ring;
}

/** Görev istasyonu: crosshair ile nişan alınabilir hedef. */
function station(parent, mesh, task) {
  mesh.userData = { kind: "task", task };
  mesh.traverse((c) => {
    c.userData.kind = "task";
    c.userData.task = task;
  });

  // Kolay nişan alma için görünmez geniş etkileşim kutusu (hitbox)
  const hitbox = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 2.4, 2.4),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  hitbox.position.set(0, 1.0, 0);
  hitbox.userData = { kind: "task", task };
  mesh.add(hitbox);

  // Sera ekim yatakları hariç tüm istasyonlara belirgin 3D hologram ve zemin halkası ekle
  if (!task.isPlot) {
    const beacon = createHoloBeacon(
      task.label,
      task.rewardText || task.hint || "[E] Basılı Tut",
      0,
      task.beaconY || 2.4,
      0,
    );
    mesh.add(beacon);
    const ring = createFloorRing(0, 0.04, 0, task.ringRadius || 1.3);
    mesh.add(ring);
  }

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
  const habitatStations = [];

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

    if (i === 0) {
      station(g, desk, {
        id: "comms",
        label: "İletişim & Günlük Konsolu",
        hint: "Dünya ve yörünge üssüyle telemetri eşitle",
        dur: 1.8,
        effect: "comms",
        rewardText: "+15 Moral & +5 Güç",
        beaconY: 2.2,
      });
      habitatStations.push(desk);
    } else {
      station(g, desk, {
        id: "medbay",
        label: "Medikal Tarama & İlk Yardım",
        hint: "Mürettebat biyometrik taramasını güncelle",
        dur: 1.8,
        effect: "medbay",
        rewardText: "+10 Sağlık & +5 Bütünlük",
        beaconY: 2.2,
      });
      habitatStations.push(desk);
    }

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
  station(g, maint, {
    id: "repair",
    label: "Yaşam Desteği ve Basınç Bakımı",
    hint: "Basınç ve ısıtma sistemini tara",
    dur: 1.8,
    effect: "repair",
    rewardText: "+10 Bütünlük & O₂",
    beaconY: 2.2,
  });
  habitatStations.unshift(maint);

  g.add(cyl(4.06, 4.06, 0.6, mt.deck, 26).translateY(-0.3));

  return {
    type: "habitat",
    group: g,
    radius: 3.4,
    doorLocal: new THREE.Vector3(0, 0, -5.1),
    floorY: 0.42,
    slots: { bed: bedSlots, work: workSlots, door: new THREE.Vector3(0, 0, -3.9) },
    stations: habitatStations,
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
        label: "Ekim Yatağı #" + (p.index + 1),
        dur: 1.5,
        effect: "plot",
        isPlot: true,
        rewardText: "+10..42 Besin",
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
  station(g, tank, {
    id: "water_tank",
    label: "Ana Sulama Tankı",
    hint: "Sulama hattındaki basıncı yükselt ve depoları doldur",
    dur: 1.8,
    effect: "water_tank",
    rewardText: "+220 L Su",
    beaconY: 3.8,
  });

  const bin = new THREE.Group();
  bin.position.set(-8.1, 0, 5.4);
  bin.add(box(1.8, 1.2, 1.6, mt.metalD, 0, 0.6, 0));
  bin.add(box(1.9, 0.12, 1.7, mt.metal, 0, 1.24, 0));
  bin.add(box(1.6, 0.1, 0.4, mt.orange, 0, 0.95, -0.82));
  station(g, bin, {
    id: "harvest_bin",
    label: "Mahsul Sevk İstasyonu",
    hint: "Toplanan ürünü koloni ana ambarına gönder",
    dur: 1.8,
    effect: "harvest_bin",
    rewardText: "+45 Besin",
    beaconY: 2.2,
  });

  const seed = new THREE.Group();
  seed.position.set(-8.1, 0, -5.4);
  seed.add(box(1.6, 0.9, 1.2, mt.orange, 0, 0.45, 0));
  seed.add(box(1.7, 0.12, 1.3, mt.metal, 0, 0.92, 0));
  station(g, seed, {
    id: "seed_box",
    label: "Tohum İklimlendirme Masası",
    hint: "Çimlenme için genetik tohumları hazırla",
    dur: 1.6,
    effect: "seed_box",
    rewardText: "+15 Besin",
    beaconY: 2.0,
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

  const stations = [];

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
      label: "Cevher Damarı #" + (i + 1),
      hint: "Regolit kazıcıyla kaya ve metal çıkar",
      dur: 1.8,
      effect: "ore",
      seam: node,
      rewardText: "+14 Mineral",
      beaconY: 2.0,
    });
    stations.push(node);
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
    label: "Cevher Taşıma Vagonu",
    hint: "Dolu vagonu asansör kuyusuna gönder",
    dur: 2.0,
    effect: "cart",
    rewardText: "+35 Mineral",
    beaconY: 2.3,
  });
  stations.push(cart);

  const drill = new THREE.Group();
  drill.position.set(-1.6, 0, -2.0);
  drill.add(box(1.4, 1.2, 1.4, mt.metalD, 0, 0.6, 0));
  const drillBit = cyl(0.3, 0.45, 1.6, mt.metal, 8);
  drillBit.position.y = 1.4;
  drill.add(drillBit);
  drill.add(box(0.8, 0.5, 0.1, mt.screen, 0, 1.1, -0.72));
  station(g, drill, {
    id: "drill",
    label: "Otomatik Tünel Sondajı",
    hint: "Delici kafayı kalibre et ve kaya kır",
    dur: 1.8,
    effect: "drill",
    rewardText: "+20 Mineral",
    beaconY: 2.4,
  });
  stations.push(drill);

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
    stations,
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
    station(g, t, {
      id: "sample_" + (x > 0 ? "b" : "a"),
      label: (x > 0 ? "B" : "A") + " Biyokültür Tankı",
      hint: "Analiz için organik numune al",
      dur: 1.8,
      effect: "sample",
      rewardText: "+15 Araştırma",
      beaconY: 3.2,
    });
    tanks.push(t);
  }

  const cons = new THREE.Group();
  cons.position.set(0, 0, 2.8);
  cons.add(box(3.6, 1.0, 1.0, mt.white, 0, 0.5, 0));
  const scr = box(3.0, 1.2, 0.1, mt.screen, 0, 1.55, -0.35);
  scr.rotation.x = 0.14;
  cons.add(scr);
  cons.add(box(3.8, 0.14, 1.2, mt.metal, 0, 1.05, 0));
  for (let i = 0; i < 3; i++) cons.add(box(0.25, 0.1, 0.1, mt.lamp, -1 + i, 1.12, -0.45));
  station(g, cons, {
    id: "analyze",
    label: "Spektrometre Analiz Konsolu",
    hint: "Numuneyi spektrometre hattından geçir",
    dur: 2.0,
    effect: "analyze",
    rewardText: "+25 Araştırma",
    beaconY: 2.8,
  });

  const cen = new THREE.Group();
  cen.position.set(-5.2, 0, 2.8);
  cen.add(box(1.6, 1.4, 1.6, mt.metalD, 0, 0.7, 0));
  const lid = cyl(0.75, 0.75, 0.2, mt.glass, 14);
  lid.position.y = 1.5;
  cen.add(lid);
  cen.add(box(0.6, 0.4, 0.08, mt.screen, 0, 0.9, -0.82));
  station(g, cen, {
    id: "centrifuge",
    label: "Hücre Kültürü Santrifüjü",
    hint: "Hücre kültürünü ayrıştır ve oksijen üret",
    dur: 1.8,
    effect: "centrifuge",
    rewardText: "+2 O₂ & +10 Araştırma",
    beaconY: 2.5,
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
    stations: [...tanks, cons, cen],
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

  const stations = [];

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
  station(g, inv, {
    id: "inverter",
    label: "DC/AC Güç İnvertörü Kabini",
    hint: "DC→AC frekans dönüştürücüyü kalibre et",
    dur: 1.8,
    effect: "inverter",
    rewardText: "+35 kWh Enerji",
    beaconY: 3.2,
  });
  stations.push(inv);

  const batt = new THREE.Group();
  batt.position.set(-2.7, 0, 1.4);
  for (let i = 0; i < 3; i++) {
    const b = new THREE.Group();
    b.position.set(i * 1.1, 0, 0);
    b.add(box(1.0, 1.8, 1.0, mt.dark, 0, 0.9, 0));
    b.add(box(0.9, 0.3, 0.1, mt.screen, 0, 1.3, -0.52));
    batt.add(b);
  }
  station(g, batt, {
    id: "battery",
    label: "Ana Batarya Bankası",
    hint: "Güneş enerjisini yüksek kapasiteli yedek bataryalara şarj et",
    dur: 1.8,
    effect: "battery",
    rewardText: "+25 kWh Enerji",
    beaconY: 2.6,
  });
  stations.push(batt);

  const tracker = new THREE.Group();
  tracker.position.set(0, 0, 2.3);
  tracker.add(box(1.8, 1.1, 0.8, mt.metalD, 0, 0.55, 0));
  tracker.add(box(1.5, 0.7, 0.1, mt.screen, 0, 1.25, -0.32));
  station(g, tracker, {
    id: "solar_tracker",
    label: "Güneş Takip Motoru Konsolu",
    hint: "Panellerin azimut ve eğim açısını optimize et",
    dur: 1.6,
    effect: "inverter",
    rewardText: "+30 kWh Enerji",
    beaconY: 2.4,
  });
  stations.push(tracker);

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
    stations,
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

  const stations = [];

  const cons = new THREE.Group();
  cons.position.set(0, 0, 1.8);
  cons.add(box(4.2, 1.1, 1.2, mt.metalD, 0, 0.55, 0));
  const scr = box(3.4, 1.3, 0.1, mt.screen, 0, 1.7, -0.4);
  scr.rotation.x = 0.16;
  cons.add(scr);
  for (let i = 0; i < 3; i++) cons.add(box(0.3, 0.12, 0.12, mt.lamp, -1 + i, 1.15, -0.5));
  station(g, cons, {
    id: "launch_console",
    label: "Fırlatma & Telemetri Konsolu",
    hint: "Yörünge uydusuyla haberleşme penceresini kilitle",
    dur: 2.0,
    effect: "launch",
    rewardText: "Kule Seviyesi +1 & Bütünlük",
    beaconY: 3.0,
  });
  stations.push(cons);

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
  station(g, fuel, {
    id: "fuel",
    label: "Kriyojenik Yakıt Terminali",
    hint: "Sıvı metan ve oksijen tanklarını doldur ve basınçlandır",
    dur: 1.8,
    effect: "fuel",
    rewardText: "+15 Bütünlük",
    beaconY: 3.4,
  });
  stations.push(fuel);

  const cargo = new THREE.Group();
  cargo.position.set(-3.8, 0, -2.6);
  cargo.add(box(2.2, 1.4, 1.8, mt.metalD, 0, 0.7, 0));
  cargo.add(box(2.3, 0.15, 1.9, mt.orange, 0, 1.45, 0));
  station(g, cargo, {
    id: "cargo",
    label: "Yörünge Kargo Terminali",
    hint: "Dünya'ya gidecek bilimsel numuneleri mühürle",
    dur: 1.8,
    effect: "cargo",
    rewardText: "+20 Bütünlük",
    beaconY: 2.5,
  });
  stations.push(cargo);

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
    stations,
  };
}

/* ---------------------------------------------------------------- */
/* 7) WATER — yeraltı buzul eritme & su sondaj istasyonu              */
/* ---------------------------------------------------------------- */
function waterInterior() {
  const mt = mats();
  const g = room(12, 4.4, 9, mt.wall);
  lampStrip(g, 3.5, 4.0, -2.2);
  lampStrip(g, 3.5, 4.0, 2.2);

  const stations = [];

  // 1) Sondaj Pompası
  const pump = new THREE.Group();
  pump.position.set(0, 0, 0);
  pump.add(cyl(1.4, 1.6, 0.8, mt.metalD, 16).translateY(0.4));
  const pipe = cyl(0.4, 0.4, 3.2, mt.metal, 12);
  pipe.position.y = 1.6;
  pump.add(pipe);
  const motor = box(1.2, 1.0, 1.2, mt.orange, 0, 2.4, 0);
  pump.add(motor);
  const core = cyl(0.6, 0.6, 1.0, mt.water, 12);
  core.position.y = 1.0;
  pump.add(core);
  station(g, pump, {
    id: "water_pump",
    label: "Buz Eritme ve Sondaj Pompası",
    hint: "Derin buzul katmanından termal su çek",
    dur: 1.8,
    effect: "water_pump",
    rewardText: "+180 L Su",
    beaconY: 3.2,
  });
  stations.push(pump);

  // 2) Filtrasyon Ünitesi
  const filter = new THREE.Group();
  filter.position.set(4.2, 0, 1.8);
  for (let i = 0; i < 3; i++) {
    const col = cyl(0.45, 0.45, 2.4, mt.white, 12);
    col.position.set((i - 1) * 0.9, 1.2, 0);
    filter.add(col);
    const colCap = cyl(0.5, 0.5, 0.2, mt.metalD, 12);
    colCap.position.set((i - 1) * 0.9, 2.4, 0);
    filter.add(colCap);
  }
  filter.add(box(3.0, 0.15, 1.0, mt.metal, 0, 2.5, 0));
  station(g, filter, {
    id: "water_filter",
    label: "Moleküler Filtrasyon Ünitesi",
    hint: "Tuz ve mineralleri arıt",
    dur: 1.8,
    effect: "water_filter",
    rewardText: "+120 L Su",
    beaconY: 3.2,
  });
  stations.push(filter);

  // 3) Basınç Dengeleme Vanası
  const valve = new THREE.Group();
  valve.position.set(-4.2, 0, 1.8);
  valve.add(box(1.8, 1.2, 0.8, mt.metalD, 0, 0.6, 0));
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.08, 6, 16), mt.orange);
  wheel.position.set(0, 1.4, -0.4);
  valve.add(wheel);
  station(g, valve, {
    id: "water_valve",
    label: "Basınç Dengeleme Vanası",
    hint: "Ana rezervuar hattı basıncını eşitle",
    dur: 1.6,
    effect: "water_valve",
    rewardText: "+80 L Su",
    beaconY: 2.4,
  });
  stations.push(valve);

  const door = new THREE.Group();
  door.position.set(0, 0, -4.3);
  door.add(box(2.4, 2.8, 0.2, mt.metalD, 0, 1.4, 0));
  door.add(box(2.0, 2.3, 0.12, mt.orange, 0, 1.3, 0.12));
  g.add(door);

  return {
    type: "water",
    group: g,
    radius: 4.8,
    doorLocal: new THREE.Vector3(0, 0, -6.0),
    floorY: 0.3,
    slots: { bed: [], work: [], door: new THREE.Vector3(0, 0, -4.6) },
    stations,
  };
}

const FACTORIES = {
  habitat: habitatInterior,
  farm: farmInterior,
  mine: mineInterior,
  lab: labInterior,
  solar: solarInterior,
  rocket: rocketInterior,
  water: waterInterior,
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
