import type { EnvironmentId, RequiredVariable, Secret } from "@/types";

const NOW = new Date("2026-10-31T07:16:00Z").getTime();

export function timeAgo(iso: string): string {
  const diff = Math.round((NOW - new Date(iso).getTime()) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff}m ago`;
  const h = Math.round(diff / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export function timeUntil(iso: string): string {
  const diff = Math.round((new Date(iso).getTime() - NOW) / 60000);
  if (diff <= 0) return "expired";
  if (diff < 60) return `in ${diff}m`;
  const h = Math.round(diff / 60);
  if (h < 24) return `in ${h}h`;
  return `in ${Math.round(h / 24)}d`;
}

export const mask = (v: string) => "•".repeat(Math.min(24, Math.max(8, v.length)));

export const KEY_PATTERN = /^[A-Z][A-Z0-9_]*$/;

/** Parses KEY=VALUE lines from a .env file. Ignores comments and blanks. */
export function parseEnv(text: string): { entries: { key: string; value: string }[]; errors: number[] } {
  const entries: { key: string; value: string }[] = [];
  const errors: number[] = [];
  text.split(/\r?\n/).forEach((raw, i) => {
    const line = raw.trim();
    if (!line || line.startsWith("#")) return;
    const m = line.replace(/^export\s+/, "").match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) return errors.push(i + 1);
    entries.push({ key: m[1].toUpperCase(), value: m[2].replace(/^(['"])(.*)\1$/, "$2") });
  });
  return { entries, errors };
}

export function missingFor(env: EnvironmentId, secrets: Secret[], required: RequiredVariable[]) {
  return required
    .filter((r) => r.environments.includes(env))
    .filter((r) => !secrets.some((s) => s.key === r.key && s.environments.includes(env)));
}

export function completeness(env: EnvironmentId, secrets: Secret[], required: RequiredVariable[]) {
  const needed = required.filter((r) => r.environments.includes(env)).length;
  if (!needed) return 100;
  return Math.round(((needed - missingFor(env, secrets, required).length) / needed) * 100);
}
