import { configureStore } from "@reduxjs/toolkit";
import preferencesReducer from "./preferences-slice";
import favoritesReducer from "./favorites-slice";
import feedLayoutReducer from "./feed-layout-slice";
import { contentApi } from "./api";

export const makeStore = () =>
  configureStore({
    reducer: {
      preferences: preferencesReducer,
      favorites: favoritesReducer,
      feedLayout: feedLayoutReducer,
      [contentApi.reducerPath]: contentApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(contentApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
