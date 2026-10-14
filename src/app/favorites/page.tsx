"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { ContentCard } from "@/components/content-card";

export default function FavoritesPage() {
  const favorites = useAppSelector((state) => state.favorites.items);
  return (
    <main className="standalone-page">
      <div className="settings-heading">
        <span className="section-overline">YOUR PERSONAL COLLECTION</span>
        <h1>
          Saved for later<span className="heading-spark"> ✳</span>
        </h1>
        <p>The stories and discoveries you want to come back to.</p>
      </div>
      {favorites.length ? (
        <div className="content-grid">
          {favorites.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Bookmark size={25} />
          <h3>Your collection starts here</h3>
          <p>Save a story or movie from your feed and it will show up here.</p>
          <Link href="/" className="hero-cta">
            Explore your feed
          </Link>
        </div>
      )}
    </main>
  );
}
