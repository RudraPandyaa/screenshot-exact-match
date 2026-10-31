import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronsUpDown, FolderGit2, KeyRound, LayoutDashboard, ScrollText, Settings, ShieldCheck, Users } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PROJECTS } from "@/data/mock";
import { useWorkspace } from "@/hooks/use-workspace";

const NAV = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Projects", url: "/projects", icon: FolderGit2 },
  { title: "Access Requests", url: "/access-requests", icon: ShieldCheck, badge: true },
  { title: "Team", url: "/team", icon: Users },
  { title: "Audit Logs", url: "/audit-logs", icon: ScrollText },
  { title: "Settings", url: "/settings", icon: Settings },
] as const;

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { projectId, setProjectId, requests } = useWorkspace();
  const project = PROJECTS.find((p) => p.id === projectId)!;
  const pending = requests.filter((r) => r.status === "pending").length;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-3">
        <div className="flex items-center gap-2 px-1 pt-1">
          <span className="grid size-7 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground"><KeyRound className="size-4" /></span>
          <span className="font-semibold tracking-tight group-data-[collapsible=icon]:hidden">EnvHandoff</span>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="border bg-surface" aria-label="Switch project" tooltip={project.name}>
                  <span className="grid size-7 shrink-0 place-items-center rounded-md bg-accent text-xs font-semibold">{project.name[0]}</span>
                  <span className="flex min-w-0 flex-col text-left leading-tight">
                    <span className="text-[11px] text-muted-foreground">Acme Pets workspace</span>
                    <span className="truncate text-sm font-medium">{project.name}</span>
                  </span>
                  <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-60">
                <DropdownMenuLabel>Projects</DropdownMenuLabel>
                {PROJECTS.map((p) => (
                  <DropdownMenuItem key={p.id} onSelect={() => setProjectId(p.id)}>
                    {p.name}
                    {p.id === projectId && <span className="ml-auto text-xs text-primary">Active</span>}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/projects">View all projects</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => {
                const active = item.url === "/" ? path === "/" : path.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {"badge" in item && pending > 0 && <SidebarMenuBadge className="text-primary">{pending}</SidebarMenuBadge>}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <p className="rounded-md border border-dashed px-2 py-2 text-[11px] leading-snug text-muted-foreground group-data-[collapsible=icon]:hidden">
          Prototype — dummy data only. No real encryption or authorization.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
