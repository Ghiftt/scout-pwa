import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "";

export async function POST(req: NextRequest) {
  const body = await req.formData();

  const res = await fetch(`${BACKEND_URL}/verify`, {
    method: "POST",
    headers: { "x-api-key": INTERNAL_API_KEY },
    body,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}