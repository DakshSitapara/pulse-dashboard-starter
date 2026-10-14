import { describe, expect, it } from "vitest";
import reducer, {
  hydrateFeedOrder,
  reorderVisibleItems,
} from "./feed-layout-slice";

describe("feed layout reducer", () => {
  it("reorders visible items while retaining hidden item positions", () => {
    const initial = reducer(
      undefined,
      hydrateFeedOrder(["one", "hidden", "two"]),
    );
    const reordered = reducer(
      initial,
      reorderVisibleItems({
        activeId: "two",
        overId: "one",
        visibleIds: ["one", "two"],
      }),
    );

    expect(reordered.itemIds).toEqual(["two", "hidden", "one"]);
  });

  it("adds newly visible items to the saved order", () => {
    const reordered = reducer(
      undefined,
      reorderVisibleItems({
        activeId: "two",
        overId: "one",
        visibleIds: ["one", "two"],
      }),
    );

    expect(reordered.itemIds).toEqual(["two", "one"]);
  });
});
