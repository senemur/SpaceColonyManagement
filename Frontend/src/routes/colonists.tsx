import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal, UserRoundCog, X } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "../components/space-colony/AppShell";
import { PageHeading, ProgressBar, StatusBadge } from "../components/space-colony/Common";
import { buildings, colonists } from "../components/space-colony/data";
import { Button } from "../components/ui/button";
export const Route = createFileRoute("/colonists")({
  head: () => ({
    meta: [
      { title: "Colonists | Space Colony" },
      {
        name: "description",
        content: "Review colonist health, happiness, assignments, and work status.",
      },
      { property: "og:title", content: "Colonists | Space Colony" },
      { property: "og:description", content: "Manage the people of New Horizon Mars colony." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ColonistsPage,
});
function ColonistsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [building, setBuilding] = useState("All buildings");
  const [selected, setSelected] = useState<(typeof colonists)[number] | null>(null);
  const [job, setJob] = useState("Farm");
  const visible = useMemo(
    () =>
      colonists.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) &&
          (status === "All statuses" || c.status === status) &&
          (building === "All buildings" || c.job === building),
      ),
    [query, status, building],
  );
  return (
    <AppShell>
      <PageHeading
        eyebrow="Crew manifest"
        title="Colonists"
        description="Keep every specialist healthy, motivated, and assigned where the colony needs them most."
        action={<StatusBadge tone="info">10 total</StatusBadge>}
      />
      <div className="mb-5 grid gap-3 rounded-md border border-border bg-card p-3 md:grid-cols-[minmax(0,1fr)_180px_180px]">
        <label className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <input
            className="input pl-10"
            placeholder="Search colonists"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="relative">
          <SlidersHorizontal
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={15}
          />
          <select
            className="input pl-9"
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
          >
            <option>All buildings</option>
            {buildings.map((b) => (
              <option key={b.name}>{b.name}</option>
            ))}
          </select>
        </label>
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>All statuses</option>
          <option>Working</option>
          <option>Idle</option>
          <option>Resting</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-md border border-border bg-card">
        <table className="w-full min-w-[760px] text-left">
          <thead className="border-b border-border bg-secondary text-[11px] uppercase text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Colonist</th>
              <th className="px-5 py-3">Health</th>
              <th className="px-5 py-3">Happiness</th>
              <th className="px-5 py-3">Assignment</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((c) => (
              <tr key={c.name} className="border-b border-border last:border-0">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full bg-info/12 text-xs font-bold text-info">
                      {c.initials}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{c.name}</p>
                      <p className="text-xs text-muted-foreground">Age {c.age}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="w-28">
                    <div className="mb-1 flex justify-between text-xs">
                      <span>{c.health}%</span>
                    </div>
                    <ProgressBar value={c.health} tone="positive" />
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="w-28">
                    <div className="mb-1 text-xs">{c.happiness}%</div>
                    <ProgressBar value={c.happiness} tone={c.happiness < 70 ? "warning" : "info"} />
                  </div>
                </td>
                <td className="px-5 py-4 text-sm">{c.job}</td>
                <td className="px-5 py-4">
                  <StatusBadge
                    tone={
                      c.status === "Working"
                        ? "positive"
                        : c.status === "Idle"
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {c.status}
                  </StatusBadge>
                </td>
                <td className="px-5 py-4 text-right">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setSelected(c);
                      setJob(c.job === "Unassigned" ? "Farm" : c.job);
                    }}
                  >
                    <UserRoundCog size={14} />
                    Assign
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-overlay p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="assign-title"
            className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-panel"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-primary">Work assignment</p>
                <h2 id="assign-title" className="mt-1 text-xl font-semibold">
                  Assign {selected.name}
                </h2>
              </div>
              <Button
                aria-label="Close dialog"
                variant="ghost"
                size="icon"
                onClick={() => setSelected(null)}
              >
                <X size={18} />
              </Button>
            </div>
            <label className="text-xs text-muted-foreground">
              Building
              <select className="input mt-2" value={job} onChange={(e) => setJob(e.target.value)}>
                {buildings
                  .filter((b) => b.workers !== "0 / 0")
                  .map((b) => (
                    <option key={b.name}>{b.name}</option>
                  ))}
              </select>
            </label>
            <div className="mt-4 rounded-md bg-secondary p-4 text-sm">
              <p className="font-semibold">{job}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Assignment begins immediately. Current production will be recalculated.
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setSelected(null)}>
                Cancel
              </Button>
              <Button onClick={() => setSelected(null)}>Confirm assignment</Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
