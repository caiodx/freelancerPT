"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Settings,
  LogOut,
  Shield,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Início", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/faturas", label: "Faturas", icon: FileText },
  { href: "/dashboard/prazos", label: "Prazos", icon: Calendar },
  { href: "/dashboard/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <aside className="w-60 shrink-0 bg-[#0F1F33] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#1F4E79] rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-white text-base tracking-tight">
            freelancer<span className="text-[#BF4700]">PT</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href) && pathname !== "/dashboard";
          const isActive = exact ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-white/40" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 border-t border-white/5 pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  );
}
