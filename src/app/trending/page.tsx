"use client";

import { TrendingUp } from "lucide-react";
import { useGetMoviesQuery, useGetNewsQuery } from "@/store/api";
import { ContentCard } from "@/components/content-card";

export default function TrendingPage() {
  const {
    data: news = [],
    isLoading: newsLoading,
    isError: newsError,
  } = useGetNewsQuery(["technology"]);
  const {
    data: movies = [],
    isLoading: moviesLoading,
    isError: moviesError,
  } = useGetMoviesQuery();
  const items = [...movies.slice(0, 6), ...news.slice(0, 6)];
  return (
    <main className="standalone-page">
      <div className="settings-heading">
        <span className="section-overline">
          <TrendingUp size={13} /> WHAT&apos;S GETTING ATTENTION
        </span>
        <h1>
          Trending now<span className="heading-spark"> ✳</span>
        </h1>
        <p>A pulse check on stories and entertainment worth discovering.</p>
      </div>
      {(newsLoading || moviesLoading) && (
        <div className="loading-row">
          <span className="spinner" /> Finding what&apos;s trending…
        </div>
      )}
      {(newsError || moviesError) && (
        <div className="notice error-notice" role="alert">
          Some trending sources could not load. Try again later.
        </div>
      )}
      {!newsLoading && !moviesLoading && items.length === 0 && (
        <div className="empty-state">
          <TrendingUp size={24} />
          <h2>No trending content available</h2>
          <p>Check back when your content sources have new results.</p>
        </div>
      )}
      <div className="content-grid">
        {items.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}
