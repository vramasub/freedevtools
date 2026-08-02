import type { ToolCategory } from "@/lib/tools-registry";

export interface CategoryTheme {
  gradient: string;
  chipBg: string;
  chipText: string;
  hoverBorder: string;
  hoverBg: string;
  linkHover: string;
}

export const categoryTheme: Record<ToolCategory, CategoryTheme> = {
  data: {
    gradient: "bg-gradient-to-br from-violet-500 to-indigo-500",
    chipBg: "bg-violet-50",
    chipText: "text-violet-700",
    hoverBorder: "hover:border-violet-300",
    hoverBg: "hover:bg-violet-50/60",
    linkHover: "hover:text-violet-700",
  },
  image: {
    gradient: "bg-gradient-to-br from-rose-500 to-pink-500",
    chipBg: "bg-rose-50",
    chipText: "text-rose-700",
    hoverBorder: "hover:border-rose-300",
    hoverBg: "hover:bg-rose-50/60",
    linkHover: "hover:text-rose-700",
  },
  pdf: {
    gradient: "bg-gradient-to-br from-amber-500 to-orange-500",
    chipBg: "bg-amber-50",
    chipText: "text-amber-700",
    hoverBorder: "hover:border-amber-300",
    hoverBg: "hover:bg-amber-50/60",
    linkHover: "hover:text-amber-700",
  },
  utility: {
    gradient: "bg-gradient-to-br from-emerald-500 to-teal-500",
    chipBg: "bg-emerald-50",
    chipText: "text-emerald-700",
    hoverBorder: "hover:border-emerald-300",
    hoverBg: "hover:bg-emerald-50/60",
    linkHover: "hover:text-emerald-700",
  },
};
