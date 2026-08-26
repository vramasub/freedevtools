"use client";

import Link from "next/link";
import { Wrench, Menu } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { useSidebar } from "./SidebarContext";

export default function Header() {
  const { setMobileOpen } = useSidebar();

  return (
    <header className="border-b border-[#14140F]/10 bg-white/90 backdrop-blur sticky top-0 z-40">
      <div
        className="flex items-center justify-between px-4 py-3 sm:px-6"
        style={{ fontFamily: "var(--font-ibm-plex-sans)" }}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-[#14140F]/70 hover:bg-[#14140F]/5 lg:hidden"
            aria-label="Open tools menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>
          <Link href="/" className="flex items-center gap-2 text-[#14140F]">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#14140F] text-white">
              <Wrench size={18} />
            </span>
            <span className="font-semibold tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {siteConfig.name}
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-6">
          <Link href="/tools" className="text-sm font-medium text-[#14140F]/70 hover:text-[#14140F]">
            All Tools
          </Link>
          <Link href="/about" className="text-sm font-medium text-[#14140F]/70 hover:text-[#14140F]">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
