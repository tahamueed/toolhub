import { ImageResponse } from "next/og";
import { getToolBySlug, tools } from "@/lib/tools";
import { getCategory } from "@/lib/categories";
import { ogColors, ogGridBackground, OgLogoMark } from "@/lib/og";
import { siteConfig } from "@/lib/utils";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export default async function ToolOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  const category = tool ? getCategory(tool.category) : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 90px",
          background: ogColors.canvas,
          ...ogGridBackground,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <OgLogoMark size={44} />
          <span style={{ fontSize: 26, fontWeight: 600, color: ogColors.inkMuted, letterSpacing: -0.3 }}>
            {siteConfig.name}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {category && (
            <div
              style={{
                display: "flex",
                fontSize: 22,
                fontFamily: "monospace",
                letterSpacing: 2,
                textTransform: "uppercase",
                color: ogColors.accent,
                marginBottom: 20,
              }}
            >
              {category.name}
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 700,
              color: ogColors.ink,
              lineHeight: 1.1,
              letterSpacing: -1.5,
              maxWidth: 1000,
            }}
          >
            {tool ? tool.name : siteConfig.name}
          </div>
          {tool && (
            <div
              style={{
                display: "flex",
                fontSize: 28,
                color: ogColors.inkMuted,
                marginTop: 24,
                maxWidth: 880,
              }}
            >
              {tool.shortDescription}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
