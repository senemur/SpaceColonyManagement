'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard,
  Rocket, 
  Users, 
  Building2, 
  Compass, 
  FlaskConical, 
  ScrollText, 
  Settings, 
  LogIn 
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Gösterge Paneli', icon: LayoutDashboard },
  { href: '/colony', label: 'Mars Üssü (3D)', icon: Rocket },
  { href: '/colonists', label: 'Mürettebat', icon: Users },
  { href: '/buildings', label: 'Binalar', icon: Building2 },
  { href: '/exploration', label: 'Keşif', icon: Compass },
  { href: '/research', label: 'Araştırma', icon: FlaskConical },
  { href: '/events', label: 'Olay Günlüğü', icon: ScrollText },
  { href: '/settings', label: 'Ayarlar', icon: Settings },
];

export default function Navbar() {
  const pathname = usePathname();

  if (pathname === '/colony') return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-rose-900/40 text-slate-100 px-4 py-2 shadow-lg shadow-rose-950/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-base tracking-wider text-rose-400 hover:text-rose-300 transition-colors shrink-0">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-700 to-amber-500 flex items-center justify-center shadow-md shadow-rose-600/30">
            <Rocket className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="hidden sm:inline font-black">MARS COLONY</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-rose-600/25 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Auth / Profile action */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-700/50 transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Giriş Yap</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
