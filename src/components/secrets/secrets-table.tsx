import { useState } from "react";
import { AlertTriangle, Copy, Eye, EyeOff, KeyRound, MoreHorizontal, Pencil, RotateCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { EmptyState, EnvBadge } from "@/components/common/primitives";
import { mask, timeAgo } from "@/lib/format";
import { useWorkspace } from "@/hooks/use-workspace";
import type { Secret } from "@/types";
import { toast } from "sonner";

export type LoadStatus = "loading" | "error" | "ready";

interface Props {
  secrets: Secret[];
  status: LoadStatus;
  onRetry: () => void;
  onEdit: (s: Secret) => void;
  emptyAction?: React.ReactNode;
  filtered: boolean;
}

export function SecretsTable({ secrets, status, onRetry, onEdit, emptyAction, filtered }: Props) {
  const { deleteSecret } = useWorkspace();
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [toDelete, setToDelete] = useState<Secret | null>(null);

  const toggle = (id: string) => setRevealed((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const copy = async (s: Secret) => {
    try { await navigator.clipboard.writeText(s.value); toast.success(`Copied ${s.key}`); }
    catch { toast.error("Clipboard not available"); }
  };

  if (status === "loading")
    return (
      <div className="divide-y" aria-busy="true" aria-label="Loading secrets">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3.5">
            <Skeleton className="h-4 w-40" /><Skeleton className="h-4 flex-1" /><Skeleton className="hidden h-4 w-20 md:block" />
          </div>
        ))}
      </div>
    );

  if (status === "error")
    return <EmptyState icon={AlertTriangle} title="Couldn't load secrets" description="The (simulated) request timed out. Your data is safe." action={<Button size="sm" variant="outline" onClick={onRetry}><RotateCw /> Retry</Button>} />;

  if (!secrets.length)
    return filtered
      ? <EmptyState icon={KeyRound} title="No matching secrets" description="Try a different search or clear the filter." />
      : <EmptyState icon={KeyRound} title="No secrets in this environment" description="Add one manually or import an existing .env file." action={emptyAction} />;

  const Actions = ({ s }: { s: Secret }) => (
    <div className="flex items-center justify-end gap-0.5">
      <Button size="icon" variant="ghost" className="size-8" aria-label={revealed.has(s.id) ? `Hide ${s.key}` : `Reveal ${s.key}`} onClick={() => toggle(s.id)}>
        {revealed.has(s.id) ? <EyeOff /> : <Eye />}
      </Button>
      <Button size="icon" variant="ghost" className="size-8" aria-label={`Copy ${s.key}`} onClick={() => copy(s)}><Copy /></Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className="size-8" aria-label={`More actions for ${s.key}`}><MoreHorizontal /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => onEdit(s)}><Pencil /> Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => setToDelete(s)}><Trash2 /> Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const Value = ({ s }: { s: Secret }) => (
    <code className="block truncate font-mono text-xs text-muted-foreground">{revealed.has(s.id) ? s.value : mask(s.value)}</code>
  );

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Variable</th>
              <th className="px-4 py-2.5 font-medium">Value</th>
              <th className="px-4 py-2.5 font-medium">Last updated</th>
              <th className="px-4 py-2.5 font-medium">Scope</th>
              <th className="px-4 py-2.5"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {secrets.map((s) => (
              <tr key={s.id} className="group transition-colors hover:bg-muted/40">
                <td className="px-4 py-2.5 font-mono text-[13px] font-medium">{s.key}</td>
                <td className="max-w-[260px] px-4 py-2.5"><Value s={s} /></td>
                <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">{timeAgo(s.updatedAt)} · {s.updatedBy.split(" ")[0]}</td>
                <td className="px-4 py-2.5"><div className="flex gap-1">{s.environments.map((e) => <EnvBadge key={e} env={e} />)}</div></td>
                <td className="px-2 py-1.5"><Actions s={s} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile cards */}
      <ul className="divide-y md:hidden">
        {secrets.map((s) => (
          <li key={s.id} className="space-y-2 px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <span className="break-all font-mono text-[13px] font-medium">{s.key}</span>
              <Actions s={s} />
            </div>
            <Value s={s} />
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-1">{s.environments.map((e) => <EnvBadge key={e} env={e} />)}</div>
              <span className="text-xs text-muted-foreground">{timeAgo(s.updatedAt)}</span>
            </div>
          </li>
        ))}
      </ul>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {toDelete?.key}?</AlertDialogTitle>
            <AlertDialogDescription>This removes the variable from every environment it's scoped to. Dummy data — nothing real is affected.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { if (toDelete) { deleteSecret(toDelete.id); toast.success(`${toDelete.key} deleted`); } setToDelete(null); }}
            >Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
