const displayFont = { fontFamily: "var(--font-space-grotesk)" };

export function GuideH2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="!mt-10 text-xl font-semibold text-[#14140F]" style={displayFont}>
      {children}
    </h2>
  );
}

export function GuideCode({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-[#14140F]/5 px-1 py-0.5 text-sm">{children}</code>;
}
