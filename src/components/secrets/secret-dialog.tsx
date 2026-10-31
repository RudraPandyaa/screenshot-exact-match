import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ENVIRONMENTS } from "@/data/mock";
import { KEY_PATTERN } from "@/lib/format";
import { useWorkspace } from "@/hooks/use-workspace";
import type { EnvironmentId, Secret } from "@/types";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  secret?: Secret | null;
  defaultEnv: EnvironmentId;
  presetKey?: string;
}

export function SecretDialog({ open, onOpenChange, secret, defaultEnv, presetKey }: Props) {
  const { secrets, upsertSecret } = useWorkspace();
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [envs, setEnvs] = useState<EnvironmentId[]>([defaultEnv]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setKey(secret?.key ?? presetKey ?? "");
    setValue(secret?.value ?? "");
    setEnvs(secret?.environments ?? [defaultEnv]);
    setErrors({});
  }, [open, secret, defaultEnv, presetKey]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const k = key.trim();
    if (!k) errs.key = "Variable name is required.";
    else if (!KEY_PATTERN.test(k)) errs.key = "Use UPPER_SNAKE_CASE, starting with a letter.";
    else if (secrets.some((s) => s.key === k && s.id !== secret?.id)) errs.key = "A variable with this name already exists.";
    if (!value.trim()) errs.value = "Value is required.";
    else if (value.length > 4096) errs.value = "Value must be under 4096 characters.";
    if (!envs.length) errs.envs = "Select at least one environment.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    upsertSecret({ id: secret?.id, key: k, value, environments: envs });
    toast.success(secret ? `${k} updated` : `${k} added`);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={submit} noValidate className="space-y-5">
          <DialogHeader>
            <DialogTitle>{secret ? "Edit secret" : "Add secret"}</DialogTitle>
            <DialogDescription>Dummy values only — this prototype does not encrypt anything.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="secret-key">Variable name</Label>
            <Input id="secret-key" value={key} onChange={(e) => setKey(e.target.value.toUpperCase().replace(/\s/g, "_"))} placeholder="DATABASE_URL" className="font-mono" aria-invalid={!!errors.key} aria-describedby="secret-key-err" autoFocus />
            {errors.key && <p id="secret-key-err" className="text-xs text-destructive">{errors.key}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="secret-value">Value</Label>
            <Textarea id="secret-value" value={value} onChange={(e) => setValue(e.target.value)} placeholder="dummy-value" rows={3} className="font-mono text-sm" aria-invalid={!!errors.value} aria-describedby="secret-value-err" />
            {errors.value && <p id="secret-value-err" className="text-xs text-destructive">{errors.value}</p>}
          </div>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Environment scope</legend>
            <div className="flex flex-wrap gap-2">
              {ENVIRONMENTS.map((env) => (
                <label key={env.id} className="flex cursor-pointer items-center gap-2 rounded-md border bg-surface px-3 py-2 text-sm has-[:checked]:border-primary/50">
                  <Checkbox
                    checked={envs.includes(env.id)}
                    onCheckedChange={(c) => setEnvs((p) => (c ? [...p, env.id] : p.filter((x) => x !== env.id)))}
                  />
                  {env.label}
                </label>
              ))}
            </div>
            {errors.envs && <p className="text-xs text-destructive">{errors.envs}</p>}
          </fieldset>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{secret ? "Save changes" : "Add secret"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
