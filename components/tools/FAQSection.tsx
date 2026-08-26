export interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection({ items }: { items: FAQItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section aria-labelledby="faq-heading" className="mt-12">
      <h2
        id="faq-heading"
        className="text-xl font-semibold text-[#14140F]"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Frequently asked questions
      </h2>
      <dl className="mt-4 space-y-6" style={{ fontFamily: "var(--font-ibm-plex-sans)" }}>
        {items.map((item) => (
          <div key={item.question}>
            <dt className="font-medium text-[#14140F]">{item.question}</dt>
            <dd className="mt-1 text-sm leading-6 text-[#14140F]/70">{item.answer}</dd>
          </div>
        ))}
      </dl>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
