import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();

    const response = await fetch("https://api.gokeys.in/track/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const text = await response.text();
    let result;

    try {
      result = JSON.parse(text); // Try parsing as JSON
    } catch {
      // If not JSON, return raw HTML for debugging
      result = { error: "Non-JSON response", html: text };
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