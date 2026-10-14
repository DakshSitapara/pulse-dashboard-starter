import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ContentItem } from "@/types/content";

interface NewsResponse {
  articles: Array<{
    title: string;
    category?: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    source?: { name?: string };
  }>;
}

interface MoviesResponse {
  results: Array<{
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
  }>;
}

export const contentApi = createApi({
  reducerPath: "contentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  tagTypes: ["News", "Movies"],
  endpoints: (builder) => ({
    getNews: builder.query<ContentItem[], string[]>({
      query: (categories) =>
        `news?category=${encodeURIComponent(categories.join(","))}`,
      transformResponse: (response: NewsResponse, _meta, categories) =>
        (response.articles ?? []).map((article, index) => ({
          id: `news:${article.url || index}`,
          source: "news" as const,
          title: article.title || "Untitled article",
          description: article.description || "Open the article to read more.",
          imageUrl: article.urlToImage || undefined,
          category: article.category || categories[0] || "technology",
          url: article.url,
          publishedAt: article.publishedAt,
          author: article.source?.name || "News source",
        })),
      providesTags: ["News"],
    }),
    getMovies: builder.query<ContentItem[], void>({
      query: () => "movies",
      transformResponse: (response: MoviesResponse) =>
        (response.results ?? []).map((movie) => ({
          id: `movie:${movie.id}`,
          source: "movie" as const,
          title: movie.title,
          description: movie.overview || "No description is available yet.",
          imageUrl: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : undefined,
          category: "entertainment",
          publishedAt: movie.release_date,
          rating: movie.vote_average,
          url: `https://www.themoviedb.org/movie/${movie.id}`,
        })),
      providesTags: ["Movies"],
    }),
  }),
});

export const { useGetNewsQuery, useGetMoviesQuery } = contentApi;
