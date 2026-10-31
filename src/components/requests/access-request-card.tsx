import { useState } from "react";
import { Check, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Avatar, EnvBadge, ToneBadge } from "@/components/common/primitives";
import { TEAM } from "@/data/mock";
import { timeAgo, timeUntil } from "@/lib/format";
import { useWorkspace } from "@/hooks/use-workspace";
import type { AccessRequest } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function AccessRequestCard({ request, compact }: { request: AccessRequest; compact?: boolean }) {
  const { decide } = useWorkspace();
  const [details, setDetails] = useState(false);
  const [confirm, setConfirm] = useState<"approved" | "rejected" | null>(null);
  const m = TEAM.find((t) => t.id === request.memberId)!;
  const pending = request.status === "pending";
  const expiry = timeUntil(request.expiresAt);
  const urgent = pending && /in \d+h|in \d+m/.test(expiry);

  return (
    <article className="rounded-lg border bg-surface p-3.5">
      <button className="flex w-full items-start gap-3 text-left focus-visible:outline-none" onClick={() => setDetails(true)} aria-label={`Open request from ${m.name}`}>
        <Avatar initials={m.initials} className="size-8" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 text-sm">
            <span className="font-medium">{m.name}</span>
            <span className="text-muted-foreground">wants</span>
            <ToneBadge tone="primary" className="capitalize">{request.permission}</ToneBadge>
            <EnvBadge env={request.environment} />
          </div>
          <p className={cn("mt-1 text-xs text-muted-foreground", compact ? "line-clamp-1" : "line-clamp-2")}>{request.justification}</p>
          <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span>{timeAgo(request.requestedAt)}</span>
            <span className={cn("flex items-center gap-1", urgent && "text-warning")}><Clock className="size-3" /> Expires {expiry}</span>
          </div>
        </div>
      </button>
      <div className="mt-3 flex justify-end gap-2">
        {pending ? (
          <>
            <Button size="sm" variant="outline" onClick={() => setConfirm("rejected")}><X /> Reject</Button>
            <Button size="sm" onClick={() => setConfirm("approved")}><Check /> Approve</Button>
          </>
        ) : (
          <ToneBadge tone={request.status === "approved" ? "success" : "danger"} className="capitalize">{request.status}</ToneBadge>
        )}
      </div>

      <Dialog open={details} onOpenChange={setDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Access request</DialogTitle>
            <DialogDescription>Prototype only — approving does not grant real access.</DialogDescription>
          </DialogHeader>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-sm">
            <dt className="text-muted-foreground">Member</dt><dd>{m.name} <span className="text-muted-foreground">· {m.role}</span></dd>
            <dt className="text-muted-foreground">Environment</dt><dd><EnvBadge env={request.environment} /></dd>
            <dt className="text-muted-foreground">Permission</dt><dd className="capitalize">{request.permission}</dd>
            <dt className="text-muted-foreground">Requested</dt><dd>{timeAgo(request.requestedAt)}</dd>
            <dt className="text-muted-foreground">Expires</dt><dd>{expiry}</dd>
            <dt className="text-muted-foreground">Justification</dt><dd className="leading-relaxed">{request.justification}</dd>
          </dl>
          {pending && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirm("rejected")}>Reject</Button>
              <Button onClick={() => setConfirm("approved")}>Approve</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirm === "approved" ? "Approve" : "Reject"} {request.permission} access for {m.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirm === "approved"
                ? `${m.name.split(" ")[0]} would get ${request.permission} access to ${request.environment} until the request expires.`
                : `${m.name.split(" ")[0]} will be notified that the request was declined.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={confirm === "rejected" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : undefined}
              onClick={() => {
                if (!confirm) return;
                decide(request.id, confirm);
                setDetails(false);
                toast.success(`Request ${confirm}`, { description: `${m.name} · ${request.environment}` });
              }}
            >{confirm === "approved" ? "Approve" : "Reject"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </article>
  );
}
