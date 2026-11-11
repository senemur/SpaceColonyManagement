'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  LogIn,
  MapPin,
  ChevronDown,
  Check
} from 'lucide-react';
import { useActiveColony } from '@/features/colony/context/ColonyContext';

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
  const { activeColonyId, setActiveColonyId, activeZone, allZones, allColonies } = useActiveColony();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (pathname === '/colony') return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-rose-900/40 text-slate-100 px-4 py-2 shadow-lg shadow-rose-950/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo & Active Colony Selector */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2 font-bold text-base tracking-wider text-rose-400 hover:text-rose-300 transition-colors">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-700 to-amber-500 flex items-center justify-center shadow-md shadow-rose-600/30">
              <Rocket className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="hidden xl:inline font-black">MARS COLONY</span>
          </Link>

          {/* Colony Dropdown Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-rose-500/50 transition-all text-slate-200 shadow-inner"
              title="Aktif Koloniyi Değiştir"
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: activeZone.color || '#e2703a' }}
              />
              <span className="truncate max-w-[110px] sm:max-w-[140px]">{activeZone.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-60 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                  Aktif Koloni Seçimi
                </div>
                {allZones.map((zone) => {
                  const colonyData = allColonies?.find((c) => c.id === zone.id);
                  const isSelected = zone.id === activeColonyId;
                  return (
                    <button
                      key={zone.id}
                      onClick={() => {
                        setActiveColonyId(zone.id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors ${
                        isSelected
                          ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: zone.color }}
                        />
                        <div className="flex flex-col text-left">
                          <span>{zone.name}</span>
                          <span className="text-[10px] text-slate-400">{zone.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {colonyData?.stats && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {colonyData.stats.population}/{colonyData.stats.maxPopulation}
                          </span>
                        )}
                        {isSelected && <Check className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

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
        <div className="hidden lg:flex items-center gap-2 shrink-0">
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
