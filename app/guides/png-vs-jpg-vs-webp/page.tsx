import type { Metadata } from "next";
import Link from "next/link";
import GuideTemplate from "@/components/guides/GuideTemplate";
import { GuideH2 as H2 } from "@/components/guides/prose";
import { getGuideBySlug } from "@/lib/guides-registry";
import { buildPageMetadata } from "@/lib/seo";

const guide = getGuideBySlug("png-vs-jpg-vs-webp")!;
export const metadata: Metadata = buildPageMetadata({
  title: guide.title,
  description: guide.description,
  path: `/guides/${guide.slug}`,
});

export default function PngVsJpgVsWebpGuidePage() {
  return (
    <GuideTemplate guide={guide}>
      <p>
        Most people pick an image format by habit — whatever their screenshot tool or camera app
        defaults to — and never think about it again. That works fine most of the time, until it
        doesn&apos;t: a screenshot with fuzzy text, a logo that loses its transparent background,
        or a photo gallery that&apos;s three times bigger than it needs to be and slowing down a
        page. The three formats exist because they&apos;re genuinely good at different things.
      </p>

      <H2>JPG: built for photos</H2>
      <p>
        JPG uses lossy compression — it makes files smaller by permanently discarding image data
        it calculates you&apos;re unlikely to notice, mostly fine color gradations and
        high-frequency detail the human eye is bad at picking up in photographic content. That
        trade-off works brilliantly for photos: real-world images are full of gradual color
        transitions and don&apos;t have hard, exact edges, so the loss is genuinely close to
        invisible at reasonable quality settings.
      </p>
      <p>
        It works badly for anything with sharp edges or flat color — text, line art, UI
        screenshots. JPG compresses those in 8×8 pixel blocks, and where a screenshot has sudden
        contrast (black text on a white background), that block-based math creates visible
        smudging and ringing around the edges. It also doesn&apos;t support transparency at all,
        and every time you re-save an already-compressed JPG, it loses a little more — repeated
        edits genuinely degrade a JPG in a way that compounds.
      </p>

      <H2>PNG: built for graphics</H2>
      <p>
        PNG is lossless — nothing is discarded, ever. What you save is pixel-for-pixel identical
        to what you had, no matter how many times you open and re-save it. It also supports full
        alpha transparency, which is why every logo, icon, and UI screenshot with a see-through
        background is a PNG. The cost is file size: because nothing gets discarded, a
        detail-heavy photo saved as PNG can be several times larger than the same photo as JPG,
        for a quality difference most people can&apos;t actually perceive in a photograph.
      </p>

      <H2>WebP: the newer option that does both</H2>
      <p>
        WebP can operate in either mode — lossy, competing directly with JPG at meaningfully
        smaller file sizes for comparable quality, or lossless, competing with PNG the same way.
        It also supports transparency and animation, covering the ground JPG and animated GIF
        used to split between them. The trade-off isn&apos;t quality or size — it&apos;s
        compatibility. WebP is well supported in modern browsers, but some older software, certain
        email clients, and some print workflows still don&apos;t handle it cleanly, so it&apos;s
        not yet the safe universal default the way JPG and PNG are.
      </p>

      <H2>How to actually decide</H2>
      <ul className="ml-5 list-disc space-y-2">
        <li>
          <strong className="text-[#14140F]">A real photo, no transparency needed:</strong>{" "}
          JPG for maximum compatibility, or lossy WebP if you control where the file is viewed
          and want it smaller.
        </li>
        <li>
          <strong className="text-[#14140F]">
            A screenshot, logo, icon, or anything with text or transparency:
          </strong>{" "}
          PNG, or lossless WebP if compatibility isn&apos;t a concern.
        </li>
        <li>
          <strong className="text-[#14140F]">
            Building a website and page-load speed matters:
          </strong>{" "}
          WebP — the file size savings are real and browser support is now broad enough that
          it&apos;s the sensible default for most sites.
        </li>
        <li>
          <strong className="text-[#14140F]">
            Sending a file somewhere you don&apos;t control (email, a client&apos;s CMS, print):
          </strong>{" "}
          stick with JPG or PNG until you&apos;ve confirmed the destination handles WebP.
        </li>
      </ul>

      <H2>The mistake that actually costs you quality</H2>
      <p>
        The one habit worth breaking: repeatedly editing and re-saving a JPG. Every save
        re-applies lossy compression on top of the previous pass, so a screenshot that&apos;s been
        cropped, annotated, and re-exported five times looks visibly worse than the same edits
        made once. If a file is going to be edited more than once, keep a PNG (or your editor&apos;s
        native format) as the working copy, and only export to JPG as the final step.
      </p>
      <p>
        Whichever direction you&apos;re converting, our{" "}
        <Link href="/tools/compress-png" className="font-medium text-[#4438CA] hover:underline">
          Compress PNG
        </Link>
        ,{" "}
        <Link href="/tools/compress-jpg" className="font-medium text-[#4438CA] hover:underline">
          Compress JPG
        </Link>
        , and{" "}
        <Link href="/tools/image-converter" className="font-medium text-[#4438CA] hover:underline">
          Image Converter
        </Link>{" "}
        tools handle the conversion instantly in your browser — the file never leaves your device
        to get compressed.
      </p>
    </GuideTemplate>
  );
}
