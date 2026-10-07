'use client';

import dynamic from 'next/dynamic';

const Mars3DView = dynamic(() => import('@/features/game-3d/components/Mars3DView'), {
  ssr: false,
  loading: () => (
    <div className="loader" id="loader">
      <div className="planet"></div>
      <p>Mars yüzeyi ve 3D simülasyon oluşturuluyor…</p>
    </div>
  ),
});

export default function ColonyGamePage() {
  return (
    <div className="fixed inset-0 z-50 w-screen h-screen overflow-hidden bg-black">
      <Mars3DView />
    </div>
  );
}
