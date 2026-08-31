import type { Metadata } from "next";
import Link from "next/link";
import GuideTemplate from "@/components/guides/GuideTemplate";
import { GuideH2 as H2 } from "@/components/guides/prose";
import { getGuideBySlug } from "@/lib/guides-registry";
import { buildPageMetadata } from "@/lib/seo";

const guide = getGuideBySlug("why-client-side-processing-is-more-private")!;
export const metadata: Metadata = buildPageMetadata({
  title: guide.title,
  description: guide.description,
  path: `/guides/${guide.slug}`,
});

export default function ClientSidePrivacyGuidePage() {
  return (
    <GuideTemplate guide={guide}>
      <p>
        &quot;We don&apos;t store your files&quot; is the standard reassurance on most online file
        tools, and it&apos;s worth reading closely, because it quietly admits something: the file
        was on their server. Maybe only briefly, maybe deleted the instant processing finished —
        but it left your device, traveled to infrastructure you don&apos;t control, and existed
        there, even if only for a second. That&apos;s the actual distinction worth understanding,
        separate from whether any given company is trustworthy.
      </p>

      <H2>What &quot;upload and process&quot; actually involves</H2>
      <p>
        A typical online converter works by sending your file to a server, processing it there,
        and sending the result back. Even with a genuine, honestly-enforced &quot;we delete it
        immediately after&quot; policy, there&apos;s a real window where a copy of your data
        existed on someone else&apos;s infrastructure — request logs, temporary storage,
        automated backups, a misconfigured bucket, an employee with server access, a future
        breach, a subpoena. None of that requires anyone to be acting in bad faith. It&apos;s just
        what &quot;your file was on another company&apos;s server, even briefly&quot; structurally
        means, regardless of how good their intentions are.
      </p>

      <H2>What actually changes when nothing is uploaded</H2>
      <p>
        Client-side processing runs the entire conversion inside your own browser, using your
        device&apos;s own CPU — your browser reads the file from your disk into memory, transforms
        it there using JavaScript or WebAssembly, and hands the result back to you as a download.
        At no point does the file&apos;s bytes travel anywhere. This isn&apos;t a policy promise
        you have to take on faith — it&apos;s something you can verify yourself: open your
        browser&apos;s developer tools, watch the Network tab while you convert a file, and
        confirm there&apos;s no outgoing request carrying your data. A structural guarantee
        doesn&apos;t depend on trusting anyone&apos;s intentions, their security practices staying
        good, or their business surviving with the same policies intact.
      </p>

      <H2>Where this actually matters</H2>
      <p>
        For a low-stakes file, the distinction is mostly academic. It stops being academic fast
        for anything genuinely sensitive — financial statements, medical records, contracts still
        under negotiation, internal business data, personal photos. &quot;We promise not to look
        at it&quot; is a policy that can change, get violated, or fail. &quot;It structurally
        never left your machine&quot; isn&apos;t a promise at all — there&apos;s nothing to
        violate, because there was never a copy anywhere to violate it with.
      </p>

      <H2>The honest limits</H2>
      <p>
        Client-side processing isn&apos;t a universal fix for everything. It depends on your own
        device&apos;s processing power, so very large files take as long as your machine can
        manage — there&apos;s no server farm to lean on. And some genuinely heavy workloads simply
        require server-side infrastructure a browser can&apos;t replicate. It&apos;s the right
        approach specifically for the category of work this site does — format conversion,
        compression, encoding — where the processing genuinely fits on a device, not a claim that
        it&apos;s always the better architecture for every problem.
      </p>

      <H2>What to actually check next time</H2>
      <p>
        Before uploading something sensitive to a converter, it&apos;s worth checking whether
        it&apos;s actually processed client-side rather than trusting a &quot;we don&apos;t store
        your files&quot; claim at face value — the Network-tab check takes ten seconds and tells
        you the real answer. Our{" "}
        <Link href="/tools/csv-to-json" className="font-medium text-[#4438CA] hover:underline">
          CSV to JSON
        </Link>
        ,{" "}
        <Link href="/tools/compress-png" className="font-medium text-[#4438CA] hover:underline">
          Compress PNG
        </Link>
        , and{" "}
        <Link href="/tools/hash-generator" className="font-medium text-[#4438CA] hover:underline">
          Hash Generator
        </Link>{" "}
        tools — like everything else on this site — are built exactly that way, and you don&apos;t
        have to take our word for it.
      </p>
    </GuideTemplate>
  );
}
