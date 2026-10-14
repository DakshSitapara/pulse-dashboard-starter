import { test, expect, type Page } from "@playwright/test";

async function mockContentApis(page: Page) {
  const articles = Array.from({ length: 12 }, (_, index) => ({
    title: `Article ${index + 1}`,
    category: index % 2 === 0 ? "technology" : "business",
    description: `Description for article ${index + 1}`,
    url: `https://example.com/article-${index + 1}`,
    urlToImage: null,
    publishedAt: "2026-10-14T12:00:00Z",
    source: { name: "Example News" },
  }));
  await page.route(
    (url) => url.pathname === "/api/news",
    (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ articles }),
      });
    },
  );
  await page.route(
    (url) => url.pathname === "/api/movies",
    (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          results: [
            {
              id: 42,
              title: "Space Adventure",
              overview: "A family sets out across the stars.",
              poster_path: null,
              release_date: "2026-10-14",
              vote_average: 7.8,
            },
          ],
        }),
      });
    },
  );
}

test("dashboard searches and paginates content", async ({ page }) => {
  await mockContentApis(page);
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /your world/i }),
  ).toBeVisible();
  const cards = page.locator(".content-grid article");
  await expect(cards).toHaveCount(8);
  expect(pageErrors).toEqual([]);

  const search = page.getByRole("textbox", { name: /search content/i });
  await search.fill("Article 11");
  await expect(cards).toHaveCount(1);
  await expect(cards.locator("h3")).toHaveText("Article 11");

  await search.fill("Space Adventure");
  await expect(cards).toHaveCount(1);
  await expect(cards.locator("h3")).toHaveText("Space Adventure");

  await search.clear();
  await expect(cards).toHaveCount(8);
  await page.locator(".infinite-scroll-sentinel").scrollIntoViewIfNeeded();
  await expect.poll(() => cards.count()).toBeGreaterThan(8);
});

test("dashboard cards can be reordered and retain their order", async ({
  page,
}) => {
  await mockContentApis(page);
  await page.goto("/");
  const cards = page.locator(".content-grid article");
  await expect(cards).toHaveCount(8);

  const firstTitle = await cards.nth(0).locator("h3").innerText();
  const secondTitle = await cards.nth(1).locator("h3").innerText();
  const reorderHandle = page.getByRole("button", {
    name: `Reorder ${firstTitle}`,
  });
  await reorderHandle.scrollIntoViewIfNeeded();
  const handleBox = await reorderHandle.boundingBox();
  const targetBox = await cards.nth(1).boundingBox();
  if (!handleBox || !targetBox)
    throw new Error("Feed cards are not measurable");
  await page.mouse.move(
    handleBox.x + handleBox.width / 2,
    handleBox.y + handleBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    targetBox.x + targetBox.width / 2,
    targetBox.y + targetBox.height / 2,
    { steps: 10 },
  );
  await page.mouse.up();
  await expect(cards.nth(0).locator("h3")).toHaveText(secondTitle);
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("pulse:feed-order")))
    .not.toBeNull();

  await page.reload();
  await expect(cards.nth(0).locator("h3")).toHaveText(secondTitle);
});

test("preferences page exposes topic choices", async ({ page }) => {
  await page.goto("/settings");
  await expect(
    page.getByRole("heading", { name: /your preferences/i }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /technology/i })).toBeVisible();
});

test("persists topic and theme preferences across reloads", async ({
  page,
}) => {
  await page.goto("/settings");
  const sports = page.getByRole("button", { name: /sports/i });
  await sports.click();
  await expect(sports).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: /dark mode/i }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);

  await page.reload();
  await expect(page.getByRole("button", { name: /sports/i })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("uses the entertainment preference to filter movie recommendations", async ({
  page,
}) => {
  await mockContentApis(page);
  await page.goto("/");
  await expect(page.locator(".content-grid article").first()).toBeVisible();

  await page.getByRole("link", { name: "Preferences" }).click();
  const entertainment = page.getByRole("button", { name: /entertainment/i });
  await entertainment.click();
  await expect(entertainment).toHaveAttribute("aria-pressed", "false");
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("pulse:preferences")))
    .toContain('"categories":["technology","business"]');
  await page.getByRole("link", { name: "For you" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator(".stats-grid .stat-card").first()).toContainText(
    "2 topics",
  );

  await page.getByRole("button", { name: "Movies" }).click();
  await expect(page.locator(".filter-chip.selected")).toHaveText("Movies");
  await expect(
    page.getByRole("heading", { name: "No stories found" }),
  ).toBeVisible();
});

