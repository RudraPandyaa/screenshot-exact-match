import { useMemo, useState } from "react";
import { FileUp } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ENVIRONMENTS } from "@/data/mock";
import { parseEnv } from "@/lib/format";
import { useWorkspace } from "@/hooks/use-workspace";
import type { EnvironmentId } from "@/types";
import { toast } from "sonner";

const SAMPLE = `# Paste a .env file (dummy values only)
REDIS_URL=redis://cache.internal:6379/0
SENTRY_DSN="https://dummy@o0.ingest.example.test/1"
FEATURE_FLAGS=booking_v2,pet_photos`;

export function ImportEnvDialog({ open, onOpenChange, env }: { open: boolean; onOpenChange: (o: boolean) => void; env: EnvironmentId }) {
  const { upsertMany } = useWorkspace();
  const [text, setText] = useState("");
  const parsed = useMemo(() => parseEnv(text), [text]);
  const envLabel = ENVIRONMENTS.find((e) => e.id === env)!.label;

  async function onFile(f?: File) {
    if (!f) return;
    if (f.size > 64_000) return toast.error("File is too large (max 64 KB).");
    setText(await f.text());
  }

  function submit() {
    if (!parsed.entries.length) return toast.error("No valid KEY=VALUE lines found.");
    const n = upsertMany(parsed.entries.map((e) => ({ ...e, environments: [env] })));
    toast.success(`Imported ${n} variable${n === 1 ? "" : "s"} into ${envLabel}`);
    setText("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Import .env into {envLabel}</DialogTitle>
          <DialogDescription>Existing variables with the same name are overwritten.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="env-text">File contents</Label>
            <div className="flex gap-1">
              <Button type="button" size="sm" variant="ghost" onClick={() => setText(SAMPLE)}>Use sample</Button>
              <Button type="button" size="sm" variant="outline" asChild>
                <label className="cursor-pointer">
                  <FileUp /> Choose file
                  <input type="file" accept=".env,text/plain" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
                </label>
              </Button>
            </div>
          </div>
          <Textarea id="env-text" value={text} onChange={(e) => setText(e.target.value)} rows={9} placeholder="KEY=value" className="font-mono text-xs" />
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span><b className="text-foreground tabular-nums">{parsed.entries.length}</b> valid</span>
            {parsed.errors.length > 0 && <span className="text-warning">Skipping invalid line{parsed.errors.length > 1 ? "s" : ""} {parsed.errors.join(", ")}</span>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={!parsed.entries.length}>Import {parsed.entries.length || ""}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
