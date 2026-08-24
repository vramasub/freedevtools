"use client";

import Link from "next/link";
import { Wrench, Menu } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { useSidebar } from "./SidebarContext";

export default function Header() {
  const { setMobileOpen } = useSidebar();

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open tools menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>
          <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-violet-600 via-indigo-600 to-rose-500 text-white">
              <Wrench size={18} />
            </span>
            <span>{siteConfig.name}</span>
          </Link>
        </div>

        <nav className="flex items-center gap-6">
          <Link href="/tools" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            All Tools
          </Link>
          <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
