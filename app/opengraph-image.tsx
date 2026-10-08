import { ImageResponse } from "next/og";
import { ogColors, ogGridBackground, OgLogoMark } from "@/lib/og";
import { siteConfig } from "@/lib/utils";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 90px",
          background: ogColors.canvas,
          ...ogGridBackground,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <OgLogoMark size={64} />
          <span style={{ fontSize: 40, fontWeight: 700, color: ogColors.ink, letterSpacing: -0.5 }}>
            {siteConfig.name}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 58,
            fontWeight: 700,
            color: ogColors.ink,
            marginTop: 48,
            lineHeight: 1.15,
            maxWidth: 920,
            letterSpacing: -1,
          }}
        >
          {siteConfig.tagline}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: ogColors.inkMuted,
            marginTop: 24,
            maxWidth: 820,
          }}
        >
          {siteConfig.description}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 56,
            fontSize: 22,
            color: ogColors.accent,
            fontFamily: "monospace",
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: ogColors.accent, display: "flex" }} />
          RUNS IN YOUR BROWSER {"\u2014"} NO INSTALLS
        </div>
      </div>
    ),
    { ...size }
  );
}
