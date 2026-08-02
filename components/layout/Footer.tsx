import Link from "next/link";
import { categoryLabels, getToolsByCategory, type ToolCategory } from "@/lib/tools-registry";
import { siteConfig } from "@/lib/site-config";
import { categoryTheme } from "@/lib/theme";

const categories: ToolCategory[] = ["data", "image", "pdf", "utility"];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => {
            const theme = categoryTheme[category];
            return (
              <div key={category}>
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                  <span className={`h-2 w-2 rounded-full ${theme.gradient}`} />
                  {categoryLabels[category]}
                </h3>
                <ul className="mt-3 space-y-2">
                  {getToolsByCategory(category).map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={`/tools/${tool.slug}`}
                        className={`text-sm text-slate-600 ${theme.linkHover}`}
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
            <h3 className="text-sm font-semibold text-slate-900">Company</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-slate-600 hover:text-indigo-600">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-600 hover:text-indigo-600">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-slate-600 hover:text-indigo-600"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-sm text-slate-600 hover:text-indigo-600"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All processing happens in your
            browser — your files are never uploaded.
          </p>
        </div>
      </div>
    </footer>
  );
}
