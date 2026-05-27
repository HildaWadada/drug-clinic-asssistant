/**
 * route.ts — /api/clinics proxy
 * Forwards clinic requests from the browser to the FastAPI backend.
 */

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${BACKEND_URL}/api/clinics${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { detail: "Failed to connect to the backend." },
      { status: 502 }
    );
  }
}
