import Link from "next/link";
import { categoryLabels, getToolsByCategory, type ToolCategory } from "@/lib/tools-registry";
import { siteConfig } from "@/lib/site-config";
import { categoryTheme } from "@/lib/theme";

const categories: ToolCategory[] = ["data", "image", "pdf", "utility"];

export default function Footer() {
  return (
    <footer className="border-t border-[#14140F]/10 bg-[#FAF9F5]">
      <div
        className="mx-auto max-w-6xl px-4 py-10 sm:px-6"
        style={{ fontFamily: "var(--font-ibm-plex-sans)" }}
      >
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => {
            const theme = categoryTheme[category];
            return (
              <div key={category}>
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-[#14140F]">
                  <span className={`h-2 w-2 rounded-full ${theme.gradient}`} />
                  {categoryLabels[category]}
                </h3>
                <ul className="mt-3 space-y-2">
                  {getToolsByCategory(category).map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={`/tools/${tool.slug}`}
                        className={`text-sm text-[#14140F]/60 ${theme.linkHover}`}
                      >
                        {tool.shortTitle}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          <div>
            <h3 className="text-sm font-semibold text-[#14140F]">Company</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-[#14140F]/60 hover:text-[#14140F]">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-[#14140F]/60 hover:text-[#14140F]">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-[#14140F]/60 hover:text-[#14140F]"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-sm text-[#14140F]/60 hover:text-[#14140F]"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#14140F]/10 pt-6 text-sm text-[#14140F]/50 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All processing happens in your
            browser — your files are never uploaded.
          </p>
        </div>
      </div>
    </footer>
  );
}
