import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Category =
  | "technology"
  | "business"
  | "science"
  | "sports"
  | "entertainment";

interface PreferencesState {
  categories: Category[];
  theme: "light" | "dark";
}

const initialState: PreferencesState = {
  categories: ["technology", "business", "entertainment"],
  theme: "light",
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    toggleCategory(state, action: PayloadAction<Category>) {
      const category = action.payload;
      state.categories = state.categories.includes(category)
        ? state.categories.filter((item) => item !== category)
        : [...state.categories, category];
    },
    setTheme(state, action: PayloadAction<"light" | "dark">) {
      state.theme = action.payload;
    },
    hydratePreferences(state, action: PayloadAction<Partial<PreferencesState>>) {
      if (Array.isArray(action.payload.categories)) {
        state.categories = action.payload.categories;
      }
      if (action.payload.theme === "light" || action.payload.theme === "dark") {
        state.theme = action.payload.theme;
      }
    },
  },
});

export const { toggleCategory, setTheme, hydratePreferences } =
  preferencesSlice.actions;
export default preferencesSlice.reducer;
