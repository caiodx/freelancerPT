"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard, FileText, Calendar, Settings, LogOut,
  Shield, ChevronRight, PiggyBank,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard",              label: "Inicio",      icon: LayoutDashboard, exact: true },
  { href: "/dashboard/faturas",      label: "Faturas",     icon: FileText },
  { href: "/dashboard/cofre",        label: "Cofre",       icon: PiggyBank },
  { href: "/dashboard/prazos",       label: "Prazos",      icon: Calendar },
  { href: "/dashboard/configuracoes",label: "Definicoes",  icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <>
      {/* ── DESKTOP SIDEBAR ─────────────────────────────────────────────── */}
      <aside className="hidden md:flex w-60 shrink-0 bg-[#0F1F33] min-h-screen flex-col">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-white/5">
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
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
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

        {/* Logout no fundo */}
        <div className="px-3 pb-5 border-t border-white/5 pt-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sair
          </button>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV ───────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0F1F33] border-t border-white/10 flex items-stretch">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold transition-colors",
                isActive ? "text-white" : "text-white/40"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-[#BF4700]" : "text-white/40")} />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
