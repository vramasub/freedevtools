import type { Metadata } from "next";
import Link from "next/link";
import GuideTemplate from "@/components/guides/GuideTemplate";
import { GuideH2 as H2 } from "@/components/guides/prose";
import { getGuideBySlug } from "@/lib/guides-registry";
import { buildPageMetadata } from "@/lib/seo";

const guide = getGuideBySlug("md5-vs-sha256")!;
export const metadata: Metadata = buildPageMetadata({
  title: guide.title,
  description: guide.description,
  path: `/guides/${guide.slug}`,
});

export default function Md5VsSha256GuidePage() {
  return (
    <GuideTemplate guide={guide}>
      <p>
        Both are called &quot;hash functions&quot; and both produce that familiar string of hex
        characters, so it&apos;s easy to reach for whichever one you&apos;ve used before without
        thinking about why the choice matters. It matters more than it looks like it should — one
        of these is genuinely broken for security purposes, and the other one isn&apos;t.
      </p>

      <H2>What a hash function actually does</H2>
      <p>
        Feed it any input — a file, a password, a string — and it returns a fixed-size output
        that acts as a fingerprint of that input. The same input always produces the same output.
        Change even one byte of the input and the output changes completely and unpredictably.
        And critically, it only runs one way: you can&apos;t reverse a hash back into the original
        input, only compare a new hash against a known one to check whether the underlying data
        matches.
      </p>

      <H2>MD5: fast, ubiquitous, and cryptographically broken</H2>
      <p>
        MD5 produces a 128-bit hash and was the default choice for decades — it&apos;s fast, and
        support for it is everywhere. The problem is that it&apos;s cryptographically broken:
        researchers can deliberately construct two different inputs that produce the exact same
        MD5 hash, a real and practical attack, not a theoretical one. That makes MD5 unsafe for
        anything where a motivated adversary might benefit from forging a match — digital
        signatures, certificate validation, or verifying that a download hasn&apos;t been
        tampered with by someone who wants it to look legitimate.
      </p>
      <p>
        It&apos;s worth being precise about what &quot;broken&quot; means here, though: MD5 is
        broken against a deliberate attacker trying to craft a collision. It&apos;s still
        perfectly fine for catching accidental corruption — confirming a file transferred over a
        flaky connection came through byte-for-byte intact. Nobody is attacking your download;
        the risk there is a dropped packet, not an adversary.
      </p>

      <H2>SHA-256: the standard for anything security-sensitive</H2>
      <p>
        SHA-256 produces a 256-bit hash and belongs to the SHA-2 family. No practical collision
        attack against it is currently known, which is exactly why it&apos;s the standard behind
        TLS certificates, code-signing, blockchain, and verifying software downloads against a
        checksum the publisher wants you to actually trust. Where MD5 protects against accidents,
        SHA-256 protects against an adversary too.
      </p>

      <H2>The one thing neither of them should be used for</H2>
      <p>
        Storing passwords. Neither MD5 nor plain SHA-256 is designed for that job — both are
        built to be fast, which is exactly the wrong property for password storage, since it makes
        brute-forcing every possible password dramatically cheaper for an attacker who steals the
        hash database. Password storage needs a deliberately slow, salted algorithm — bcrypt,
        Argon2, or PBKDF2 — that&apos;s a genuinely different tool for a genuinely different job,
        not a stronger version of the same one.
      </p>

      <H2>The practical rule</H2>
      <p>
        Use SHA-256 (or better) for anything where the integrity check matters against a real
        adversary — verifying a download, signing something, checksumming data you need to trust.
        MD5 is still fine for quick, low-stakes integrity checks — deduplicating files, confirming
        a routine transfer wasn&apos;t corrupted — where speed matters more than resistance to a
        deliberate forger. When in doubt, SHA-256 costs you almost nothing extra and closes the
        door on the attack MD5 is actually vulnerable to.
      </p>
      <p>
        Our{" "}
        <Link href="/tools/hash-generator" className="font-medium text-[#4438CA] hover:underline">
          Hash Generator
        </Link>{" "}
        computes MD5, SHA-1, SHA-256, and SHA-512 for any text or file instantly in your browser.
      </p>
    </GuideTemplate>
  );
}
