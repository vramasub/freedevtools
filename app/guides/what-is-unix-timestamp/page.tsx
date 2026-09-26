import type { Metadata } from "next";
import Link from "next/link";
import GuideTemplate from "@/components/guides/GuideTemplate";
import { GuideH2 as H2, GuideCode as Code } from "@/components/guides/prose";
import { getGuideBySlug } from "@/lib/guides-registry";
import { buildPageMetadata } from "@/lib/seo";

const guide = getGuideBySlug("what-is-unix-timestamp")!;
export const metadata: Metadata = buildPageMetadata({
  title: guide.title,
  description: guide.description,
  path: `/guides/${guide.slug}`,
});

export default function WhatIsUnixTimestampGuidePage() {
  return (
    <GuideTemplate guide={guide}>
      <p>
        A Unix timestamp — also called epoch time — is just an integer: the number of seconds
        that have elapsed since midnight UTC on January 1, 1970. No timezone, no calendar, no
        month or day fields to get wrong. That plainness is the entire point.
      </p>

      <H2>Why 1970</H2>
      <p>
        There&apos;s no deep meaning behind the date — it was simply chosen as a fixed reference
        point by the designers of Unix in the early 1970s, close to when the system was actually
        being built. What matters isn&apos;t the specific date but that everyone agreed on the
        same zero point, so any two systems computing a timestamp are counting from the same
        instant.
      </p>

      <H2>Why store time as a single number at all</H2>
      <p>
        Once time is a plain integer, comparing two moments is just comparing two numbers, and
        finding the duration between them is just subtraction — no calendar arithmetic, no
        daylight-saving edge cases, no ambiguity about which timezone a stored date was meant to
        be in. That&apos;s why timestamps are the default internally in databases, log files, and
        APIs: the number only gets converted to a human-readable date at the point where a person
        actually needs to read it.
      </p>

      <H2>Seconds vs milliseconds — the common gotcha</H2>
      <p>
        The Unix epoch itself is defined in seconds, but plenty of systems — JavaScript&apos;s{" "}
        <Code>Date.now()</Code> among them — report milliseconds instead, which is the same epoch
        just counted 1,000 times faster. A ten-digit timestamp is seconds; a thirteen-digit one is
        milliseconds. Feeding a millisecond value into something expecting seconds lands you on a
        date roughly 50,000 years in the future, which is a fast way to notice the mismatch.
      </p>

      <H2>The Year 2038 problem</H2>
      <p>
        Older systems that stored a Unix timestamp as a signed 32-bit integer can only count up to
        January 19, 2038, before the value overflows and wraps around to a negative number —
        interpreted as a date back in 1901. It&apos;s the timestamp equivalent of the Y2K bug. Most
        modern systems have already moved to 64-bit timestamps, which push the same problem out
        billions of years, but it&apos;s the reason you&apos;ll still see the date mentioned as a
        real deadline for anything running on older 32-bit infrastructure.
      </p>

      <H2>The practical rule</H2>
      <p>
        Treat a Unix timestamp as the unambiguous, storage-friendly form of a moment in time, and
        convert it to a human-readable date only at the point where a person needs to read it —
        and check whether you&apos;re holding seconds or milliseconds before you do the
        conversion.
      </p>
      <p>
        Our{" "}
        <Link href="/tools/unix-timestamp-converter" className="font-medium text-[#4438CA] hover:underline">
          Unix Timestamp Converter
        </Link>{" "}
        converts between epoch time and a readable date, in local time or UTC, instantly in your
        browser.
      </p>
    </GuideTemplate>
  );
}
