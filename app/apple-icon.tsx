import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#14171c",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: "50%",
            border: "7px solid #e8a33d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 46,
              height: 7,
              background: "#e8a33d",
              borderRadius: 4,
              top: "50%",
              left: "50%",
              transform: "translate(-14%, -50%) rotate(-40deg)",
              transformOrigin: "left center",
            }}
          />
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#e8a33d",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
