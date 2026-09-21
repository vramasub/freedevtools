import type { ToolCategory } from "@/lib/tools-registry";

export interface CategoryTheme {
  gradient: string;
  chipBg: string;
  chipText: string;
  hoverBorder: string;
  hoverBg: string;
  linkHover: string;
}

// A curated, harmonized 4-hue "instrument panel" palette — deliberately chosen instead
// of the default Tailwind swatches (violet/rose/amber/emerald) previously used here.
// Flat accents (no gradients) to match the site's new Swiss/minimal direction.
export const categoryTheme: Record<ToolCategory, CategoryTheme> = {
  data: {
    gradient: "bg-[#4438CA]",
    chipBg: "bg-[#4438CA]/10",
    chipText: "text-[#4438CA]",
    hoverBorder: "hover:border-[#4438CA]/40",
    hoverBg: "hover:bg-[#4438CA]/5",
    linkHover: "hover:text-[#4438CA]",
  },
  text: {
    gradient: "bg-[#BE185D]",
    chipBg: "bg-[#BE185D]/10",
    chipText: "text-[#BE185D]",
    hoverBorder: "hover:border-[#BE185D]/40",
    hoverBg: "hover:bg-[#BE185D]/5",
    linkHover: "hover:text-[#BE185D]",
  },
  image: {
    gradient: "bg-[#E1502E]",
    chipBg: "bg-[#E1502E]/10",
    chipText: "text-[#E1502E]",
    hoverBorder: "hover:border-[#E1502E]/40",
    hoverBg: "hover:bg-[#E1502E]/5",
    linkHover: "hover:text-[#E1502E]",
  },
  pdf: {
    gradient: "bg-[#B5751A]",
    chipBg: "bg-[#B5751A]/10",
    chipText: "text-[#B5751A]",
    hoverBorder: "hover:border-[#B5751A]/40",
    hoverBg: "hover:bg-[#B5751A]/5",
    linkHover: "hover:text-[#B5751A]",
  },
  utility: {
    gradient: "bg-[#0E7A5F]",
    chipBg: "bg-[#0E7A5F]/10",
    chipText: "text-[#0E7A5F]",
    hoverBorder: "hover:border-[#0E7A5F]/40",
    hoverBg: "hover:bg-[#0E7A5F]/5",
    linkHover: "hover:text-[#0E7A5F]",
  },
};
