export const ogColors = {
  canvas: "#14171c",
  panel: "#1b1f26",
  border: "#2a2f38",
  ink: "#e7e5e0",
  inkMuted: "#9aa0ac",
  accent: "#e8a33d",
};

export function OgLogoMark({ size = 56 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `${Math.max(3, Math.round(size * 0.065))}px solid ${ogColors.accent}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: size * 0.42,
          height: Math.max(3, size * 0.065),
          background: ogColors.accent,
          borderRadius: 4,
          top: "50%",
          left: "50%",
          transform: "translate(-14%, -50%) rotate(-40deg)",
          transformOrigin: "left center",
        }}
      />
      <div
        style={{
          width: size * 0.16,
          height: size * 0.16,
          borderRadius: "50%",
          background: ogColors.accent,
        }}
      />
    </div>
  );
}

/** Subtle repeating grid backdrop matching the site's canvas texture. */
export const ogGridBackground = {
  backgroundImage: `linear-gradient(${ogColors.border} 1px, transparent 1px), linear-gradient(90deg, ${ogColors.border} 1px, transparent 1px)`,
  backgroundSize: "44px 44px",
} as const;
