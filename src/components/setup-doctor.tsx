import { useState } from "react";
import { CheckCircle2, CircleAlert, Stethoscope, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Panel, ToneBadge, type Tone } from "@/components/common/primitives";
import { ENVIRONMENTS, REQUIRED_VARIABLES } from "@/data/mock";
import { completeness, missingFor } from "@/lib/format";
import { useWorkspace } from "@/hooks/use-workspace";
import type { EnvironmentId } from "@/types";
import { cn } from "@/lib/utils";

export function SetupDoctor({ env, onFix }: { env: EnvironmentId; onFix: (key: string) => void }) {
  const { secrets } = useWorkspace();
  const [open, setOpen] = useState(false);
  const missing = missingFor(env, secrets, REQUIRED_VARIABLES);
  const pct = completeness(env, secrets, REQUIRED_VARIABLES);
  const tone: Tone = pct === 100 ? "success" : pct >= 75 ? "warning" : "danger";
  const label = ENVIRONMENTS.find((e) => e.id === env)!.label;
  const bar = { success: "bg-success", warning: "bg-warning", danger: "bg-destructive" }[tone as "success"];

  return (
    <Panel className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg border bg-accent text-primary"><Stethoscope className="size-5" /></span>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold">Setup Doctor</h2>
            <ToneBadge tone={tone}>{pct === 100 ? "Healthy" : `${missing.length} missing`}</ToneBadge>
          </div>
          <p className="text-xs text-muted-foreground">
            {pct === 100 ? `All required variables are set for ${label}.` : `${label} is missing ${missing.length} required variable${missing.length > 1 ? "s" : ""}.`}
          </p>
        </div>
      </div>
      <div className="flex flex-1 items-center gap-3 sm:justify-end">
        <div className="flex-1 sm:max-w-48">
          <div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">Config health</span><span className="font-medium tabular-nums">{pct}%</span></div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Configuration health">
            <div className={cn("h-full rounded-full transition-all duration-500", bar)} style={{ width: `${pct}%` }} />
          </div>
        </div>
        <Button size="sm" variant={missing.length ? "default" : "outline"} onClick={() => setOpen(true)}><Wrench /> Inspect & Fix</Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Setup Doctor · {label}</SheetTitle>
            <SheetDescription>Required variables checked against a dummy project manifest.</SheetDescription>
          </SheetHeader>
          <ul className="space-y-1.5 overflow-y-auto px-4 pb-6">
            {REQUIRED_VARIABLES.filter((r) => r.environments.includes(env)).map((r) => {
              const isMissing = missing.some((m) => m.key === r.key);
              return (
                <li key={r.key} className="flex items-center gap-3 rounded-md border bg-surface px-3 py-2.5">
                  {isMissing ? <CircleAlert className="size-4 shrink-0 text-destructive" /> : <CheckCircle2 className="size-4 shrink-0 text-success" />}
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-mono text-xs font-medium">{r.key}</div>
                    <div className="text-xs text-muted-foreground">{r.description}</div>
                  </div>
                  {isMissing && <Button size="sm" variant="outline" onClick={() => { setOpen(false); onFix(r.key); }}>Add</Button>}
                </li>
              );
            })}
          </ul>
        </SheetContent>
      </Sheet>
    </Panel>
  );
}
