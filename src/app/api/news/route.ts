import { NextRequest, NextResponse } from "next/server";

const allowedCategories = new Set([
  "technology",
  "business",
  "science",
  "sports",
  "entertainment",
]);

export async function GET(request: NextRequest) {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { message: "NEWS_API_KEY is not configured. Add it to .env.local." },
      { status: 503 },
    );
  }

  const categories = [
    ...new Set(
      request.nextUrl.searchParams
        .getAll("category")
        .flatMap((value) => value.split(","))
        .filter((category) => allowedCategories.has(category)),
    ),
  ];
  if (categories.length === 0) categories.push("technology");

  try {
    const responses = await Promise.all(
      categories.map(async (category) => {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?category=${encodeURIComponent(category)}&language=en&pageSize=12&apiKey=${encodeURIComponent(apiKey)}`,
          { next: { revalidate: 300 } },
        );
        if (!response.ok) throw new Error("News provider request failed.");
        const data = await response.json();
        return (data.articles ?? []).map(
          (article: Record<string, unknown>) => ({
            ...article,
            category,
          }),
        );
      }),
    );
    return NextResponse.json({ articles: responses.flat() });
  } catch {
    return NextResponse.json(
      { message: "Unable to load news for the selected categories." },
      { status: 502 },
    );
  }
}
