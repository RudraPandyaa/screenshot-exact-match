import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ENVIRONMENTS } from "@/data/mock";
import type { EnvironmentId } from "@/types";

export type Tone = "neutral" | "primary" | "success" | "warning" | "danger" | "info";

const toneClass: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  primary: "bg-primary/12 text-primary border-primary/25",
  success: "bg-success/12 text-success border-success/25",
  warning: "bg-warning/12 text-warning border-warning/25",
  danger: "bg-destructive/12 text-destructive border-destructive/25",
  info: "bg-info/12 text-info border-info/25",
};

export function ToneBadge({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium leading-none", toneClass[tone], className)}>
      {children}
    </span>
  );
}

export const envTone: Record<EnvironmentId, Tone> = { development: "info", staging: "warning", production: "danger" };

export function EnvBadge({ env }: { env: EnvironmentId }) {
  const e = ENVIRONMENTS.find((x) => x.id === env)!;
  return <ToneBadge tone={envTone[env]} className="font-mono">{e.short}</ToneBadge>;
}

export function StatusDot({ tone }: { tone: Tone }) {
  const c = { neutral: "bg-muted-foreground", primary: "bg-primary", success: "bg-success", warning: "bg-warning", danger: "bg-destructive", info: "bg-info" }[tone];
  return <span className={cn("inline-block size-2 shrink-0 rounded-full", c)} aria-hidden />;
}

export function PageHeader({ title, description, actions, eyebrow }: { title: string; description?: string; actions?: ReactNode; eyebrow?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="mb-1.5">{eyebrow}</div>}
        <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-lg border bg-card", className)}>{children}</section>;
}

export function StatCard({ label, value, hint, icon: Icon, tone = "neutral" }: { label: string; value: ReactNode; hint?: ReactNode; icon: LucideIcon; tone?: Tone }) {
  return (
    <Panel className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className={cn("grid size-7 place-items-center rounded-md border", toneClass[tone])}>
          <Icon className="size-3.5" />
        </span>
      </div>
      <div className="mt-3 text-2xl font-semibold tabular-nums tracking-tight">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </Panel>
  );
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="grid size-10 place-items-center rounded-lg border bg-muted text-muted-foreground"><Icon className="size-5" /></span>
      <h3 className="mt-4 text-sm font-medium">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span className={cn("grid size-7 shrink-0 place-items-center rounded-full border bg-accent text-[11px] font-medium text-accent-foreground", className)}>
      {initials}
    </span>
  );
}
