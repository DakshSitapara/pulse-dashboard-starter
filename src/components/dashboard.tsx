"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSearch } from "@/components/app-shell";
import {
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  SlidersHorizontal,
  ChevronDown,
  Radio,
} from "lucide-react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useGetMoviesQuery, useGetNewsQuery } from "@/store/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { reorderVisibleItems } from "@/store/feed-layout-slice";
import { ContentCard } from "@/components/content-card";
import type { ContentItem } from "@/types/content";
import type { Category } from "@/store/preferences-slice";

const PAGE_SIZE = 8;

export function Dashboard() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { search } = useAppSearch();
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedSource, setSelectedSource] = useState("all");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const deferredSearch = useDeferredValue(debouncedSearch.trim().toLowerCase());
  const preferences = useAppSelector((state) => state.preferences);
  const feedOrder = useAppSelector((state) => state.feedLayout.itemIds);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearch(search), 250);
    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const {
    data: news = [],
    isLoading: newsLoading,
    isError: newsError,
    refetch: refetchNews,
  } = useGetNewsQuery(
    preferences.categories.length ? preferences.categories : ["technology"],
  );

  const {
    data: movies = [],
    isLoading: moviesLoading,
    isError: moviesError,
    refetch: refetchMovies,
  } = useGetMoviesQuery();

  const items = useMemo<ContentItem[]>(() => {
    const combined = [...news, ...movies];
    const seen = new Set<string>();
    const order = new Map(feedOrder.map((id, index) => [id, index]));

    return combined
      .filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);

        const matchesSearch =
          !deferredSearch ||
          `${item.title} ${item.description} ${item.category} ${item.author ?? ""} ${(item.tags ?? []).join(" ")}`
            .toLowerCase()
            .includes(deferredSearch);

        const matchesSource =
          selectedSource === "all" || item.source === selectedSource;

        const matchesCategory =
          preferences.categories.length === 0 ||
          (item.source === "movie"
            ? preferences.categories.includes("entertainment")
            : preferences.categories.includes(item.category as Category));

        return matchesSearch && matchesSource && matchesCategory;
      })
      .sort(
        (left, right) =>
          (order.get(left.id) ?? Number.MAX_SAFE_INTEGER) -
          (order.get(right.id) ?? Number.MAX_SAFE_INTEGER),
      );
  }, [
    news,
    movies,
    deferredSearch,
    selectedSource,
    preferences.categories,
    feedOrder,
  ]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [deferredSearch, selectedSource, preferences.categories]);

  const loading = newsLoading || moviesLoading;
  const hasError = newsError || moviesError;
  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setVisibleCount((current) =>
          Math.min(current + PAGE_SIZE, items.length),
        );
      },
      {
        root: null,
        rootMargin: "300px 0px",
        threshold: 0,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, items.length, visibleCount]);

  const handleDragEnd = (event: DragEndEvent) => {
    if (!event.over || event.active.id === event.over.id) return;

    dispatch(
      reorderVisibleItems({
        activeId: String(event.active.id),
        overId: String(event.over.id),
        visibleIds: visibleItems.map((item) => item.id),
      }),
    );
  };

  const handleSourceChange = (source: string) => {
    setSelectedSource(source);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <main className="page-content">
      <section className="welcome-row">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-dot" /> YOUR PERSONALIZED DASHBOARD
          </div>
          <h1>
            Your world, <span>in focus.</span>
          </h1>
          <p className="welcome-copy">
            A fresh perspective on the things you care about.
          </p>
        </div>
        <button
          className="customize-button"
          onClick={() => router.push("/settings")}
        >
          <SlidersHorizontal size={16} /> Customize feed
        </button>
      </section>

      <section className="hero-banner">
        <div className="hero-orb orb-one" />
        <div className="hero-orb orb-two" />
        <div className="hero-content">
          <div className="hero-kicker">
            <Sparkles size={14} /> YOUR DAILY BRIEFING
          </div>
          <h2>
            Curiosity looks
            <br />
            good on you.
          </h2>
          <p>Ideas, stories, and discoveries selected around your interests.</p>
          <a href="#feed" className="hero-cta">
            Explore your feed <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="hero-side-note">
          <span className="hero-line" />
          <span>STAY CURIOUS</span>
          <span className="hero-line" />
        </div>
      </section>

      <section className="stats-grid" aria-label="Feed summary">
        <div className="stat-card">
          <span className="stat-icon mint">
            <Sparkles size={17} />
          </span>
          <div>
            <p className="stat-label">Your interests</p>
            <p className="stat-value">
              {preferences.categories.length}
              <small> topics</small>
            </p>
          </div>
          <span className="stat-detail">Personalized</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon peach">
            <TrendingUp size={17} />
          </span>
          <div>
            <p className="stat-label">In your feed</p>
            <p className="stat-value">
              {items.length}
              <small> stories</small>
            </p>
          </div>
          <span className="stat-detail">Across sources</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon lavender">
            <Radio size={17} />
          </span>
          <div>
            <p className="stat-label">Live sources</p>
            <p className="stat-value">
              02<small> channels</small>
            </p>
          </div>
          <span className="stat-detail">News · Movies</span>
        </div>
      </section>

      <section className="feed-section" id="feed">
        <div className="section-heading">
          <div>
            <div className="section-overline">HANDPICKED FOR YOU</div>
            <h2>
              Your daily mix <span className="heading-spark">✳</span>
            </h2>
          </div>
          <button
            className="sort-button"
            onClick={() => {
              refetchNews();
              refetchMovies();
            }}
          >
            <Radio size={15} /> Refresh feed
          </button>
        </div>

        <div className="filter-row" aria-label="Filter feed">
          {["all", "news", "movie"].map((source) => (
            <button
              key={source}
              onClick={() => handleSourceChange(source)}
              className={`filter-chip ${selectedSource === source ? "selected" : ""}`}
            >
              {source === "all"
                ? "Everything"
                : source === "movie"
                  ? "Movies"
                  : "News"}
            </button>
          ))}
          <span className="filter-spacer" />
          <span className="results-label">
            {items.length} results <ChevronDown size={14} />
          </span>
        </div>

        {loading && (
          <div className="loading-row" role="status" aria-live="polite">
            <span className="spinner" /> Bringing your feed together…
          </div>
        )}

        {hasError && (
          <div className="notice error-notice" role="alert">
            <strong>Some sources could not load.</strong>
            <span>
              Check your API keys and server connection. Content from other
              available sources is still shown.
            </span>
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="empty-state" role="status">
            <Sparkles size={24} />
            <h3>No stories found</h3>
            <p>Try a different search or update your interests.</p>
          </div>
        )}

        <DndContext
          id="pulse-feed"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={visibleItems.map((item) => item.id)}
            strategy={rectSortingStrategy}
          >
            <div className="content-grid">
              {visibleItems.map((item, index) => (
                <ContentCard
                  key={item.id}
                  item={item}
                  sortable
                  featured={
                    index === 0 && !deferredSearch && selectedSource === "all"
                  }
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {hasMore && (
          <div
            ref={loadMoreRef}
            className="infinite-scroll-sentinel"
            role="status"
            aria-live="polite"
            aria-label="Loading more content as you scroll"
          >
            <span className="spinner" />
            <span>Loading more stories…</span>
          </div>
        )}

        {!loading && !hasMore && items.length > PAGE_SIZE && (
          <p className="end-of-feed">You’re all caught up.</p>
        )}
      </section>
    </main>
  );
}
