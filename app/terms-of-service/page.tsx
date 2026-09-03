import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Service",
  description: `Terms of Service for ${siteConfig.name}.`,
  path: "/terms-of-service",
});

const EFFECTIVE_DATE = "August 1, 2026";

const displayFont = { fontFamily: "var(--font-space-grotesk)" };
const bodyFont = { fontFamily: "var(--font-ibm-plex-sans)" };

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6" style={bodyFont}>
      <h1 className="text-3xl font-semibold tracking-tight text-[#14140F]" style={displayFont}>
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-[#14140F]/50">Effective date: {EFFECTIVE_DATE}</p>

      <div className="mt-8 space-y-8 text-base leading-7 text-[#14140F]/80">
        <section>
          <h2 className="text-lg font-semibold text-[#14140F]" style={displayFont}>
            Acceptance of terms
          </h2>
          <p className="mt-2">
            By using {siteConfig.name}{" "}
            (the &quot;Service&quot;), you agree to these Terms of Service. If you do not agree,
            please do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#14140F]" style={displayFont}>
            Use of the Service
          </h2>
          <p className="mt-2">
            The Service provides free, browser-based tools for converting, compressing, and
            formatting files. You are solely responsible for the content you process using the
            Service, and you confirm that you have the legal right to use, copy, and process any
            file, image, or data you submit to a tool on this site. You agree not to use the
            Service for any unlawful purpose or to process content that infringes the rights of
            others.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#14140F]" style={displayFont}>
            No warranty
          </h2>
          <p className="mt-2">
            The Service is provided &quot;as is&quot; and &quot;as available,&quot; without
            warranties of any kind, express or implied, including but not limited to accuracy,
            reliability, or fitness for a particular purpose. Conversion and compression results
            are not guaranteed to be lossless or error-free for every possible input. You are
            responsible for verifying the output of any tool before relying on it, and for
            keeping your own backup copies of original files — the Service does not store your
            files, so it cannot recover them if something goes wrong on your device.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#14140F]" style={displayFont}>
            Limitation of liability
          </h2>
          <p className="mt-2">
            To the fullest extent permitted by law, {siteConfig.name}{" "}
            and its operator shall not be liable for any indirect, incidental, or consequential
            damages arising from your use of, or inability to use, the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#14140F]" style={displayFont}>
            Advertising
          </h2>
          <p className="mt-2">
            The Service is supported by advertising, including through Google AdSense. Ads are
            served by third parties and this site is not responsible for the content of
            third-party advertisements.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#14140F]" style={displayFont}>
            Intellectual property
          </h2>
          <p className="mt-2">
            All site design, branding, and code are the property of {siteConfig.name}{" "}
            unless otherwise noted. You retain all rights to any content you process using the
            Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#14140F]" style={displayFont}>
            Changes to the Service or Terms
          </h2>
          <p className="mt-2">
            We may modify or discontinue any part of the Service at any time, and may update
            these Terms from time to time. Continued use of the Service after changes are posted
            constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#14140F]" style={displayFont}>
            Contact
          </h2>
          <p className="mt-2">
            Questions about these Terms can be sent to{" "}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="font-medium text-[#4438CA] hover:underline"
            >
              {siteConfig.contactEmail}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
