import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getPageData, inr } from "@/lib/calculatorApi";

// Share card: "Char Dham Yatra Cost 2027 · from ₹21,500 per person" (live lowest Standard figure) with the logo.
export const revalidate = 3600;
export const alt = "Char Dham Yatra Cost Calculator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [data, logo] = await Promise.all([
    getPageData(),
    readFile(join(process.cwd(), "public/images/gokeyslogo.png")).catch(() => null),
  ]);
  const year = data?.year || 2027;
  const from = data?.figures?.standard_min;
  const logoSrc = logo ? `data:image/png;base64,${logo.toString("base64")}` : null;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
        background: "#12232a", color: "#fff", padding: "64px 72px", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {logoSrc && <img src={logoSrc} width={96} height={96} alt="" style={{ borderRadius: 20, background: "#fff" }} />}
          <span style={{ fontSize: 34, fontWeight: 700, color: "#cfe0e4" }}>Gokeys India</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>Char Dham Yatra Cost {year}</span>
          {from ? (
            <span style={{ marginTop: 24, fontSize: 52, fontWeight: 700, color: "#ef9d32" }}>from {inr(from)} per person</span>
          ) : null}
        </div>
        <span style={{ fontSize: 28, color: "#cfe0e4" }}>Cost calculator · Haridwar, Rishikesh, Dehradun, Delhi · gokeys.in</span>
      </div>
    ),
    size,
  );
}
