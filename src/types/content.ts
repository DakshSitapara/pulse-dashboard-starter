export type ContentSource = "news" | "movie";

export interface ContentItem {
  id: string;
  source: ContentSource;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  url?: string;
  publishedAt?: string;
  author?: string;
  rating?: number;
  tags?: string[];
}
