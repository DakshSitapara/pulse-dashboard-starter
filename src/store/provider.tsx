"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./index";
import { hydratePreferences } from "./preferences-slice";
import { hydrateFavorites } from "./favorites-slice";
import { hydrateFeedOrder } from "./feed-layout-slice";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(makeStore);

  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem("pulse:preferences");
      const savedFavorites = localStorage.getItem("pulse:favorites");
      const savedFeedOrder = localStorage.getItem("pulse:feed-order");
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences);
        store.dispatch(hydratePreferences(parsed));
      }
      if (savedFavorites) {
        store.dispatch(hydrateFavorites(JSON.parse(savedFavorites)));
      }
      if (savedFeedOrder) {
        store.dispatch(hydrateFeedOrder(JSON.parse(savedFeedOrder)));
      }
    } catch {
      // Ignore invalid local storage and continue with safe defaults.
    }

    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      localStorage.setItem(
        "pulse:preferences",
        JSON.stringify(state.preferences),
      );
      localStorage.setItem(
        "pulse:favorites",
        JSON.stringify(state.favorites.items),
      );
      localStorage.setItem(
        "pulse:feed-order",
        JSON.stringify(state.feedLayout.itemIds),
      );
    });
    return unsubscribe;
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
