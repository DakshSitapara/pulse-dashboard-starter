import { describe, expect, it } from "vitest";
import reducer, { toggleFavorite } from "./favorites-slice";
import type { ContentItem } from "@/types/content";

const item: ContentItem = {
  id: "news:1",
  source: "news",
  title: "Test article",
  description: "A test description",
  category: "technology",
};

describe("favorites reducer", () => {
  it("adds a favorite", () => {
    expect(reducer(undefined, toggleFavorite(item)).items).toEqual([item]);
  });

  it("removes an existing favorite when toggled again", () => {
    const added = reducer(undefined, toggleFavorite(item));
    expect(reducer(added, toggleFavorite(item)).items).toEqual([]);
  });

  it("does not create duplicate IDs", () => {
    const once = reducer(undefined, toggleFavorite(item));
    const twice = reducer(once, toggleFavorite(item));
    expect(twice.items).toHaveLength(0);
  });
});
