import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FolderGit2, KeyRound, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel, StatusDot, ToneBadge } from "@/components/common/primitives";
import { PROJECTS } from "@/data/mock";
import { timeAgo } from "@/lib/format";
import { useWorkspace } from "@/hooks/use-workspace";
import { toast } from "sonner";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects · EnvHandoff" },
      { name: "description", content: "All projects in your workspace with secret counts and config health." },
      { property: "og:title", content: "Projects · EnvHandoff" },
      { property: "og:description", content: "All projects in your workspace with secret counts and config health." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { projectId, setProjectId } = useWorkspace();
  const navigate = useNavigate();
  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader title="Projects" description="Each project has its own secrets, team access and environments." actions={<Button size="sm" onClick={() => toast("Creating projects is not available in this prototype.")}><Plus /> New project</Button>} />
      <div className="grid gap-3 sm:grid-cols-2">
        {PROJECTS.map((p) => {
          const tone = p.health === 100 ? "success" : p.health >= 75 ? "warning" : "danger";
          return (
            <Panel key={p.id} className="flex flex-col p-4">
              <div className="flex items-start gap-3">
                <span className="grid size-9 place-items-center rounded-md border bg-accent"><FolderGit2 className="size-4 text-primary" /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-sm font-semibold">{p.name}</h2>
                    {p.id === projectId && <ToneBadge tone="primary">Active</ToneBadge>}
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">{p.slug}</p>
                </div>
                <ToneBadge tone={tone}><StatusDot tone={tone} /> {p.health}%</ToneBadge>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{p.description}</p>
              <div className="mt-4 flex items-center gap-4 border-t pt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><KeyRound className="size-3.5" /> {p.secrets}</span>
                <span className="flex items-center gap-1"><Users className="size-3.5" /> {p.members}</span>
                <span>Updated {timeAgo(p.updatedAt)}</span>
                <Button size="sm" variant="ghost" className="ml-auto h-7" onClick={() => { setProjectId(p.id); navigate({ to: "/" }); }}>Open</Button>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
