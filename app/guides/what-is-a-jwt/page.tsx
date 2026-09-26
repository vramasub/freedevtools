import type { Metadata } from "next";
import Link from "next/link";
import GuideTemplate from "@/components/guides/GuideTemplate";
import { GuideH2 as H2, GuideCode as Code } from "@/components/guides/prose";
import { getGuideBySlug } from "@/lib/guides-registry";
import { buildPageMetadata } from "@/lib/seo";

const guide = getGuideBySlug("what-is-a-jwt")!;
export const metadata: Metadata = buildPageMetadata({
  title: guide.title,
  description: guide.description,
  path: `/guides/${guide.slug}`,
});

export default function WhatIsAJwtGuidePage() {
  return (
    <GuideTemplate guide={guide}>
      <p>
        Paste a JWT into a decoder and the payload comes back as plain, readable JSON — no key, no
        password, nothing. That surprises people who assumed the long, scrambled-looking string
        meant it was encrypted. It isn&apos;t. A JWT is signed, not sealed, and the difference
        matters for what you should and shouldn&apos;t put inside one.
      </p>

      <H2>The three parts</H2>
      <p>
        A JWT is three Base64url-encoded segments joined by dots:{" "}
        <Code>header.payload.signature</Code>. The header names the signing algorithm, the payload
        holds the actual claims — user ID, roles, an expiry time, whatever the issuer decided to
        include — and the signature is a cryptographic stamp over the first two parts. Decode the
        header or payload and you get straightforward JSON back; it&apos;s the same underlying
        idea as our{" "}
        <Link href="/guides/what-is-base64-encoding" className="font-medium text-[#4438CA] hover:underline">
          Base64 encoding
        </Link>{" "}
        guide, applied to two JSON objects stitched together with a signature.
      </p>

      <H2>What the signature actually protects</H2>
      <p>
        The signature proves the token wasn&apos;t altered after the issuer signed it, and (for
        algorithms like RS256) that it really came from whoever holds the private key. It does not
        hide the payload from anyone who receives the token. Anyone holding a JWT can decode and
        read every claim inside it — the signature is there to catch tampering, not to keep
        secrets. A server that trusts a JWT is trusting the signature, not the fact that the
        content is unreadable, because it isn&apos;t.
      </p>

      <H2>Decoding vs verifying — a distinction worth keeping straight</H2>
      <p>
        Decoding just splits the token on its dots and Base64-decodes the header and payload — no
        key needed, which is what a JWT decoder tool does. Verifying is a separate, stronger check:
        recomputing the signature with the correct secret or public key and confirming it matches,
        which is what a server has to do before it trusts the claims at all. A tool that only
        decodes will happily show you the contents of an expired or outright forged token — reading
        the payload was never proof the token is valid.
      </p>

      <H2>The mistake this misunderstanding causes</H2>
      <p>
        Because a JWT looks encoded, it&apos;s tempting to stash something sensitive in the
        payload — an email address is usually fine, a password or an API key is not. Anyone who
        intercepts the token, or who the token is legitimately sent to, can read every claim inside
        it in one step. Treat a JWT&apos;s payload as visible to the token holder by design, the
        same way you&apos;d treat a signed but unsealed envelope.
      </p>

      <H2>The practical rule</H2>
      <p>
        Use a JWT&apos;s payload for claims that are fine to be readable — identity, permissions,
        expiry — and rely on the signature only to detect tampering, never to provide
        confidentiality. If something genuinely needs to stay secret from the token holder, it
        doesn&apos;t belong in a JWT at all.
      </p>
      <p>
        Our{" "}
        <Link href="/tools/jwt-decoder" className="font-medium text-[#4438CA] hover:underline">
          JWT Decoder
        </Link>{" "}
        splits a token into its header and payload instantly in your browser, so you can inspect
        exactly what&apos;s inside one without sending it anywhere.
      </p>
    </GuideTemplate>
  );
}
