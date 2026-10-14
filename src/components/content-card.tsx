"use client";

import {
  Bookmark,
  ExternalLink,
  Heart,
  Film,
  Newspaper,
  GripVertical,
} from "lucide-react";
import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/favorites-slice";
import type { ContentItem } from "@/types/content";

const sourceMeta = {
  news: { label: "NEWS", icon: Newspaper },
  movie: { label: "CINEMA", icon: Film },
};

export function ContentCard({
  item,
  featured = false,
  sortable = false,
}: {
  item: ContentItem;
  featured?: boolean;
  sortable?: boolean;
}) {
  const dispatch = useAppDispatch();
  const favorite = useAppSelector((state) =>
    state.favorites.items.some((entry) => entry.id === item.id),
  );
  const meta = sourceMeta[item.source];
  const Icon = meta.icon;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: !sortable });

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.55 : 1,
        zIndex: isDragging ? 1 : undefined,
      }}
      className={`content-card ${featured ? "featured-card" : ""}`}
    >
      {item.imageUrl ? (
        <div className={`card-image ${featured ? "featured-image" : ""}`}>
          <Image
            src={item.imageUrl}
            alt=""
            width={700}
            height={450}
            sizes="(max-width: 760px) 100vw, (max-width: 1150px) 50vw, 33vw"
            unoptimized
            loading="lazy"
          />
          <span className="source-pill">
            <Icon size={12} /> {meta.label}
          </span>
        </div>
      ) : (
        <div className="card-placeholder">
          <Icon size={26} />
          <span className="source-pill">
            <Icon size={12} /> {meta.label}
          </span>
        </div>
      )}
      <div className="card-content">
        <div className="card-meta">
          <span>{item.category}</span>
          {item.publishedAt && (
            <span>
              {new Date(item.publishedAt).toLocaleDateString("en-US", {
                timeZone: "UTC",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>
        <h3>{item.title}</h3>
        <p className="card-description">{item.description}</p>
        <div className="card-footer">
          <span className="card-author">
            {item.author ||
              (item.source === "movie"
                ? `★ ${item.rating?.toFixed(1) ?? "—"} rating`
                : "Curated for you")}
          </span>
          <div className="card-actions">
            {sortable && (
              <button
                className="mini-action drag-handle"
                {...attributes}
                {...listeners}
                aria-label={`Reorder ${item.title}`}
                title="Drag to reorder"
              >
                <GripVertical size={16} />
              </button>
            )}
            <button
              className={`mini-action ${favorite ? "is-favorite" : ""}`}
              aria-label={
                favorite ? "Remove from favorites" : "Add to favorites"
              }
              onClick={() => dispatch(toggleFavorite(item))}
            >
              {favorite ? (
                <Heart size={16} fill="currentColor" />
              ) : (
                <Bookmark size={16} />
              )}
            </button>
            {item.url && (
              <a
                className="mini-action"
                href={item.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${item.title}`}
              >
                <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