test("saves favorites and restores them after navigation and reload", async ({
  page,
}) => {
  await mockContentApis(page);
  await page.goto("/");

  const firstCard = page.locator(".content-grid article").first();
  const title = await firstCard.locator("h3").innerText();
  await firstCard.getByRole("button", { name: "Add to favorites" }).click();
  await page.getByRole("link", { name: "Favorites" }).click();
  await expect(page).toHaveURL(/\/favorites$/);
  await expect(
    page.getByRole("heading", { name: /saved for later/i }),
  ).toBeVisible();
  await expect(page.locator(".standalone-page .content-grid h3")).toHaveText(
    title,
  );

  await page.reload();
  await expect(page.locator(".standalone-page .content-grid h3")).toHaveText(
    title,
  );
});

test("keeps the sidebar, topbar, and search state across routes", async ({
  page,
}) => {
  await mockContentApis(page);
  await page.goto("/");

  const search = page.getByRole("textbox", { name: /search content/i });
  await search.fill("Article 2");
  await page.getByRole("link", { name: "Preferences" }).click();
  await expect(page).toHaveURL(/\/settings$/);
  await expect(search).toHaveValue("Article 2");
  await expect(page.locator(".sidebar")).toHaveCount(1);
  await expect(page.locator(".topbar")).toHaveCount(1);

  await page.getByRole("link", { name: "Trending" }).click();
  await expect(page).toHaveURL(/\/trending$/);
  await expect(search).toHaveValue("Article 2");
  await expect(page.locator(".sidebar")).toHaveCount(1);
  await expect(page.locator(".topbar")).toHaveCount(1);
});

test("trending cards hydrate without client/server errors", async ({
  page,
}) => {
  await mockContentApis(page);
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/trending");
  await expect(
    page.getByRole("heading", { name: /trending now/i }),
  ).toBeVisible();
  await expect(page.locator(".content-grid article").first()).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test("shows empty and error states when providers return no content", async ({
  page,
}) => {
  await page.route(
    (url) => url.pathname === "/api/news",
    (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ articles: [] }),
      }),
  );
  await page.route(
    (url) => url.pathname === "/api/movies",
    (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ message: "Movie provider unavailable." }),
      }),
  );

  await page.goto("/");
  await expect(page.locator(".error-notice")).toContainText(
    "Some sources could not load",
  );
  await expect(
    page.getByRole("status").filter({ hasText: "No stories found" }),
  ).toBeVisible();
});

test("shows a loading state while the movie request is pending", async ({
  page,
}) => {
  let releaseMoviesRequest: (() => void) | undefined;
  let notifyMoviesRequestStarted: (() => void) | undefined;
  const moviesRequestStarted = new Promise<void>((resolve) => {
    notifyMoviesRequestStarted = resolve;
  });

  await page.route(
    (url) => url.pathname === "/api/news",
    (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ articles: [] }),
      }),
  );
  await page.route(
    (url) => url.pathname === "/api/movies",
    async (route) => {
      notifyMoviesRequestStarted?.();
      await new Promise<void>((resolve) => {
        releaseMoviesRequest = resolve;
      });
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ results: [] }),
      });
    },
  );

  await page.goto("/");
  await moviesRequestStarted;
  await expect(
    page.getByRole("status").filter({ hasText: "Bringing your feed together" }),
  ).toBeVisible();
  releaseMoviesRequest?.();
  await expect(
    page.getByRole("status").filter({ hasText: "No stories found" }),
  ).toBeVisible();
});
