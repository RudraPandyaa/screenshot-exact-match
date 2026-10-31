import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, FileUp, KeyRound, Plus, Search, ShieldCheck, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EnvTabs } from "@/components/common/env-tabs";
import { Panel, PageHeader, StatCard, StatusDot, ToneBadge } from "@/components/common/primitives";
import { SecretsTable, type LoadStatus } from "@/components/secrets/secrets-table";
import { SecretDialog } from "@/components/secrets/secret-dialog";
import { ImportEnvDialog } from "@/components/secrets/import-env-dialog";
import { SetupDoctor } from "@/components/setup-doctor";
import { AccessRequestCard } from "@/components/requests/access-request-card";
import { ENVIRONMENTS, PROJECTS, REQUIRED_VARIABLES, TEAM } from "@/data/mock";
import { completeness } from "@/lib/format";
import { useWorkspace } from "@/hooks/use-workspace";
import type { EnvironmentId, Secret } from "@/types";

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): { q?: string } => (typeof s.q === "string" && s.q ? { q: s.q } : {}),
  head: () => ({
    meta: [
      { title: "Dashboard · EnvHandoff" },
      { name: "description", content: "Secrets, setup health and pending access requests for your project." },
      { property: "og:title", content: "Dashboard · EnvHandoff" },
      { property: "og:description", content: "Secrets, setup health and pending access requests for your project." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { q } = Route.useSearch();
  const { secrets, requests, projectId } = useWorkspace();
  const project = PROJECTS.find((p) => p.id === projectId)!;
  const [env, setEnv] = useState<EnvironmentId>("development");
  const [query, setQuery] = useState(q ?? "");
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [attempt, setAttempt] = useState(0);
  const [editing, setEditing] = useState<Secret | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  useEffect(() => setQuery(q ?? ""), [q]);

  // Simulated fetch on env switch. The first retry after a "?fail" query shows the error state.
  useEffect(() => {
    setStatus("loading");
    const t = setTimeout(() => setStatus(query === "?fail" && attempt === 0 ? "error" : "ready"), 450);
    return () => clearTimeout(t);
  }, [env, attempt]); // eslint-disable-line react-hooks/exhaustive-deps

  const envSecrets = useMemo(() => secrets.filter((s) => s.environments.includes(env)), [secrets, env]);
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term || term === "?fail") return envSecrets;
    return envSecrets.filter((s) => s.key.toLowerCase().includes(term));
  }, [envSecrets, query]);
  const counts = Object.fromEntries(ENVIRONMENTS.map((e) => [e.id, secrets.filter((s) => s.environments.includes(e.id)).length])) as Record<EnvironmentId, number>;
  const pending = requests.filter((r) => r.status === "pending");
  const avgHealth = Math.round(ENVIRONMENTS.reduce((a, e) => a + completeness(e.id, secrets, REQUIRED_VARIABLES), 0) / ENVIRONMENTS.length);
  const healthTone = avgHealth === 100 ? "success" : avgHealth >= 75 ? "warning" : "danger";

  const openAdd = (key?: string) => {
    setEditing(key ? ({ id: "", key, value: "", environments: [env], updatedAt: "", updatedBy: "" } as Secret) : null);
    setDialogOpen(true);
  };

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        eyebrow={<ToneBadge tone={healthTone}><StatusDot tone={healthTone} /> {avgHealth === 100 ? "Healthy" : avgHealth >= 75 ? "Needs attention" : "At risk"}</ToneBadge>}
        title={project.name}
        description={project.description}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}><FileUp /> Import .env</Button>
            <Button size="sm" onClick={() => openAdd()}><Plus /> Add secret</Button>
          </>
        }
      />

      <EnvTabs value={env} onChange={setEnv} counts={counts} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total secrets" value={secrets.length} hint={`${counts[env]} in ${env}`} icon={KeyRound} tone="primary" />
        <StatCard label="Team members" value={TEAM.length} hint="2 admins" icon={Users} />
        <StatCard label="Pending requests" value={pending.length} hint={pending.length ? "Awaiting review" : "Nothing to review"} icon={ShieldCheck} tone={pending.length ? "warning" : "neutral"} />
        <StatCard label="Config completeness" value={`${completeness(env, secrets, REQUIRED_VARIABLES)}%`} hint={`Across all envs: ${avgHealth}%`} icon={Activity} tone={healthTone} />
      </div>

      <SetupDoctor env={env} onFix={openAdd} />

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <Panel className="min-w-0 overflow-hidden">
          <div className="flex flex-col gap-3 border-b p-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="px-1 text-sm font-semibold">Secrets <span className="font-normal text-muted-foreground">· {ENVIRONMENTS.find((e) => e.id === env)!.label}</span></h2>
            <div className="relative sm:w-64">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input aria-label="Filter secrets" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter by name…" className="h-8 bg-surface pl-8 pr-8 font-mono text-xs" />
              {query && (
                <button aria-label="Clear filter" onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="size-3.5" /></button>
              )}
            </div>
          </div>
          <SecretsTable
            secrets={visible}
            status={status}
            filtered={!!query.trim()}
            onRetry={() => setAttempt((a) => a + 1)}
            onEdit={(s) => { setEditing(s); setDialogOpen(true); }}
            emptyAction={<Button size="sm" onClick={() => openAdd()}><Plus /> Add secret</Button>}
          />
        </Panel>

        <Panel className="h-fit">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-sm font-semibold">Access requests</h2>
            <Link to="/access-requests" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-2.5 p-3">
            {pending.length === 0
              ? <p className="py-6 text-center text-sm text-muted-foreground">No pending requests.</p>
              : pending.slice(0, 3).map((r) => <AccessRequestCard key={r.id} request={r} compact />)}
          </div>
        </Panel>
      </div>

      <SecretDialog open={dialogOpen} onOpenChange={setDialogOpen} secret={editing?.id ? editing : null} defaultEnv={env} key={editing?.key ?? "new"} />
      {editing && !editing.id && dialogOpen && null}
      <ImportEnvDialog open={importOpen} onOpenChange={setImportOpen} env={env} />
    </div>
  );
}
