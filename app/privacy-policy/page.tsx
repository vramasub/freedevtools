import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: `Privacy Policy for ${siteConfig.name}.`,
  path: "/privacy-policy",
});

const EFFECTIVE_DATE = "August 1, 2026";

const displayFont = { fontFamily: "var(--font-space-grotesk)" };
const bodyFont = { fontFamily: "var(--font-ibm-plex-sans)" };

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6" style={bodyFont}>
      <h1 className="text-3xl font-semibold tracking-tight text-[#14140F]" style={displayFont}>
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-[#14140F]/50">Effective date: {EFFECTIVE_DATE}</p>

      <div className="mt-8 space-y-8 text-base leading-7 text-[#14140F]/80">
        <section>
          <h2 className="text-lg font-semibold text-[#14140F]" style={displayFont}>
            Files you upload or paste into our tools
          </h2>
          <p className="mt-2">
            Every tool on {siteConfig.name}{" "}
            runs entirely in your web browser using JavaScript
            and WebAssembly. When you select, drop, or paste a file or text into a tool, that
            data is processed locally on your device.{" "}
            <strong className="text-[#14140F]">
              It is never uploaded, transmitted, or sent to our servers or to any third party
            </strong>
            , and we never see or store the contents of the files you convert, compress, or
            format. You can verify this yourself using your browser&apos;s developer tools
            (Network tab) — you will see no request containing your file&apos;s data while using
            any converter.
          </p>
          <p className="mt-2">
            If a future tool on this site ever requires server-side processing, that specific
            tool&apos;s page will clearly and separately disclose that exception before you use
            it. As of the effective date above, no tool on this site works this way.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#14140F]" style={displayFont}>
            Information we do collect
          </h2>
          <p className="mt-2">
            Like most websites, we use standard web hosting logs (such as IP address, browser
            type, and pages visited) for security and reliability purposes. We may also use
            privacy-respecting analytics to understand which tools are popular, and cookies set
            by advertising partners such as Google to serve and measure ads. This data is
            unrelated to, and never includes, the contents of any file you process using our
            tools.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#14140F]" style={displayFont}>
            Advertising
          </h2>
          <p className="mt-2">
            This site is supported by advertising served through Google AdSense. Google and its
            partners may use cookies and similar technologies to serve ads based on your prior
            visits to this or other websites. You can learn more about how Google uses data and
            manage your ad personalization settings at{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              className="font-medium text-[#4438CA] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              policies.google.com/technologies/partner-sites
            </a>
            . If you are located in the European Economic Area or the United Kingdom, you may be
            shown a consent request managing how these technologies are used, in line with
            Google&apos;s EU User Consent Policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#14140F]" style={displayFont}>
            Children&apos;s privacy
          </h2>
          <p className="mt-2">
            This site is not directed at children under the age of 13, and we do not knowingly
            collect personal information from children.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#14140F]" style={displayFont}>
            Your rights
          </h2>
          <p className="mt-2">
            Because we do not collect the contents of the files you process, there is generally
            no user file data for us to access, export, or delete on your behalf. For questions
            about the limited information described above (such as advertising or analytics
            data), contact us at{" "}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="font-medium text-[#4438CA] hover:underline"
            >
              {siteConfig.contactEmail}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#14140F]" style={displayFont}>
            Changes to this policy
          </h2>
          <p className="mt-2">
            We may update this Privacy Policy from time to time. Changes will be posted on this
            page with an updated effective date.
          </p>
        </section>
      </div>
    </div>
  );
}
