import type { Metadata } from "next";
import Link from "next/link";
import GuideTemplate from "@/components/guides/GuideTemplate";
import { GuideH2 as H2, GuideCode as Code } from "@/components/guides/prose";
import { getGuideBySlug } from "@/lib/guides-registry";
import { buildPageMetadata } from "@/lib/seo";

const guide = getGuideBySlug("what-is-base64-encoding")!;
export const metadata: Metadata = buildPageMetadata({
  title: guide.title,
  description: guide.description,
  path: `/guides/${guide.slug}`,
});

export default function WhatIsBase64EncodingGuidePage() {
  return (
    <GuideTemplate guide={guide}>
      <p>
        Base64 gets called &quot;encryption&quot; often enough that it&apos;s worth correcting
        first: it isn&apos;t. It&apos;s not compression either. What it actually does is narrower
        and, once you see it, much easier to reason about — it makes arbitrary binary data safe to
        put somewhere that only guarantees safe handling of a limited set of text characters.
      </p>

      <H2>The actual problem it solves</H2>
      <p>
        Binary data — an image file, a PDF, an encryption key — is just a sequence of bytes, and
        those bytes can be any value at all, including ones that certain older or text-oriented
        systems don&apos;t handle safely: control characters, non-printable bytes, byte sequences
        that get mangled by an email server designed around 7-bit ASCII text, or that break a
        parser expecting well-formed text. Base64 sidesteps the whole problem by never using those
        risky bytes in the first place — it re-expresses the binary data using only 64 characters
        everyone agrees are safe: <Code>A–Z</Code>, <Code>a–z</Code>, <Code>0–9</Code>, plus{" "}
        <Code>+</Code>{" "}
        and{" "}
        <Code>/</Code>.
      </p>

      <H2>How it works, roughly</H2>
      <p>
        Base64 groups the input into 3-byte chunks and re-encodes each chunk as 4 characters from
        that safe alphabet. That&apos;s also exactly why encoded output is about a third larger
        than the original — 3 bytes become 4 characters, a fixed 4-for-3 expansion every time.
        Base64 trades size for safety; it never shrinks anything.
      </p>

      <H2>What it is not</H2>
      <ul className="ml-5 list-disc space-y-2">
        <li>
          <strong className="text-[#14140F]">Not encryption.</strong>{" "}
          There&apos;s no key. Decoding Base64 is a fixed, public, entirely mechanical operation —
          anyone, including an attacker, can reverse it instantly with no secret required. It
          provides zero confidentiality.
        </li>
        <li>
          <strong className="text-[#14140F]">Not compression.</strong>{" "}
          It makes data larger, not smaller, by design.
        </li>
        <li>
          <strong className="text-[#14140F]">Not a hash.</strong>{" "}
          It&apos;s fully reversible — the whole point is that you can decode it back to the exact
          original bytes, which is the opposite of what a hash is for.
        </li>
      </ul>

      <H2>Where you actually run into it</H2>
      <p>
        Embedding a small image directly inside HTML or CSS as a{" "}
        <Code>data:</Code>{" "}
        URI, so the browser doesn&apos;t need a separate HTTP request to fetch
        it. Sending binary attachments inside a JSON API payload, since JSON has no native way to
        represent raw binary — everything in a JSON string has to be text, so binary is Base64
        encoded before it goes in. HTTP Basic Authentication headers, where a{" "}
        <Code>username:password</Code>{" "}
        pair gets Base64-encoded before being sent — which is a
        genuinely common source of the &quot;is this secure?&quot; confusion, since it looks
        obfuscated but isn&apos;t; Basic Auth is only safe at all because it&apos;s sent over
        HTTPS, not because of the encoding.
      </p>

      <H2>The one thing worth remembering</H2>
      <p>
        If you ever see Base64 being used as if it were a security measure — hiding a password in
        a config file, &quot;encrypting&quot; a token — that&apos;s a red flag, not a safe
        pattern. Decoding it takes one line of code in any language and no key at all. Base64 is
        for making data safe to transport through text-only channels, full stop; anything that
        actually needs to stay secret needs real encryption on top of it, not instead of it.
      </p>
      <p>
        Our{" "}
        <Link href="/tools/base64-encode-decode" className="font-medium text-[#4438CA] hover:underline">
          Base64 Encode/Decode
        </Link>{" "}
        tool handles both directions instantly in your browser — useful for reading what&apos;s
        actually inside an encoded string, or preparing data to embed somewhere that needs it.
      </p>
    </GuideTemplate>
  );
}
