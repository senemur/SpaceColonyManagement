'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ColonyZone } from '@/features/colony/types';

interface MarsGlobeSceneProps {
  colonyZones?: ColonyZone[];
  selectedZoneId?: number | null;
  onZoneClick?: (zone: ColonyZone) => void;
  onZoneDoubleClick?: (zone: ColonyZone) => void;
}

// Mars sphere'de lat/lon koordinatını 3D pozisyona dönüştür
function latLonToVec3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);   // enlem → polar açı
  const theta = (lon + 180) * (Math.PI / 180); // boylam → azimut açı
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

export default function MarsGlobeScene({
  colonyZones = [],
  selectedZoneId = null,
  onZoneClick,
  onZoneDoubleClick,
}: MarsGlobeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Zone'ları ref'e koy ki useEffect closure içinde güncel kalsın
  const zonesRef = useRef(colonyZones);
  zonesRef.current = colonyZones;
  const onClickRef = useRef(onZoneClick);
  onClickRef.current = onZoneClick;
  const onDblClickRef = useRef(onZoneDoubleClick);
  onDblClickRef.current = onZoneDoubleClick;
  const selectedRef = useRef(selectedZoneId);
  selectedRef.current = selectedZoneId;

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Procedural Mars Surface Texture
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(200, 180, 20, 256, 256, 350);
      grad.addColorStop(0, '#e2703a');
      grad.addColorStop(0.5, '#c9541f');
      grad.addColorStop(1, '#6b2410');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      for (let i = 0; i < 400; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = 2 + Math.random() * 20;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = Math.random() > 0.4 ? 'rgba(65, 20, 14, 0.25)' : 'rgba(255, 160, 100, 0.18)';
        ctx.fill();
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    // Mars Planet Mesh
    const PLANET_R = 1.8;
    const planetGeo = new THREE.SphereGeometry(PLANET_R, 64, 64);
    const planetMat = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.8, metalness: 0.1 });
    const planet = new THREE.Mesh(planetGeo, planetMat);
    scene.add(planet);

    // Atmosphere
    const atmosGeo = new THREE.SphereGeometry(PLANET_R + 0.04, 48, 48);
    const atmosMat = new THREE.MeshBasicMaterial({ color: 0xff8a4c, transparent: true, opacity: 0.12, side: THREE.BackSide });
    scene.add(new THREE.Mesh(atmosGeo, atmosMat));

    // Stars
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 300;
    const pos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 40;
      pos[i + 1] = (Math.random() - 0.5) * 40;
      pos[i + 2] = (Math.random() - 0.5) * 40;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.08 })));

    // Lighting
    scene.add(new THREE.AmbientLight(0xffdcd0, 0.6));
    const sunLight = new THREE.DirectionalLight(0xffebd8, 2.5);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    // Colony Markers — planet'in child'ı olarak ekliyoruz, döndükçe birlikte dönecek
    const markerGroup = new THREE.Group();
    planet.add(markerGroup);

    const markerMeshes: { mesh: THREE.Mesh; zone: ColonyZone }[] = [];

    const buildMarkers = () => {
      // Önce eskilerini temizle
      while (markerGroup.children.length > 0) markerGroup.remove(markerGroup.children[0]);
      markerMeshes.length = 0;

      zonesRef.current.forEach((zone) => {
        const isSelected = zone.id === selectedRef.current;
        const markerRadius = isSelected ? 0.065 : 0.05;
        const color = new THREE.Color(zone.color);

        // Parlak daire marker
        const geo = new THREE.SphereGeometry(markerRadius, 12, 12);
        const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: isSelected ? 1 : 0.85 });
        const mesh = new THREE.Mesh(geo, mat);

        const p = latLonToVec3(zone.lat, zone.lon, PLANET_R + 0.02);
        mesh.position.copy(p);
        markerGroup.add(mesh);
        markerMeshes.push({ mesh, zone });

        // Halo ring (seçiliyse belirgin)
        const ringGeo = new THREE.RingGeometry(markerRadius * 1.8, markerRadius * 2.4, 24);
        const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: isSelected ? 0.7 : 0.3, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(p);
        ring.lookAt(0, 0, 0); // yüzeye dik bak
        markerGroup.add(ring);
      });
    };

    buildMarkers();

    // Raycasting için
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getClickedZone = (e: MouseEvent): ColonyZone | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(markerMeshes.map(m => m.mesh));
      if (hits.length > 0) {
        const found = markerMeshes.find(m => m.mesh === hits[0].object);
        return found?.zone ?? null;
      }
      return null;
    };

    // Drag interaction
    let isDragging = false;
    let hasDragged = false;
    let previousMousePosition = { x: 0, y: 0 };
    let lastClickTime = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      hasDragged = false;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        hasDragged = true;
      }
      planet.rotation.y += deltaX * 0.008;
      planet.rotation.x += deltaY * 0.008;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = (e: MouseEvent) => {
      isDragging = false;
      if (!hasDragged) {
        const now = Date.now();
        const zone = getClickedZone(e);
        if (zone) {
          if (now - lastClickTime < 350) {
            // Çift tıklama
            onDblClickRef.current?.(zone);
          } else {
            // Tek tıklama
            onClickRef.current?.(zone);
            // Marker'ları güncelle
            selectedRef.current = zone.id;
            buildMarkers();
          }
          lastClickTime = now;
        }
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animId: number;
    const animate = () => {
      if (!isDragging) {
        planet.rotation.y += 0.003;
      }
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
      if (container.contains(domEl)) container.removeChild(domEl);
    };
  }, []); // Sadece mount/unmount'ta çalışır — refs sayesinde güncel state'e erişir

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[260px] md:min-h-[320px] cursor-pointer"
      title="Koloni bölgesine tıklayın • Çift tık: 3D yüzeye git"
    />
  );
}