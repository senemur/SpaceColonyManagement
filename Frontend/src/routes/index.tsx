import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, CircleDot, CloudSun, Gamepad2, Hammer, Radio, Users, Wifi } from "lucide-react";
import { AppShell } from "../components/space-colony/AppShell";
import { MarsScene } from "../components/space-colony/MarsScene";
import { buildings, resources } from "../components/space-colony/data";
import { Metric, ProgressBar, SectionHeading, StatusBadge } from "../components/space-colony/Common";
import { Button } from "../components/ui/Button";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "New Horizon Dashboard | Space Colony" },
    { name: "description", content: "Manage the New Horizon Mars colony, resources, population, infrastructure, research, and active events." },
    { property: "og:title", content: "New Horizon Dashboard | Space Colony" },
    { property: "og:description", content: "A modern Mars colony management dashboard." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Dashboard,
});

function Dashboard() {
  return <AppShell>
    <section className="relative mb-6 min-h-[320px] overflow-hidden rounded-lg border border-border bg-space sm:min-h-[360px]">
      <div className="absolute inset-0 right-0 sm:left-[42%]"><MarsScene compact /></div>
      <div className="pointer-events-none absolute inset-0 bg-hero-shade" />
      <Link to="/colony" aria-label="Enter and explore New Horizon colony" className="absolute inset-y-0 right-0 z-10 w-full cursor-pointer sm:w-[58%]" />
      <div className="relative z-10 flex min-h-[320px] max-w-xl flex-col justify-between p-6 sm:min-h-[360px] sm:p-8">
        <div><div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase text-primary"><span className="size-2 rounded-full bg-positive" /> Primary settlement</div><h1 className="text-3xl font-bold sm:text-5xl">NEW HORIZON</h1><p className="mt-2 text-sm text-muted-foreground">Mars Colony · Arcadia Planitia</p><div className="mt-6 flex flex-wrap gap-2"><StatusBadge tone="positive">Systems nominal</StatusBadge><StatusBadge tone="info">10 colonists</StatusBadge><StatusBadge tone="warning">Solar storm active</StatusBadge></div></div>
        <div className="grid max-w-lg grid-cols-3 gap-3"><Metric label="Sol" value="23" /><Metric label="Local time" value="14:32" /><Metric label="Temperature" value="−54°C" /></div>
      </div>
      <div className="absolute bottom-5 right-5 z-20 hidden items-center gap-2 rounded-md border border-game-border bg-game-panel px-3 py-2 text-xs font-semibold sm:flex"><Gamepad2 size={14} className="text-primary" /> Click Mars to enter colony</div>
    </section>

    <div className="mb-7 grid gap-3 border border-primary/25 bg-primary/7 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="flex min-w-0 gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/15 text-primary"><Wifi size={17} /></span><div className="min-w-0"><p className="text-sm font-semibold">Welcome back, Commander</p><p className="mt-1 text-xs text-muted-foreground">Last active 8 hours ago · Your colony continued producing while you were away.</p></div></div>
      <div className="grid grid-cols-4 gap-x-4 gap-y-2 text-xs"><span><b className="text-positive">+36</b> Food</span><span><b className="text-positive">+18</b> Water</span><span><b className="text-positive">+18</b> Oxygen</span><span><b className="text-positive">+90</b> Iron</span></div>
    </div>

    <SectionHeading title="Resource overview" subtitle="Live production cycle · updates each hour" />
    <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{resources.map((r) => { const Icon = r.icon; const net = r.production-r.consumption; return <article key={r.name} className="rounded-md border border-border bg-card p-4"><div className="mb-5 flex items-center justify-between"><span className={`grid size-9 place-items-center rounded-md bg-${r.tone}/10 text-${r.tone}`}><Icon size={18} /></span><span className="text-xs text-muted-foreground">{Math.round(r.value/r.max*100)}%</span></div><div className="mb-3 flex items-end justify-between"><h3 className="font-semibold">{r.name}</h3><p className="text-sm"><strong>{r.value}</strong><span className="text-muted-foreground"> / {r.max}</span></p></div><ProgressBar value={r.value/r.max*100} tone={r.tone} label={`${r.name} capacity`} /><div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3 text-[11px]"><span className="flex items-center gap-1 text-positive"><ArrowUpRight size={12} />+{r.production}/hr</span><span className="flex items-center justify-end gap-1 text-destructive"><ArrowDownRight size={12} />−{r.consumption}/hr</span></div><p className="mt-2 text-right text-xs font-bold text-positive">Net +{net} / hour</p></article>})}</div>

    <div className="mb-8 grid gap-6 xl:grid-cols-[1fr_340px]">
      <section><SectionHeading title="Colony Infrastructure" subtitle="6 structures · All core systems operational" action={<Link to="/buildings" className="text-xs font-semibold text-primary hover:underline">Manage all</Link>} /><div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">{buildings.map((b) => { const Icon = b.icon; return <article key={b.name} className="rounded-md border border-border bg-card p-4"><div className="mb-4 flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-md bg-secondary text-primary"><Icon size={19} /></span><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-semibold">{b.name}</h3><p className="mt-1 text-xs text-muted-foreground">Level {b.level}</p></div><StatusBadge tone="positive">Online</StatusBadge></div><p className="mb-4 text-sm font-semibold text-positive">{b.output}</p><div className="flex items-center justify-between border-t border-border pt-3"><span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Users size={13} /> Workers {b.workers}</span><Button size="sm" variant="secondary">Upgrade</Button></div></article>})}</div></section>
      <aside className="rounded-md border border-border bg-card p-5"><SectionHeading title="Population" subtitle="10 colonists aboard" /><div className="mb-5 flex items-center gap-4 rounded-md bg-secondary p-4"><span className="grid size-12 place-items-center rounded-full bg-info/12 text-info"><Users size={22} /></span><div><p className="text-2xl font-bold">10</p><p className="text-xs text-muted-foreground">Total population</p></div></div><div className="grid grid-cols-2 gap-3"><Metric label="Healthy" value="9" tone="positive" /><Metric label="Unhappy" value="1" tone="warning" /><Metric label="Working" value="8" /><Metric label="Idle" value="2" tone="warning" /></div><Link to="/colonists" className="mt-5 block text-center text-xs font-semibold text-primary">View colonist roster</Link></aside>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <section><SectionHeading title="Current Activity" subtitle="Research and construction queues" /><div className="space-y-3">{[{icon: Radio,name:"Improved Agriculture",kind:"Research",progress:65,time:"12 minutes"},{icon:Hammer,name:"Farm Level 2",kind:"Construction",progress:40,time:"18 minutes"}].map((a) => <article key={a.name} className="rounded-md border border-border bg-card p-5"><div className="mb-4 flex gap-3"><span className="grid size-10 place-items-center rounded-md bg-primary/12 text-primary"><a.icon size={18}/></span><div className="flex-1"><p className="text-xs text-muted-foreground">{a.kind}</p><h3 className="font-semibold">{a.name}</h3></div><strong className="text-sm">{a.progress}%</strong></div><ProgressBar value={a.progress}/><p className="mt-3 text-right text-xs text-muted-foreground">{a.time} remaining</p></article>)}</div></section>
      <section><SectionHeading title="Recent Events" subtitle="Conditions affecting New Horizon" action={<Link to="/events" className="text-xs font-semibold text-primary">View history</Link>} /><div className="overflow-hidden rounded-md border border-border bg-card"><article className="flex gap-4 border-b border-border p-5"><span className="grid size-10 shrink-0 place-items-center rounded-md bg-warning/12 text-warning"><CloudSun size={18}/></span><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">Solar Storm</h3><StatusBadge tone="warning">Active</StatusBadge></div><p className="mt-1 text-sm text-muted-foreground">Energy production reduced by 30%.</p><p className="mt-3 text-xs text-warning">2 hours remaining</p></div></article><article className="flex gap-4 p-5"><span className="grid size-10 shrink-0 place-items-center rounded-md bg-positive/12 text-positive">◆</span><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">Rich Iron Deposit</h3><StatusBadge tone="positive">Completed</StatusBadge></div><p className="mt-1 text-sm text-muted-foreground">+100 Iron discovered by surface survey.</p><p className="mt-3 text-xs text-muted-foreground">Yesterday · 18:42</p></div></article></div></section>
    </div>
  </AppShell>;
}
