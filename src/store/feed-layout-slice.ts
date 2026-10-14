import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FeedLayoutState {
  itemIds: string[];
}

const initialState: FeedLayoutState = { itemIds: [] };

const feedLayoutSlice = createSlice({
  name: "feedLayout",
  initialState,
  reducers: {
    reorderVisibleItems(
      state,
      action: PayloadAction<{
        activeId: string;
        overId: string;
        visibleIds: string[];
      }>,
    ) {
      const { activeId, overId, visibleIds } = action.payload;
      const fromIndex = visibleIds.indexOf(activeId);
      const toIndex = visibleIds.indexOf(overId);
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;

      const reorderedVisible = [...visibleIds];
      const [movedId] = reorderedVisible.splice(fromIndex, 1);
      reorderedVisible.splice(toIndex, 0, movedId);

      const visibleSet = new Set(visibleIds);
      const itemIds = [...state.itemIds];
      for (const id of visibleIds) {
        if (!itemIds.includes(id)) itemIds.push(id);
      }

      let visibleIndex = 0;
      state.itemIds = itemIds.map((id) =>
        visibleSet.has(id) ? reorderedVisible[visibleIndex++] : id,
      );
    },
    hydrateFeedOrder(state, action: PayloadAction<string[]>) {
      state.itemIds = [
        ...new Set(action.payload.filter((id) => typeof id === "string")),
      ];
    },
  },
});

export const { reorderVisibleItems, hydrateFeedOrder } =
  feedLayoutSlice.actions;
export default feedLayoutSlice.reducer;
