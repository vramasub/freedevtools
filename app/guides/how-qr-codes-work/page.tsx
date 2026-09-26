import type { Metadata } from "next";
import Link from "next/link";
import GuideTemplate from "@/components/guides/GuideTemplate";
import { GuideH2 as H2 } from "@/components/guides/prose";
import { getGuideBySlug } from "@/lib/guides-registry";
import { buildPageMetadata } from "@/lib/seo";

const guide = getGuideBySlug("how-qr-codes-work")!;
export const metadata: Metadata = buildPageMetadata({
  title: guide.title,
  description: guide.description,
  path: `/guides/${guide.slug}`,
});

export default function HowQrCodesWorkGuidePage() {
  return (
    <GuideTemplate guide={guide}>
      <p>
        A QR code looks like noise — a random grid of black and white squares — but nothing in it
        is random. Every square, called a module, is a deliberate bit of encoded data, arranged
        according to a public standard that any scanner can read without knowing anything about
        what was encoded in advance.
      </p>

      <H2>The parts that aren&apos;t your data</H2>
      <p>
        The three large squares in three of the four corners are finder patterns — a fixed,
        recognizable shape a scanner looks for first, which is how it locates the code and figures
        out its orientation even if the photo is rotated, tilted, or taken at an angle. Once the
        scanner has found those, it can work out the grid alignment and start reading the actual
        data modules in between. None of that structural scaffolding encodes your content; it
        exists purely so the code can be found and read reliably.
      </p>

      <H2>Why a damaged QR code still scans</H2>
      <p>
        QR codes use Reed-Solomon error correction — the same family of math used to recover data
        from scratched CDs and DVDs, and in deep-space communication where re-sending a signal
        isn&apos;t an option. The encoder adds redundant data alongside the actual content, so a
        scanner can mathematically reconstruct the original even if part of the code is dirty,
        torn, or covered by a logo. This is also why you can drop a logo in the middle of a QR
        code and it still works — the error correction budget absorbs the missing chunk.
      </p>

      <H2>Four levels of redundancy, and the tradeoff</H2>
      <p>
        QR codes support four error correction levels — L, M, Q, and H — recovering roughly 7%,
        15%, 25%, and 30% of the code respectively if it&apos;s damaged. Higher correction means
        more resilience, but that redundant data has to live somewhere: it makes the code denser
        and reduces how much actual content fits at a given size. A clean code that will only ever
        be viewed on a screen can use a low level; a code that will be printed, laminated, or
        stuck on a warehouse floor benefits from a higher one.
      </p>

      <H2>Why contrast matters more than actual color</H2>
      <p>
        A scanner isn&apos;t looking for literal black and white — it&apos;s looking for enough
        contrast between the foreground and background to reliably tell modules apart. That&apos;s
        why custom-colored QR codes work fine with a dark foreground on a light background, but
        start failing to scan with low-contrast combinations like light grey on white, regardless
        of how the colors look to a person.
      </p>

      <H2>The practical rule</H2>
      <p>
        Raise the error correction level when the code will be printed, resized, or partly
        obscured, keep it low when you want maximum data capacity in a clean digital code, and
        always keep strong contrast between foreground and background if you customize the colors.
      </p>
      <p>
        Our{" "}
        <Link href="/tools/qr-code-generator" className="font-medium text-[#4438CA] hover:underline">
          QR Code Generator
        </Link>{" "}
        lets you set the error correction level and colors yourself, and generates the code
        entirely in your browser.
      </p>
    </GuideTemplate>
  );
}
