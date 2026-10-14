import { NextResponse } from "next/server";

export async function GET() {
  const readAccessToken = process.env.TMDB_READ_ACCESS_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;
  if (!readAccessToken && !apiKey) {
    return NextResponse.json(
      {
        message:
          "Configure TMDB_READ_ACCESS_TOKEN or TMDB_API_KEY in .env.local.",
      },
      { status: 503 },
    );
  }

  try {
    const url = new URL("https://api.themoviedb.org/3/movie/popular");
    url.searchParams.set("language", "en-US");
    url.searchParams.set("page", "1");
    if (!readAccessToken && apiKey) url.searchParams.set("api_key", apiKey);

    const response = await fetch(url, {
      headers: readAccessToken
        ? { Authorization: `Bearer ${readAccessToken}` }
        : undefined,
      next: { revalidate: 1800 },
    });
    if (!response.ok) {
      return NextResponse.json(
        { message: "Movie provider request failed." },
        { status: response.status },
      );
    }
    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json(
      { message: "Unable to reach movie provider." },
      { status: 502 },
    );
  }
}
