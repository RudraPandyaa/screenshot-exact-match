import { createFileRoute } from "@tanstack/react-router";
import { Eye, LogIn, Pencil, Plus, Trash2, type LucideIcon } from "lucide-react";
import { EnvBadge, PageHeader, Panel } from "@/components/common/primitives";
import { AUDIT_EVENTS } from "@/data/mock";
import { timeAgo } from "@/lib/format";
import type { AuditEvent } from "@/types";

export const Route = createFileRoute("/audit-logs")({
  head: () => ({
    meta: [
      { title: "Audit Logs · EnvHandoff" },
      { name: "description", content: "A timeline of secret changes, reveals and access decisions." },
      { property: "og:title", content: "Audit Logs · EnvHandoff" },
      { property: "og:description", content: "A timeline of secret changes, reveals and access decisions." },
    ],
  }),
  component: AuditPage,
});

const icons: Record<AuditEvent["kind"], LucideIcon> = { create: Plus, update: Pencil, delete: Trash2, access: Eye, auth: LogIn };

function AuditPage() {
  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader title="Audit Logs" description="Sample activity for PetsUpRight Backend." />
      <Panel>
        <ol className="divide-y">
          {AUDIT_EVENTS.map((e) => {
            const Icon = icons[e.kind];
            return (
              <li key={e.id} className="flex items-start gap-3 px-4 py-3">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md border bg-surface text-muted-foreground"><Icon className="size-3.5" /></span>
                <div className="min-w-0 flex-1 text-sm">
                  <span className="font-medium">{e.actor}</span> <span className="text-muted-foreground">{e.action}</span>{" "}
                  <span className="font-mono text-[13px]">{e.target}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {e.environment && <EnvBadge env={e.environment} />}
                  <time className="w-14 text-right text-xs text-muted-foreground" dateTime={e.at}>{timeAgo(e.at)}</time>
                </div>
              </li>
            );
          })}
        </ol>
      </Panel>
    </div>
  );
}
