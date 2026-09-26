import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The site's real category accent palette (lib/theme.ts), reused here as a small motif —
// Satori (next/og) can't consume Tailwind classes, so these are the raw hex values.
const accents = ["#4438CA", "#BE185D", "#E1502E", "#B5751A", "#0E7A5F"];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#FAF9F5",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          {accents.map((color) => (
            <div key={color} style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: color }} />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "36px",
            fontSize: 108,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#14140F",
          }}
        >
          {siteConfig.name}
        </div>
        <div style={{ display: "flex", marginTop: "20px", fontSize: 34, color: "#14140F99" }}>
          {siteConfig.tagline}
        </div>
        <div style={{ display: "flex", marginTop: "48px", fontSize: 26, color: "#14140F66" }}>
          Convert anything. Upload nothing.
        </div>
      </div>
    ),
    { ...size }
  );
}
