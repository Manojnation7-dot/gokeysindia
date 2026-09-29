import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();

    // Pass on the visitor's IP and browser. Without these Django records this
    // server's IP and Node's user agent for every visit, so unique-visitor counts,
    // country/city and device stats were all wrong.
    const forwardedFor = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
    const response = await fetch("https://api.gokeys.in/api/track/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": req.headers.get("user-agent") || "",
        ...(forwardedFor ? { "X-Forwarded-For": forwardedFor } : {}),
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
    console.error("Error in /api/track proxy:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Tracking failed" },
      { status: 500 }
    );
  }
}