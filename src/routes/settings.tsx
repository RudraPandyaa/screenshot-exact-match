import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageHeader, Panel } from "@/components/common/primitives";
import { PROJECTS } from "@/data/mock";
import { useWorkspace } from "@/hooks/use-workspace";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · EnvHandoff" },
      { name: "description", content: "Project settings, access policies and prototype options." },
      { property: "og:title", content: "Settings · EnvHandoff" },
      { property: "og:description", content: "Project settings, access policies and prototype options." },
    ],
  }),
  component: SettingsPage,
});

function Row({ id, title, desc, checked, onChange }: { id: string; title: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <div><Label htmlFor={id} className="text-sm">{title}</Label><p className="mt-0.5 text-xs text-muted-foreground">{desc}</p></div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function SettingsPage() {
  const { projectId, simulateErrors, setSimulateErrors } = useWorkspace();
  const project = PROJECTS.find((p) => p.id === projectId)!;
  const [name, setName] = useState(project.name);
  const [prodApproval, setProdApproval] = useState(true);
  const [revealLog, setRevealLog] = useState(true);

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader title="Settings" description="Prototype settings — changes are kept in memory only." />
      <Panel>
        <form className="space-y-3 p-4" onSubmit={(e) => { e.preventDefault(); if (name.trim().length < 3) return toast.error("Name must be at least 3 characters."); toast.success("Project settings saved"); }}>
          <h2 className="text-sm font-semibold">General</h2>
          <div className="max-w-md space-y-2"><Label htmlFor="pname">Project name</Label><Input id="pname" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <Button size="sm" type="submit">Save</Button>
        </form>
      </Panel>
      <Panel className="divide-y">
        <h2 className="px-4 py-3 text-sm font-semibold">Access policy</h2>
        <Row id="prod" title="Require approval for production" desc="Members must request access before reading production values." checked={prodApproval} onChange={setProdApproval} />
        <Row id="reveal" title="Log secret reveals" desc="Record an audit event every time a value is revealed." checked={revealLog} onChange={setRevealLog} />
      </Panel>
      <Panel className="divide-y">
        <h2 className="px-4 py-3 text-sm font-semibold">Prototype</h2>
        <Row id="sim" title="Simulate network errors" desc="Makes the secrets table show its error state on the dashboard." checked={simulateErrors} onChange={setSimulateErrors} />
      </Panel>
    </div>
  );
}
