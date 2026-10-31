import { ENVIRONMENTS } from "@/data/mock";
import type { EnvironmentId } from "@/types";
import { cn } from "@/lib/utils";
import { StatusDot, envTone } from "./primitives";

export function EnvTabs({ value, onChange, counts }: { value: EnvironmentId; onChange: (e: EnvironmentId) => void; counts?: Record<EnvironmentId, number> }) {
  return (
    <div role="tablist" aria-label="Environment" className="scrollbar-none -mx-1 flex overflow-x-auto px-1">
      <div className="inline-flex gap-1 rounded-lg border bg-surface p-1">
        {ENVIRONMENTS.map((e) => {
          const active = e.id === value;
          return (
            <button
              key={e.id}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(e.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active ? "bg-secondary text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <StatusDot tone={envTone[e.id]} />
              {e.label}
              {counts && <span className="rounded bg-muted px-1.5 text-[11px] tabular-nums text-muted-foreground">{counts[e.id]}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
