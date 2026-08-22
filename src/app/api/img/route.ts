import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new Response("Missing url", { status: 400 });

  try {
    const upstream = await fetch(url);

    const contentType = upstream.headers.get("content-type") || "image/png";
    const buffer = await upstream.arrayBuffer();

    return new Response(buffer, {
      status: upstream.status,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
      },
    });
  } catch {
    return new Response("Failed to fetch image", { status: 502 });
  }
}
