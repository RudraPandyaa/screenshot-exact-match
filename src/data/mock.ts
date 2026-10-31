// All dummy data lives here so it can later be replaced with API calls.
// None of these values are real credentials.
import type {
  AccessRequest,
  AuditEvent,
  Environment,
  Project,
  RequiredVariable,
  Secret,
  TeamMember,
} from "@/types";

export const ENVIRONMENTS: Environment[] = [
  { id: "development", label: "Development", short: "dev" },
  { id: "staging", label: "Staging", short: "stg" },
  { id: "production", label: "Production", short: "prod" },
];

export const PROJECTS: Project[] = [
  { id: "p1", name: "PetsUpRight Backend", slug: "petsupright-backend", description: "Node API for bookings, payments and pet profiles.", secrets: 14, members: 6, health: 83, updatedAt: "2026-10-31T05:40:00Z" },
  { id: "p2", name: "PetsUpRight Web", slug: "petsupright-web", description: "Customer-facing Next.js storefront.", secrets: 9, members: 4, health: 100, updatedAt: "2026-10-30T14:12:00Z" },
  { id: "p3", name: "Vet Portal", slug: "vet-portal", description: "Internal clinic scheduling tool.", secrets: 11, members: 3, health: 64, updatedAt: "2026-10-28T09:03:00Z" },
  { id: "p4", name: "Notifications Worker", slug: "notifications-worker", description: "Queue consumer for email and SMS.", secrets: 6, members: 2, health: 92, updatedAt: "2026-10-25T18:30:00Z" },
];

export const TEAM: TeamMember[] = [
  { id: "u1", name: "Rudra Pandya", email: "rudra@petsupright.dev", role: "Owner", initials: "RP", lastActive: "2026-10-31T07:00:00Z", environments: ["development", "staging", "production"] },
  { id: "u2", name: "Maya Chen", email: "maya@petsupright.dev", role: "Admin", initials: "MC", lastActive: "2026-10-31T06:12:00Z", environments: ["development", "staging", "production"] },
  { id: "u3", name: "Arjun Mehta", email: "arjun@petsupright.dev", role: "Developer", initials: "AM", lastActive: "2026-10-30T19:40:00Z", environments: ["development", "staging"] },
  { id: "u4", name: "Sofia Rossi", email: "sofia@petsupright.dev", role: "Developer", initials: "SR", lastActive: "2026-10-30T11:05:00Z", environments: ["development"] },
  { id: "u5", name: "Liam O'Brien", email: "liam@petsupright.dev", role: "Developer", initials: "LO", lastActive: "2026-10-29T16:22:00Z", environments: ["development", "staging"] },
  { id: "u6", name: "Priya Nair", email: "priya@petsupright.dev", role: "Viewer", initials: "PN", lastActive: "2026-10-27T10:00:00Z", environments: ["development"] },
];

export const INITIAL_SECRETS: Secret[] = [
  { id: "s1", key: "DATABASE_URL", value: "postgres://app_user:dummy-pass@db.internal:5432/petsupright", environments: ["development", "staging", "production"], updatedAt: "2026-10-31T05:40:00Z", updatedBy: "Maya Chen" },
  { id: "s2", key: "JWT_SECRET", value: "dummy_jwt_9f8a7c6b5e4d3c2b1a", environments: ["development", "staging", "production"], updatedAt: "2026-10-29T12:10:00Z", updatedBy: "Rudra Pandya" },
  { id: "s3", key: "CLOUDINARY_API_SECRET", value: "dummy_cld_x7Yq2LmN0pR4", environments: ["development", "staging", "production"], updatedAt: "2026-10-27T08:22:00Z", updatedBy: "Arjun Mehta" },
  { id: "s4", key: "CLOUDINARY_CLOUD_NAME", value: "petsupright-demo", environments: ["development", "staging", "production"], updatedAt: "2026-10-27T08:20:00Z", updatedBy: "Arjun Mehta" },
  { id: "s5", key: "REDIS_URL", value: "redis://cache.internal:6379/0", environments: ["development", "staging"], updatedAt: "2026-10-26T15:01:00Z", updatedBy: "Liam O'Brien" },
  { id: "s6", key: "STRIPE_SECRET_KEY", value: "sk_test_dummy_000000000000", environments: ["development", "staging"], updatedAt: "2026-10-24T10:44:00Z", updatedBy: "Maya Chen" },
  { id: "s7", key: "STRIPE_WEBHOOK_SECRET", value: "whsec_dummy_abcdef123456", environments: ["production"], updatedAt: "2026-10-23T09:30:00Z", updatedBy: "Maya Chen" },
  { id: "s8", key: "SMTP_HOST", value: "smtp.example.test", environments: ["development", "staging", "production"], updatedAt: "2026-10-20T13:15:00Z", updatedBy: "Sofia Rossi" },
  { id: "s9", key: "SMTP_PASSWORD", value: "dummy-smtp-pass", environments: ["development", "staging"], updatedAt: "2026-10-20T13:16:00Z", updatedBy: "Sofia Rossi" },
  { id: "s10", key: "SENTRY_DSN", value: "https://dummy@o0.ingest.example.test/1", environments: ["staging", "production"], updatedAt: "2026-10-18T17:48:00Z", updatedBy: "Liam O'Brien" },
  { id: "s11", key: "API_BASE_URL", value: "http://localhost:4000", environments: ["development"], updatedAt: "2026-10-15T07:00:00Z", updatedBy: "Arjun Mehta" },
  { id: "s12", key: "LOG_LEVEL", value: "debug", environments: ["development"], updatedAt: "2026-10-12T11:11:00Z", updatedBy: "Priya Nair" },
];

