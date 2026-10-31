import { createFileRoute } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, EnvBadge, PageHeader, Panel, ToneBadge, type Tone } from "@/components/common/primitives";
import { TEAM } from "@/data/mock";
import { timeAgo } from "@/lib/format";
import type { Role } from "@/types";
import { toast } from "sonner";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team · EnvHandoff" },
      { name: "description", content: "Team members, roles and environment permissions." },
      { property: "og:title", content: "Team · EnvHandoff" },
      { property: "og:description", content: "Team members, roles and environment permissions." },
    ],
  }),
  component: TeamPage,
});

const roleTone: Record<Role, Tone> = { Owner: "primary", Admin: "info", Developer: "neutral", Viewer: "neutral" };

function TeamPage() {
  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader title="Team" description={`${TEAM.length} members with access to this workspace.`} actions={<Button size="sm" onClick={() => toast("Invites are not available in this prototype.")}><UserPlus /> Invite</Button>} />
      <Panel className="overflow-hidden">
        <ul className="divide-y">
          {TEAM.map((m) => (
            <li key={m.id} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Avatar initials={m.initials} className="size-8" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{m.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{m.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:w-[360px] sm:justify-end">
                <div className="flex gap-1">{m.environments.map((e) => <EnvBadge key={e} env={e} />)}</div>
                <ToneBadge tone={roleTone[m.role]}>{m.role}</ToneBadge>
                <span className="ml-auto w-16 text-right text-xs text-muted-foreground sm:ml-0">{timeAgo(m.lastActive)}</span>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
