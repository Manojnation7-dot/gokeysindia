import { NextResponse } from 'next/server';

export async function POST(request) {
  const { path, url, title, referrer } = await request.json();


  // Example: save to DB or forward to your analytics provider
  // await saveTracking({ path, url, title, referrer });

  return NextResponse.json({ success: true });
}