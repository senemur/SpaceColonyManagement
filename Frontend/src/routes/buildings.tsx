import { createFileRoute } from "@tanstack/react-router";
import { Clock3, HardHat, Users } from "lucide-react";
import { useState } from "react";
import { AppShell } from "../components/space-colony/AppShell";
import { PageHeading, ProgressBar, StatusBadge } from "../components/space-colony/Common";
import { buildings } from "../components/space-colony/data";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/buildings")({
  head: () => ({
    meta: [
      { title: "Buildings | Space Colony" },
      {
        name: "description",
        content: "Manage New Horizon colony buildings, production, workers, and upgrades.",
      },
      { property: "og:title", content: "Buildings | Space Colony" },
      { property: "og:description", content: "Manage Mars colony infrastructure and upgrades." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BuildingsPage,
});
function BuildingsPage() {
  const [upgrading, setUpgrading] = useState<string | null>("Farm");
  return (
    <AppShell>
      <PageHeading
        eyebrow="Infrastructure"
        title="Buildings"
        description="Monitor production, assign capacity, and expand the systems keeping New Horizon alive."
        action={<StatusBadge tone="positive">6 operational</StatusBadge>}
      />
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="stat">
          <span>Total output</span>
          <strong>+66 / hour</strong>
        </div>
        <div className="stat">
          <span>Workers assigned</span>
          <strong>10 / 11</strong>
        </div>
        <div className="stat">
          <span>Active upgrades</span>
          <strong>1</strong>
        </div>
        <div className="stat">
          <span>Stored iron</span>
          <strong>50</strong>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {buildings.map((b) => {
          const Icon = b.icon;
          const active = upgrading === b.name;
          return (
            <article key={b.name} className="rounded-md border border-border bg-card p-5">
              <div className="mb-5 flex items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-md bg-secondary text-primary">
                  <Icon size={21} />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold">{b.name}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Level {b.level} → Level {b.level + 1}
                  </p>
                </div>
                <StatusBadge tone={active ? "warning" : "positive"}>
                  {active ? "Building" : "Operational"}
                </StatusBadge>
              </div>
              <div className="grid grid-cols-2 gap-4 border-y border-border py-4">
                <div>
                  <p className="text-[11px] uppercase text-muted-foreground">Production</p>
                  <p className="mt-1 text-sm font-semibold text-positive">{b.output}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-muted-foreground">Capacity</p>
                  <p className="mt-1 text-sm font-semibold">{b.capacity}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-muted-foreground">Staffing</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm">
                    <Users size={13} />
                    {b.workers}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-muted-foreground">Build time</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm">
                    <Clock3 size={13} />
                    30 minutes
                  </p>
                </div>
              </div>
              {active ? (
                <div className="pt-5">
                  <div className="mb-2 flex justify-between text-xs">
                    <span>Upgrade in progress</span>
                    <strong>40%</strong>
                  </div>
                  <ProgressBar value={40} tone="warning" />
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <HardHat size={13} />
                    18 minutes remaining
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-5">
                  <div>
                    <p className="text-[11px] text-muted-foreground">Upgrade cost</p>
                    <p className="text-sm font-semibold">{b.cost} Iron</p>
                  </div>
                  <Button
                    size="sm"
                    disabled={b.cost > 50}
                    title={b.cost > 50 ? "Not enough Iron" : "Upgrade building"}
                    onClick={() => setUpgrading(b.name)}
                  >
                    Upgrade
                  </Button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
