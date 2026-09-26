import type { Metadata } from "next";
import Link from "next/link";
import GuideTemplate from "@/components/guides/GuideTemplate";
import { GuideH2 as H2, GuideCode as Code } from "@/components/guides/prose";
import { getGuideBySlug } from "@/lib/guides-registry";
import { buildPageMetadata } from "@/lib/seo";

const guide = getGuideBySlug("yaml-vs-json")!;
export const metadata: Metadata = buildPageMetadata({
  title: guide.title,
  description: guide.description,
  path: `/guides/${guide.slug}`,
});

export default function YamlVsJsonGuidePage() {
  return (
    <GuideTemplate guide={guide}>
      <p>
        YAML and JSON represent the exact same data model — objects, arrays, strings, numbers,
        booleans, null — so converting between them never loses information. What&apos;s actually
        different is who&apos;s expected to read and edit the file, and that&apos;s what should
        decide which one you reach for.
      </p>

      <H2>What YAML adds</H2>
      <p>
        YAML uses indentation instead of braces and brackets, drops most of the quoting JSON
        requires, and supports comments with <Code>#</Code> — something JSON has no syntax for at
        all. A YAML file describing a config is noticeably shorter and easier to scan than the
        equivalent JSON, which is exactly why it took over as the format of choice for anything a
        person is expected to hand-edit: Kubernetes manifests, CI pipeline definitions, Docker
        Compose files.
      </p>

      <H2>What that readability costs you</H2>
      <p>
        Indentation-sensitivity means a misplaced space silently changes structure instead of
        throwing an obvious syntax error the way a missing brace does in JSON. YAML also has a
        genuinely famous gotcha nicknamed the &quot;Norway problem&quot;: an unquoted{" "}
        <Code>no</Code>{" "}
        or{" "}
        <Code>yes</Code>{" "}
        in a YAML file parses as the boolean <Code>false</Code> or{" "}
        <Code>true</Code>, not the string, which has broken real configs where{" "}
        <Code>country: no</Code>{" "}
        (Norway&apos;s ISO code) silently became <Code>country: false</Code>. JSON&apos;s stricter,
        more verbose syntax makes that class of bug impossible — a string is always quoted, full
        stop.
      </p>

      <H2>Where each one actually wins</H2>
      <p>
        YAML wins wherever a human is the primary editor and comments help explain why a setting is
        set the way it is. JSON wins wherever a program is writing or reading the data without a
        person in the loop — API responses, data interchange between services, anything parsed by
        code far more often than it&apos;s read by eyes. JSON&apos;s stricter grammar is also easier
        to parse correctly and unambiguously across different languages and tools, which matters
        more the more machines are involved.
      </p>

      <H2>The practical rule</H2>
      <p>
        If people will regularly hand-edit the file and benefit from comments, use YAML. If the
        file is primarily produced and consumed by code, use JSON — you lose nothing structurally
        by choosing either one, since the underlying data model is identical.
      </p>
      <p>
        Our{" "}
        <Link href="/tools/yaml-to-json" className="font-medium text-[#4438CA] hover:underline">
          YAML to JSON
        </Link>{" "}
        and{" "}
        <Link href="/tools/json-to-yaml" className="font-medium text-[#4438CA] hover:underline">
          JSON to YAML
        </Link>{" "}
        converters handle both directions instantly in your browser.
      </p>
    </GuideTemplate>
  );
}
