import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Inbox } from "lucide-react";
import { EmptyState, PageHeader, Panel } from "@/components/common/primitives";
import { AccessRequestCard } from "@/components/requests/access-request-card";
import { useWorkspace } from "@/hooks/use-workspace";
import type { RequestStatus } from "@/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/access-requests")({
  head: () => ({
    meta: [
      { title: "Access Requests · EnvHandoff" },
      { name: "description", content: "Review and decide on team requests for environment access." },
      { property: "og:title", content: "Access Requests · EnvHandoff" },
      { property: "og:description", content: "Review and decide on team requests for environment access." },
    ],
  }),
  component: RequestsPage,
});

const FILTERS: { id: RequestStatus | "all"; label: string }[] = [
  { id: "pending", label: "Pending" }, { id: "approved", label: "Approved" }, { id: "rejected", label: "Rejected" }, { id: "all", label: "All" },
];

function RequestsPage() {
  const { requests } = useWorkspace();
  const [filter, setFilter] = useState<RequestStatus | "all">("pending");
  const list = requests.filter((r) => filter === "all" || r.status === filter);
  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader title="Access Requests" description="Sensitive access is time-boxed and requires a justification." />
      <div role="tablist" aria-label="Filter requests" className="scrollbar-none flex gap-1 overflow-x-auto">
        {FILTERS.map((f) => (
          <button key={f.id} role="tab" aria-selected={filter === f.id} onClick={() => setFilter(f.id)}
            className={cn("shrink-0 rounded-md border px-3 py-1.5 text-sm", filter === f.id ? "border-primary/40 bg-accent text-foreground" : "bg-surface text-muted-foreground hover:text-foreground")}>
            {f.label} <span className="ml-1 tabular-nums text-muted-foreground">{requests.filter((r) => f.id === "all" || r.status === f.id).length}</span>
          </button>
        ))}
      </div>
      <Panel className="p-3">
        {list.length === 0
          ? <EmptyState icon={Inbox} title="Nothing here" description="No requests match this filter." />
          : <div className="grid gap-2.5 lg:grid-cols-2">{list.map((r) => <AccessRequestCard key={r.id} request={r} />)}</div>}
      </Panel>
    </div>
  );
}
