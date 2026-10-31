export type EnvironmentId = "development" | "staging" | "production";

export interface Environment {
  id: EnvironmentId;
  label: string;
  short: string;
}

export interface Secret {
  id: string;
  key: string;
  value: string;
  environments: EnvironmentId[];
  updatedAt: string;
  updatedBy: string;
}

export type Permission = "read" | "write" | "admin";
export type RequestStatus = "pending" | "approved" | "rejected";

export interface AccessRequest {
  id: string;
  memberId: string;
  environment: EnvironmentId;
  permission: Permission;
  justification: string;
  requestedAt: string;
  expiresAt: string;
  status: RequestStatus;
}

export type Role = "Owner" | "Admin" | "Developer" | "Viewer";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  initials: string;
  lastActive: string;
  environments: EnvironmentId[];
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  secrets: number;
  members: number;
  health: number;
  updatedAt: string;
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  target: string;
  environment: EnvironmentId | null;
  at: string;
  kind: "create" | "update" | "delete" | "access" | "auth";
}

export interface RequiredVariable {
  key: string;
  description: string;
  environments: EnvironmentId[];
}
