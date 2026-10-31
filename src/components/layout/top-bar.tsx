import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Search, Settings, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, StatusDot } from "@/components/common/primitives";
import { CURRENT_USER, TEAM } from "@/data/mock";
import { useWorkspace } from "@/hooks/use-workspace";
import { timeAgo } from "@/lib/format";
import { toast } from "sonner";

export function TopBar() {
  const navigate = useNavigate();
  const { requests } = useWorkspace();
  const [q, setQ] = useState("");
  const pending = requests.filter((r) => r.status === "pending");

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/85 px-3 backdrop-blur sm:px-4">
      <SidebarTrigger aria-label="Toggle sidebar" />
      <form
        className="relative ml-1 hidden max-w-md flex-1 sm:block"
        onSubmit={(e) => { e.preventDefault(); navigate({ to: "/", search: { q } }); }}
      >
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input aria-label="Search secrets" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search secrets…" className="h-8 bg-surface pl-8" />
        <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border px-1.5 font-mono text-[10px] text-muted-foreground md:block">↵</kbd>
      </form>
      <div className="ml-auto flex items-center gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={`Notifications, ${pending.length} unread`} className="relative">
              <Bell className="size-4" />
              {pending.length > 0 && <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="border-b px-3 py-2 text-sm font-medium">Notifications</div>
            {pending.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">You're all caught up.</p>
            ) : (
              <ul className="divide-y">
                {pending.map((r) => {
                  const m = TEAM.find((t) => t.id === r.memberId)!;
                  return (
                    <li key={r.id}>
                      <button className="flex w-full gap-2.5 px-3 py-2.5 text-left text-sm hover:bg-muted" onClick={() => navigate({ to: "/access-requests" })}>
                        <StatusDot tone="primary" />
                        <span className="min-w-0">
                          <span className="block"><b className="font-medium">{m.name}</b> requested {r.permission} on {r.environment}</span>
                          <span className="text-xs text-muted-foreground">{timeAgo(r.requestedAt)}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-1.5" aria-label="User menu">
              <Avatar initials={CURRENT_USER.initials} />
              <span className="hidden text-sm md:inline">{CURRENT_USER.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="text-sm font-medium">{CURRENT_USER.name}</div>
              <div className="text-xs text-muted-foreground">{CURRENT_USER.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate({ to: "/team" })}><User /> Profile</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigate({ to: "/settings" })}><Settings /> Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => toast("Sign-out is not available in this prototype.")}><LogOut /> Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
