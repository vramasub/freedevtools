import type { Metadata } from "next";
import Link from "next/link";
import GuideTemplate from "@/components/guides/GuideTemplate";
import { GuideH2 as H2 } from "@/components/guides/prose";
import { getGuideBySlug } from "@/lib/guides-registry";
import { buildPageMetadata } from "@/lib/seo";

const guide = getGuideBySlug("pdf-vs-docx")!;
export const metadata: Metadata = buildPageMetadata({
  title: guide.title,
  description: guide.description,
  path: `/guides/${guide.slug}`,
});

export default function PdfVsDocxGuidePage() {
  return (
    <GuideTemplate guide={guide}>
      <p>
        &quot;Can you send that as a PDF?&quot; and &quot;can you send me the Word doc?&quot; sound
        like the same request with a different file extension attached. They&apos;re not. One is
        asking for a document that&apos;s finished and won&apos;t change. The other is asking for
        a document that&apos;s still meant to be worked on. Mixing them up is how a signed
        contract ends up editable, or a document someone needed to actually revise arrives as a
        format they can&apos;t touch.
      </p>

      <H2>What PDF actually is</H2>
      <p>
        PDF stands for Portable Document Format, and the &quot;portable&quot; part is the entire
        reason it exists: a PDF is meant to look identical no matter what device, operating
        system, or software opens it. It embeds its own fonts and locks down the exact layout, so
        the page you designed is the page everyone else sees — no reflowing, no substituted fonts,
        no surprises. That fixed layout is a feature, not a limitation: it&apos;s what makes a PDF
        trustworthy as a final, unambiguous version of something.
      </p>
      <p>
        Editing a PDF is technically possible but was never the point of the format. Any edit
        you make is a workaround layered on top of a format designed to resist exactly that.
      </p>

      <H2>What DOCX actually is</H2>
      <p>
        DOCX is a live document format built around paragraphs, styles, and structure that&apos;s
        meant to keep changing — track changes, comments, collaborative editing, templates other
        people fill in. Its layout isn&apos;t fixed the way a PDF&apos;s is: open the same DOCX on
        a machine with different fonts installed or a different default page size, and the text
        can reflow. That&apos;s not a bug, it&apos;s the trade-off for being genuinely editable.
      </p>

      <H2>Where PDF wins</H2>
      <p>
        Anything meant to be a finished, final artifact: an invoice, a contract, a resume you&apos;re
        sending to a stranger, a report going out the door, anything that needs a signature or
        needs to look identical whether it&apos;s opened on a laptop, a phone, or printed. PDF is
        also harder to alter by accident — a real advantage when the whole point is that the
        content shouldn&apos;t change after it&apos;s sent.
      </p>

      <H2>Where DOCX wins</H2>
      <p>
        Anything still in progress: a draft going through review, a document multiple people are
        editing with track changes on, a template someone else needs to fill in and modify. If the
        recipient&apos;s next step is to change the content, DOCX is the format that lets them do
        that without a workaround.
      </p>

      <H2>The mismatch that causes real friction</H2>
      <p>
        Send a DOCX when you meant &quot;this is final, please don&apos;t change it,&quot; and
        you&apos;ve handed someone an editable document with an implicit invitation to edit it.
        Send a PDF when the recipient actually needs to revise the content, and you&apos;ve handed
        them a format that actively resists that — their only path forward is reconstructing the
        document from scratch or running it through a PDF-to-Word conversion, which is inherently
        best-effort: it can recover headings, paragraphs, and tables reasonably well, but it&apos;s
        rebuilding an editable structure from a format that was never meant to have one, not
        recovering an original that still exists somewhere.
      </p>

      <H2>The rule of thumb</H2>
      <p>
        If you&apos;d be upset that someone changed it, send a PDF. If you&apos;d be upset that
        someone <em>couldn&apos;t</em>{" "}
        change it, send a DOCX. Everything else follows from that one question.
      </p>
      <p>
        Need to move between the two? Our{" "}
        <Link href="/tools/word-to-pdf" className="font-medium text-[#4438CA] hover:underline">
          Word to PDF
        </Link>{" "}
        converter produces a real, selectable-text PDF from a DOCX — not a flattened screenshot —
        and{" "}
        <Link href="/tools/pdf-to-word" className="font-medium text-[#4438CA] hover:underline">
          PDF to Word
        </Link>{" "}
        reconstructs an editable document from a PDF, both entirely in your browser.
      </p>
    </GuideTemplate>
  );
}
