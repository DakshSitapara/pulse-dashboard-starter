import { describe, expect, it } from "vitest";
import reducer, { toggleCategory, setTheme } from "./preferences-slice";

describe("preferences reducer", () => {
  it("starts with useful default categories and light theme", () => {
    const state = reducer(undefined, { type: "init" });
    expect(state.categories).toContain("technology");
    expect(state.theme).toBe("light");
  });

  it("toggles a category on and off", () => {
    const initial = reducer(undefined, { type: "init" });
    const added = reducer(initial, toggleCategory("sports"));
    expect(added.categories).toContain("sports");
    const removed = reducer(added, toggleCategory("sports"));
    expect(removed.categories).not.toContain("sports");
  });

  it("sets the theme", () => {
    const state = reducer(undefined, setTheme("dark"));
    expect(state.theme).toBe("dark");
  });
});
