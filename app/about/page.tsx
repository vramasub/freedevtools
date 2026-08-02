import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description: `About ${siteConfig.name} — free, browser-based tools for developers.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">About {siteConfig.name}</h1>

      <div className="mt-6 space-y-5 text-base leading-7 text-slate-700">
        <p>
          {siteConfig.name} is a free collection of everyday developer tools — converters,
          compressors, and formatters — that run entirely in your web browser. There&apos;s
          nothing to install, no account to create, and no file ever leaves your device.
        </p>
        <p>
          Most online conversion tools work by uploading your file to a server, processing it
          there, and sending the result back. We built {siteConfig.name} differently: every tool
          uses your browser&apos;s own JavaScript and WebAssembly engine to do the work locally,
          so your data — CSVs, JSON, images, PDFs — never has to leave your computer.
        </p>
        <p>
          That means these tools are safe to use even for sensitive or confidential files, work
          just as well offline once a page has loaded, and don&apos;t depend on how busy our
          servers are — the only limit is your own device.
        </p>
        <p>
          The site is free to use and supported by advertising. We don&apos;t sell or share any
          data about the files you process, because we never receive that data in the first
          place — see our{" "}
          <a href="/privacy-policy" className="font-medium text-indigo-600 hover:text-indigo-700">
            Privacy Policy
          </a>{" "}
          for details.
        </p>
        <p>
          Have a tool you&apos;d like to see added? Reach out on the{" "}
          <a href="/contact" className="font-medium text-indigo-600 hover:text-indigo-700">
            Contact
          </a>{" "}
          page.
        </p>
      </div>
    </div>
  );
}
