import type { Metadata } from "next";
import Link from "next/link";
import GuideTemplate from "@/components/guides/GuideTemplate";
import { GuideH2 as H2, GuideCode as Code } from "@/components/guides/prose";
import { getGuideBySlug } from "@/lib/guides-registry";
import { buildPageMetadata } from "@/lib/seo";

const guide = getGuideBySlug("csv-vs-json")!;
export const metadata: Metadata = buildPageMetadata({
  title: guide.title,
  description: guide.description,
  path: `/guides/${guide.slug}`,
});

export default function CsvVsJsonGuidePage() {
  return (
    <GuideTemplate guide={guide}>
      <p>
        Both formats show up constantly — a client sends you a CSV export from their accounting
        software, an API returns JSON, and somewhere along the way you end up converting one to
        the other without really thinking about why. Most of the time that&apos;s fine. But CSV
        and JSON aren&apos;t interchangeable representations of the same idea. They solve
        different problems, and picking the wrong one for a given job is how you end up with
        broken exports, silently dropped fields, or a config file nobody can read.
      </p>

      <H2>What CSV actually is</H2>
      <p>
        CSV (comma-separated values) is a flat table. Every row has the same columns, in the same
        order, and there&apos;s no built-in way to express that one record contains another
        record. If you&apos;ve opened a CSV in Excel or Google Sheets, that grid is a faithful
        picture of what the format is — rows and columns, nothing nested inside a cell.
      </p>
      <p>
        That simplicity is the whole point. CSV has almost no syntax overhead: no brackets, no
        quotes around every field, no repeated key names on every line. A million-row CSV of
        transaction data is dramatically smaller than the same data in JSON, because JSON repeats
        every field name (
        <Code>&quot;transaction_id&quot;</Code>
        ,{" "}
        <Code>&quot;amount&quot;</Code>) on
        every single record, while CSV states each column name exactly once, in the header row.
      </p>

      <H2>What JSON actually is</H2>
      <p>
        JSON is a tree, not a table. A value can be a string, a number, a boolean, or{" "}
        <Code>null</Code>{" "}
        — and it can also be an object or an array containing more of the same, nested as deep as you need. An order
        can have a customer object, which has an array of addresses, each with its own fields.
        There&apos;s no way to express that shape in a single flat CSV row without inventing your
        own convention for it.
      </p>
      <p>
        JSON also carries real types. A CSV cell containing{" "}
        <Code>42</Code>{" "}
        is, strictly speaking, just the text &quot;42&quot; — every consumer has to guess whether
        it&apos;s a number, and whether the empty string next to it means zero, missing, or
        intentionally blank. JSON settles that:{" "}
        <Code>42</Code>{" "}
        is a number,{" "}
        <Code>&quot;42&quot;</Code>{" "}
        is a string, and{" "}
        <Code>null</Code>{" "}
        is an explicit, unambiguous absence of a value.
      </p>

      <H2>Where CSV wins</H2>
      <p>
        Reach for CSV when the data is genuinely flat and every record shares the same fields —
        a spreadsheet export, a database table dump, a list of transactions or inventory items.
        It&apos;s the format non-technical stakeholders can actually open and edit themselves in
        Excel or Sheets, it&apos;s smaller on disk for large flat datasets, and it&apos;s the
        universal import format for accounting software, CRMs, and BI tools that were never built
        around JSON in the first place.
      </p>

      <H2>Where JSON wins</H2>
      <p>
        Reach for JSON when records don&apos;t share an identical shape, when you need real
        nesting (an order with multiple line items, a user with multiple roles), or when the data
        is going to or from an API — virtually every modern web API speaks JSON natively, and
        config files for tools like Kubernetes, npm, and VS Code use JSON (or YAML, JSON&apos;s
        close relative) specifically because the structure needs to express hierarchy that a flat
        table can&apos;t.
      </p>

      <H2>The flattening trap</H2>
      <p>
        The part that actually causes bugs: converting nested JSON to CSV requires flattening
        decisions that the format itself doesn&apos;t make for you. If an order has three line
        items, do they become three CSV rows with the order fields repeated, or one row with the
        line items squashed into a single delimited cell? Both are reasonable, and they produce
        different data. Going the other direction — CSV to JSON — doesn&apos;t add structure back;
        it just gives you flat objects with no nesting, because the CSV never had any to begin
        with. If you need real hierarchy on the other end, you have to add it deliberately, not
        expect the conversion to infer it.
      </p>

      <H2>A quick way to decide</H2>
      <p>Ask two questions before you pick a format:</p>
      <ul className="ml-5 list-disc space-y-2">
        <li>
          <strong className="text-[#14140F]">
            Does every record have the same fields, with no nesting?
          </strong>{" "}
          If yes, CSV is the simpler, smaller, more broadly-compatible choice.
        </li>
        <li>
          <strong className="text-[#14140F]">
            Do you need hierarchy, mixed types, or optional fields that vary between records?
          </strong>{" "}
          If yes, JSON is the format that can actually represent what you&apos;re describing
          without a workaround.
        </li>
      </ul>
      <p>
        When you do need to move between the two — pulling a flat CSV export into a JSON-based
        pipeline, or turning an API&apos;s JSON response into something you can open in Excel —
        our{" "}
        <Link href="/tools/csv-to-json" className="font-medium text-[#4438CA] hover:underline">
          CSV to JSON
        </Link>{" "}
        and{" "}
        <Link href="/tools/json-to-csv" className="font-medium text-[#4438CA] hover:underline">
          JSON to CSV
        </Link>{" "}
        converters handle the mechanical part instantly, entirely in your browser — but the
        decision of which format to use in the first place is still worth making on purpose.
      </p>
    </GuideTemplate>
  );
}
