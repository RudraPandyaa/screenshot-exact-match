import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { INITIAL_REQUESTS, INITIAL_SECRETS, PROJECTS } from "@/data/mock";
import type { AccessRequest, RequestStatus, Secret } from "@/types";

interface WorkspaceState {
  projectId: string;
  setProjectId: (id: string) => void;
  secrets: Secret[];
  upsertSecret: (s: Omit<Secret, "id" | "updatedAt" | "updatedBy"> & { id?: string }) => void;
  upsertMany: (items: Omit<Secret, "id" | "updatedAt" | "updatedBy">[]) => number;
  deleteSecret: (id: string) => void;
  requests: AccessRequest[];
  decide: (id: string, status: RequestStatus) => void;
}

const Ctx = createContext<WorkspaceState | null>(null);
const uid = () => Math.random().toString(36).slice(2, 10);

// Local prototype state only — swap for API calls later.
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [projectId, setProjectId] = useState(PROJECTS[0].id);
  const [secrets, setSecrets] = useState<Secret[]>(INITIAL_SECRETS);
  const [requests, setRequests] = useState<AccessRequest[]>(INITIAL_REQUESTS);

  const upsertSecret = useCallback<WorkspaceState["upsertSecret"]>((s) => {
    const meta = { updatedAt: new Date("2026-10-31T07:16:00Z").toISOString(), updatedBy: "Rudra Pandya" };
    setSecrets((prev) =>
      s.id
        ? prev.map((p) => (p.id === s.id ? { ...p, ...s, id: p.id, ...meta } : p))
        : [{ ...s, id: uid(), ...meta }, ...prev],
    );
  }, []);

  const upsertMany = useCallback<WorkspaceState["upsertMany"]>((items) => {
    const meta = { updatedAt: new Date("2026-10-31T07:16:00Z").toISOString(), updatedBy: "Rudra Pandya" };
    setSecrets((prev) => {
      const next = [...prev];
      for (const item of items) {
        const i = next.findIndex((p) => p.key === item.key);
        if (i >= 0) {
          const envs = Array.from(new Set([...next[i].environments, ...item.environments]));
          next[i] = { ...next[i], value: item.value, environments: envs, ...meta };
        } else next.unshift({ ...item, id: uid(), ...meta });
      }
      return next;
    });
    return items.length;
  }, []);

  const deleteSecret = useCallback((id: string) => setSecrets((p) => p.filter((s) => s.id !== id)), []);
  const decide = useCallback(
    (id: string, status: RequestStatus) => setRequests((p) => p.map((r) => (r.id === id ? { ...r, status } : r))),
    [],
  );

  const value = useMemo(
    () => ({ projectId, setProjectId, secrets, upsertSecret, upsertMany, deleteSecret, requests, decide }),
    [projectId, secrets, upsertSecret, upsertMany, deleteSecret, requests, decide],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return ctx;
}
