"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, X } from "lucide-react";
import { categoryLabels, getToolsByCategory, type ToolCategory } from "@/lib/tools-registry";
import { categoryTheme } from "@/lib/theme";
import { toolIcons } from "@/lib/tool-icons";
import { useSidebar } from "./SidebarContext";

const categories: ToolCategory[] = ["data", "image", "pdf", "utility"];

function activeCategoryFor(pathname: string): ToolCategory | null {
  if (!pathname.startsWith("/tools/")) return null;
  const slug = pathname.split("/")[2];
  return categories.find((category) => getToolsByCategory(category).some((t) => t.slug === slug)) ?? null;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { mobileOpen, setMobileOpen } = useSidebar();
  const activeCategory = activeCategoryFor(pathname);
  // Only the category containing the current tool starts expanded, keeping the panel
  // compact — that's the whole point of making the headings collapsible.
  const [openCategories, setOpenCategories] = useState<Set<ToolCategory>>(
    () => new Set(activeCategory ? [activeCategory] : [])
  );

  const toggleCategory = (category: ToolCategory) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const nav = (
    <nav className="space-y-1 p-3">
      {categories.map((category) => {
        const theme = categoryTheme[category];
        const isOpen = openCategories.has(category);
        return (
          <div key={category}>
            <button
              type="button"
              onClick={() => toggleCategory(category)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              <span className="flex items-center gap-2">
                <span className={`h-2 w-2 shrink-0 rounded-full ${theme.gradient}`} />
                {categoryLabels[category]}
              </span>
              <ChevronDown
                size={16}
                className={`shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <ul className="mt-1 space-y-0.5 pb-2 pl-6">
                {getToolsByCategory(category).map((tool) => {
                  const Icon = toolIcons[tool.icon];
                  const isActive = pathname === `/tools/${tool.slug}`;
                  return (
                    <li key={tool.slug}>
                      <Link
                        href={`/tools/${tool.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                          isActive
                            ? `${theme.chipBg} ${theme.chipText} font-medium`
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <Icon size={14} className="shrink-0" />
                        {tool.shortTitle}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-white lg:block">
        {nav}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <span className="text-sm font-semibold text-slate-900">All Tools</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
