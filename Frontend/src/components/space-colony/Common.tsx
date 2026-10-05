import { CheckCircle2, Clock3 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="min-w-0">
        <p className="mb-2 text-xs font-bold uppercase text-primary">{eyebrow}</p>
        <h1 className="truncate text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="min-w-0">
        <h2 className="truncate text-lg font-semibold">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function ProgressBar({
  value,
  tone = "primary",
  label,
}: {
  value: number;
  tone?: string;
  label?: string;
}) {
  return (
    <div
      aria-label={label}
      role="progressbar"
      aria-valuenow={value}
      className="h-1.5 overflow-hidden rounded-full bg-track"
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width]",
          tone === "positive" && "bg-positive",
          tone === "warning" && "bg-warning",
          tone === "danger" && "bg-destructive",
          tone === "info" && "bg-info",
          tone === "cyan" && "bg-cyan",
          tone === "iron" && "bg-iron",
          tone === "primary" && "bg-primary",
        )}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "positive" | "warning" | "danger" | "info" | "neutral";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold",
        tone === "positive" && "bg-positive/12 text-positive",
        tone === "warning" && "bg-warning/12 text-warning",
        tone === "danger" && "bg-destructive/12 text-destructive",
        tone === "info" && "bg-info/12 text-info",
        tone === "neutral" && "bg-muted text-muted-foreground",
      )}
    >
      {tone === "positive" ? (
        <CheckCircle2 size={11} />
      ) : tone === "warning" ? (
        <Clock3 size={11} />
      ) : null}
      {children}
    </span>
  );
}

export function Metric({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 text-sm font-semibold",
          tone === "positive" && "text-positive",
          tone === "warning" && "text-warning",
          tone === "danger" && "text-destructive",
        )}
      >
        {value}
      </p>
    </div>
  );
}
