"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Building, Bell, Search, ChevronDown, User, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

const navItems = [
  { href: "/", icon: FileText, label: "Brief" },
  { href: "/properties", icon: Building, label: "Properties" },
  { href: "/alerts", icon: Bell, label: "Alerts" },
  { href: "/search", icon: Search, label: "Search" },
];

function Header() {
  const { role, setRole } = useUIStore();
  const pathname = usePathname();

  const roleLabel = role === "exec" ? "Head of Assets" : "Asset Manager";

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="container flex h-full items-center justify-between px-4">
        {/* Logo with brand icon */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Layers className="h-5 w-5 text-primary" />
          <span className="font-semibold">Credit Oversight</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Role Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm hover:bg-muted transition-colors outline-none">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="hidden sm:inline text-foreground">{roleLabel}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Demo Role Switch
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setRole("exec")}
              className={cn(role === "exec" && "bg-muted")}
            >
              Head of Assets
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setRole("am")}
              className={cn(role === "am" && "bg-muted")}
            >
              Asset Manager
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/50 bg-background/95 backdrop-blur-sm md:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[64px] py-2 rounded-lg transition-all",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              <div className={cn(
                "relative",
                isActive && "after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <span className={cn("text-xs", isActive ? "font-medium" : "font-normal")}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="container px-4 py-6 pb-24 md:pb-6">{children}</main>
      <BottomNav />
    </>
  );
}