export const REQUIRED_VARIABLES: RequiredVariable[] = [
  { key: "DATABASE_URL", description: "Primary Postgres connection", environments: ["development", "staging", "production"] },
  { key: "JWT_SECRET", description: "Token signing key", environments: ["development", "staging", "production"] },
  { key: "CLOUDINARY_API_SECRET", description: "Media uploads", environments: ["development", "staging", "production"] },
  { key: "REDIS_URL", description: "Session cache", environments: ["development", "staging", "production"] },
  { key: "STRIPE_SECRET_KEY", description: "Payments API", environments: ["development", "staging", "production"] },
  { key: "STRIPE_WEBHOOK_SECRET", description: "Payment webhooks", environments: ["staging", "production"] },
  { key: "SMTP_PASSWORD", description: "Transactional email", environments: ["development", "staging", "production"] },
  { key: "SENTRY_DSN", description: "Error tracking", environments: ["staging", "production"] },
];

export const INITIAL_REQUESTS: AccessRequest[] = [
  { id: "r1", memberId: "u3", environment: "production", permission: "read", justification: "Investigating failed payment webhooks reported in ticket PUR-412. Need to verify STRIPE_WEBHOOK_SECRET matches the dashboard.", requestedAt: "2026-10-31T04:10:00Z", expiresAt: "2026-11-01T04:10:00Z", status: "pending" },
  { id: "r2", memberId: "u4", environment: "staging", permission: "write", justification: "Rotating SMTP credentials for the new email provider before Monday's release.", requestedAt: "2026-10-30T16:45:00Z", expiresAt: "2026-11-02T16:45:00Z", status: "pending" },
  { id: "r3", memberId: "u6", environment: "staging", permission: "read", justification: "QA pass on the booking flow needs access to staging API config.", requestedAt: "2026-10-30T09:00:00Z", expiresAt: "2026-10-31T21:00:00Z", status: "pending" },
  { id: "r4", memberId: "u5", environment: "production", permission: "write", justification: "Update SENTRY_DSN after project migration.", requestedAt: "2026-10-28T10:00:00Z", expiresAt: "2026-10-29T10:00:00Z", status: "approved" },
];

export const AUDIT_EVENTS: AuditEvent[] = [
  { id: "a1", actor: "Maya Chen", action: "updated", target: "DATABASE_URL", environment: "production", at: "2026-10-31T05:40:00Z", kind: "update" },
  { id: "a2", actor: "Arjun Mehta", action: "requested read access to", target: "Production", environment: "production", at: "2026-10-31T04:10:00Z", kind: "access" },
  { id: "a3", actor: "Rudra Pandya", action: "revealed", target: "JWT_SECRET", environment: "staging", at: "2026-10-30T22:02:00Z", kind: "access" },
  { id: "a4", actor: "Sofia Rossi", action: "requested write access to", target: "Staging", environment: "staging", at: "2026-10-30T16:45:00Z", kind: "access" },
  { id: "a5", actor: "Liam O'Brien", action: "deleted", target: "LEGACY_S3_BUCKET", environment: "development", at: "2026-10-30T12:30:00Z", kind: "delete" },
  { id: "a6", actor: "Priya Nair", action: "signed in from", target: "new device (Pune, IN)", environment: null, at: "2026-10-30T08:55:00Z", kind: "auth" },
  { id: "a7", actor: "Maya Chen", action: "approved access for", target: "Liam O'Brien", environment: "production", at: "2026-10-28T10:20:00Z", kind: "access" },
  { id: "a8", actor: "Arjun Mehta", action: "created", target: "CLOUDINARY_API_SECRET", environment: "development", at: "2026-10-27T08:22:00Z", kind: "create" },
];

export const CURRENT_USER = TEAM[0];
