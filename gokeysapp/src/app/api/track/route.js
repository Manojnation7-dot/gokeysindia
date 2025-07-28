import { NextResponse } from "next/server";

export async function POST(req) {
  const data = await req.json();

  try {
    const res = await fetch("https://api.gokeys.in/track/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return NextResponse.json(result, { status: res.status });
  } catch (err) {
    console.error("Tracking error:", err);
    return NextResponse.json({ status: "error", message: "Failed to forward to Django" }, { status: 500 });
  }
}