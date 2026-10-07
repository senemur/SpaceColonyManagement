'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';

export default function MarsGlobeScene({ onEnter }: { onEnter?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

      // Craters and surface details
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
    const planetGeo = new THREE.SphereGeometry(1.8, 64, 64);
    const planetMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.8,
      metalness: 0.1,
    });
    const planet = new THREE.Mesh(planetGeo, planetMat);
    scene.add(planet);

    // Mars Atmosphere Glow
    const atmosGeo = new THREE.SphereGeometry(1.84, 48, 48);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0xff8a4c,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmosphere);

    // Starfield Background
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 300;
    const pos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 40;
      pos[i + 1] = (Math.random() - 0.5) * 40;
      pos[i + 2] = (Math.random() - 0.5) * 40;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08 });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffdcd0, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffebd8, 2.5);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    // Drag interaction
    let isDragging = false;
    let hasDragged = false;
    let previousMousePosition = { x: 0, y: 0 };

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

    const onMouseUp = () => {
      isDragging = false;
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
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
    };
  }, []);

  const handleClick = () => {
    if (onEnter) {
      onEnter();
    } else {
      router.push('/colony');
    }
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-full h-full min-h-[260px] md:min-h-[320px] cursor-pointer group"
      title="3D Mars Gezegenine Tıkla ve Üsse Gir"
    >
      <div ref={containerRef} className="w-full h-full absolute inset-0" />
    </div>
  );
}
