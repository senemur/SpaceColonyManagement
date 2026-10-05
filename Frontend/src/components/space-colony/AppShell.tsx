import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Atom,
  Bell,
  Building2,
  ChevronRight,
  Compass,
  FlaskConical,
  Gauge,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "../ui/button";

const nav = [
  { to: "/", label: "Dashboard", icon: Gauge },
  { to: "/buildings", label: "Buildings", icon: Building2 },
  { to: "/colonists", label: "Colonists", icon: Users },
  { to: "/research", label: "Research", icon: FlaskConical },
  { to: "/exploration", label: "Exploration", icon: Compass },
  { to: "/events", label: "Events", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return (
    <div className="min-h-screen bg-background text-foreground">
      {open && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-overlay lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-sidebar transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-20 items-center justify-between border-b border-border px-5">
          <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
            <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
              <Atom size={21} />
            </span>
            <span className="min-w-0">
              <strong className="block truncate text-sm tracking-wide">SPACE COLONY</strong>
              <span className="block text-xs text-muted-foreground">New Horizon · Mars</span>
            </span>
          </Link>
          <Button
            aria-label="Close navigation"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </Button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Colony navigation">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              onClick={() => setOpen(false)}
              className="group flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[status=active]:bg-primary/12 data-[status=active]:text-primary"
            >
              <Icon size={18} className="shrink-0" />
              <span className="min-w-0 flex-1 truncate">{label}</span>
              {pathname === to && <ChevronRight size={15} />}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center gap-3 rounded-md bg-secondary p-3">
            <span className="relative grid size-9 place-items-center rounded-full bg-positive/12 text-positive">
              <Activity size={17} />
              <span className="absolute right-0 top-0 size-2 rounded-full bg-positive" />
            </span>
            <div>
              <p className="text-xs font-semibold">Colony online</p>
              <p className="text-[11px] text-muted-foreground">Cycle 148 · Sol 23</p>
            </div>
          </div>
          <Link
            to="/login"
            className="flex items-center gap-3 px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <LogOut size={16} /> Sign out
          </Link>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 grid h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-6">
          <Button
            aria-label="Open navigation"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu size={20} />
          </Button>
          <div className="hidden min-w-0 items-center gap-2 text-xs text-muted-foreground sm:flex">
            <span className="size-2 rounded-full bg-positive" />
            Systems nominal <span className="text-border">/</span> Mars local 14:32
          </div>
          <div className="col-start-3 flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 text-xs sm:flex">
              <Zap size={14} className="text-warning" />
              <span className="text-muted-foreground">Energy reserve</span>
              <strong>100</strong>
            </div>
            <Button aria-label="Notifications" variant="ghost" size="icon" className="relative">
              <Bell size={18} />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
            </Button>
          </div>
        </header>
        <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
