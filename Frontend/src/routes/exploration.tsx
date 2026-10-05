import { createFileRoute } from "@tanstack/react-router";
import { BatteryCharging, Clock3, Compass, Droplets, MapPin, Pickaxe, Rocket } from "lucide-react";
import { useState } from "react";
import { AppShell } from "../components/space-colony/AppShell";
import { MarsScene } from "../components/space-colony/MarsScene";
import { PageHeading, ProgressBar, StatusBadge } from "../components/space-colony/Common";
import { Button } from "../components/ui/button";
export const Route = createFileRoute("/exploration")({
  head: () => ({
    meta: [
      { title: "Exploration | Space Colony" },
      {
        name: "description",
        content: "Plan and monitor surface missions across unknown regions of Mars.",
      },
      { property: "og:title", content: "Exploration | Space Colony" },
      { property: "og:description", content: "Launch exploration missions from New Horizon." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExplorationPage,
});
function ExplorationPage() {
  const [launched, setLaunched] = useState(false);
  return (
    <AppShell>
      <PageHeading
        eyebrow="Surface operations"
        title="Exploration"
        description="Send a survey team beyond the colony perimeter to discover resources and new opportunities."
        action={
          <StatusBadge tone={launched ? "info" : "neutral"}>
            {launched ? "Mission active" : "Team ready"}
          </StatusBadge>
        }
      />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(340px,.7fr)]">
        <section className="relative min-h-[520px] overflow-hidden rounded-lg border border-border bg-space">
          <div className="absolute inset-0">
            <MarsScene />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-explore-shade" />
          <div className="absolute left-5 top-5 z-10">
            <p className="text-xs font-bold uppercase text-primary">Orbital survey</p>
            <p className="mt-1 text-sm text-muted-foreground">Drag to rotate · Scroll to zoom</p>
          </div>
          <div className="absolute bottom-5 left-5 right-5 z-10 grid gap-3 rounded-md border border-border bg-panel/90 p-4 backdrop-blur sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-primary" />
              <div>
                <p className="text-[11px] text-muted-foreground">Colony</p>
                <p className="text-xs font-semibold">Arcadia Planitia</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Compass size={16} className="text-warning" />
              <div>
                <p className="text-[11px] text-muted-foreground">Target</p>
                <p className="text-xs font-semibold">Region E-17</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-positive" />
              <div>
                <p className="text-[11px] text-muted-foreground">Telemetry</p>
                <p className="text-xs font-semibold">Stable</p>
              </div>
            </div>
          </div>
        </section>
        <aside className="rounded-lg border border-border bg-card p-6">
          <p className="text-xs font-bold uppercase text-primary">Exploration mission</p>
          <h2 className="mt-2 text-2xl font-semibold">Unknown Mars Region</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Survey an unmapped basin north-east of New Horizon for mineral and subsurface ice
            deposits.
          </p>
          <div className="my-6 grid grid-cols-2 gap-4 border-y border-border py-5">
            <div>
              <p className="text-[11px] text-muted-foreground">Duration</p>
              <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
                <Clock3 size={15} />6 hours
              </p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">Energy cost</p>
              <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
                <BatteryCharging size={15} />
                100 Energy
              </p>
            </div>
          </div>
          <p className="mb-3 text-xs font-bold uppercase text-muted-foreground">
            Potential rewards
          </p>
          <div className="mb-6 grid grid-cols-2 gap-3">
            <div className="rounded-md bg-secondary p-4">
              <Pickaxe size={17} className="mb-3 text-iron" />
              <strong className="block text-lg">+150</strong>
              <span className="text-xs text-muted-foreground">Iron</span>
            </div>
            <div className="rounded-md bg-secondary p-4">
              <Droplets size={17} className="mb-3 text-info" />
              <strong className="block text-lg">+50</strong>
              <span className="text-xs text-muted-foreground">Water</span>
            </div>
          </div>
          {launched ? (
            <div>
              <div className="mb-2 flex justify-between text-xs">
                <span>Mission in progress</span>
                <strong>18%</strong>
              </div>
              <ProgressBar value={18} />
              <p className="mt-3 text-xs text-muted-foreground">
                4h 55m remaining · Destination E-17
              </p>
              <Button className="mt-5 w-full" variant="secondary" disabled>
                Mission underway
              </Button>
            </div>
          ) : (
            <Button className="w-full" onClick={() => setLaunched(true)}>
              <Rocket size={16} />
              Launch mission
            </Button>
          )}
        </aside>
      </div>
    </AppShell>
  );
}
