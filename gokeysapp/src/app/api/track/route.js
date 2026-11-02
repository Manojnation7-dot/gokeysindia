import { NextResponse } from "next/server";

// Page-view tracking: forwards the visit to Django (/api/track/).
// Django only trusts the visitor's address when it comes with TRACK_PROXY_SECRET (same value in Vercel and in the
// Django .env); it never trusts X-Forwarded-For. The address is taken from Vercel's own x-real-ip header, which a
// visitor cannot set. Django keeps only its /24 network and deletes page views after 90 days.
export async function POST(req) {
  try {
    const data = await req.json();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.gokeys.in";
    const secret = process.env.TRACK_PROXY_SECRET || "";
    const clientIp = req.headers.get("x-real-ip") || (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
    const response = await fetch(`${apiUrl}/api/track/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": req.headers.get("user-agent") || "",
        ...(secret && clientIp ? { "X-Track-Secret": secret, "X-Client-IP": clientIp } : {}),
      },
      body: JSON.stringify(data),
    });

    const text = await response.text();
    let result;

    try {
      result = JSON.parse(text); // Try parsing as JSON
    } catch {
      result = { status: "error", message: "Non-JSON response" };
    }

    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("Error in /api/track proxy:", error?.message || error);
    return NextResponse.json({ status: "error", message: "Tracking failed" }, { status: 500 });
  }
}
