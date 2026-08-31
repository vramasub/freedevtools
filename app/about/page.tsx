import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description: `About ${siteConfig.name} — free, browser-based tools for developers.`,
  path: "/about",
});

const displayFont = { fontFamily: "var(--font-space-grotesk)" };
const bodyFont = { fontFamily: "var(--font-ibm-plex-sans)" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6" style={bodyFont}>
      <h1 className="text-3xl font-semibold tracking-tight text-[#14140F]" style={displayFont}>
        About {siteConfig.name}
      </h1>

      <div className="mt-6 space-y-5 text-base leading-7 text-[#14140F]/80">
        <p>
          Hi, I&apos;m Vijay. I built {siteConfig.name}{" "}
          because I was tired of the same small
          annoyance over and over: needing to convert a CSV, shrink an image, or decode a JWT, and
          having to upload the file to some random site first — one whose name I&apos;d never
          heard of, whose privacy policy I hadn&apos;t read, for a task that my own laptop was
          more than capable of doing itself. Some of those files were things I really didn&apos;t
          want sitting on someone else&apos;s server, even briefly.
        </p>
        <p>
          So I built this the other way around: every tool here runs entirely in your
          browser&apos;s own JavaScript and WebAssembly engine, using your device&apos;s own
          processing power. Nothing you drop into these tools — a CSV, a photo, a PDF — is ever
          uploaded anywhere. It&apos;s not a policy promise you have to take on faith; you can
          check it yourself by opening your browser&apos;s dev tools and watching the Network tab
          while you convert a file.
        </p>
        <p>
          I built it with the help of AI coding tools, which is worth saying plainly rather than
          leaving unmentioned — it&apos;s how a lot of software gets built now, and I&apos;d
          rather be upfront about it than pretend otherwise. Every tool is genuinely tested and
          I use this site myself, regularly, for exactly the problems it&apos;s built to solve.
        </p>
        <p>
          That means these tools are safe to use even for sensitive or confidential files, work
          just as well offline once a page has loaded, and don&apos;t depend on how busy any
          server is — the only limit is your own device.
        </p>
        <p>
          The site is free to use and supported by advertising. I don&apos;t sell or share any
          data about the files you process, because I never receive that data in the first
          place — see the{" "}
          <Link href="/privacy-policy" className="font-medium text-[#4438CA] hover:underline">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <p>
          Have a tool you&apos;d like to see added, or found something broken? Reach out on the{" "}
          <Link href="/contact" className="font-medium text-[#4438CA] hover:underline">
            Contact
          </Link>{" "}
          page — I read every message myself.
        </p>
      </div>
    </div>
  );
}
