import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ContentItem } from "@/types/content";

interface FavoritesState {
  items: ContentItem[];
}

const initialState: FavoritesState = { items: [] };

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<ContentItem>) {
      const exists = state.items.some((item) => item.id === action.payload.id);
      state.items = exists
        ? state.items.filter((item) => item.id !== action.payload.id)
        : [action.payload, ...state.items];
    },
    hydrateFavorites(state, action: PayloadAction<ContentItem[]>) {
      state.items = action.payload;
    },
  },
});

export const { toggleFavorite, hydrateFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
