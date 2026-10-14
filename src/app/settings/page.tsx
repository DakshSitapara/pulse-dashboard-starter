"use client";

import { Check, Moon, Sun } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  toggleCategory,
  setTheme,
  type Category,
} from "@/store/preferences-slice";

const options: { id: Category; label: string; description: string }[] = [
  {
    id: "technology",
    label: "Technology",
    description: "Products, AI, startups, and innovation",
  },
  {
    id: "business",
    label: "Business",
    description: "Markets, companies, and the economy",
  },
  {
    id: "science",
    label: "Science",
    description: "Research, space, and discoveries",
  },
  {
    id: "sports",
    label: "Sports",
    description: "Teams, athletes, and major events",
  },
  {
    id: "entertainment",
    label: "Entertainment",
    description: "Movies, culture, and creators",
  },
];

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { categories, theme } = useAppSelector((state) => state.preferences);

  return (
    <main className="settings-page">
      <div className="settings-heading">
        <span className="section-overline">MAKE IT YOURS</span>
        <h1>Your preferences</h1>
        <p>Shape the stories and discoveries that find their way to you.</p>
      </div>
      <section className="settings-panel">
        <div className="settings-panel-heading">
          <div>
            <h2>Your interests</h2>
            <p>Choose the topics you want to see in your daily mix.</p>
          </div>
          <span className="settings-count">{categories.length} selected</span>
        </div>
        <div className="preference-list">
          {options.map((option) => {
            const selected = categories.includes(option.id);
            return (
              <button
                key={option.id}
                className={`preference-option ${selected ? "selected" : ""}`}
                onClick={() => dispatch(toggleCategory(option.id))}
                aria-pressed={selected}
              >
                <span className="preference-check">
                  {selected && <Check size={15} />}
                </span>
                <span className="preference-copy">
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </span>
              </button>
            );
          })}
        </div>
      </section>
      <section className="settings-panel">
        <div className="settings-panel-heading">
          <div>
            <h2>Appearance</h2>
            <p>Choose the look that feels right for you.</p>
          </div>
        </div>
        <div className="theme-options">
          <button
            className={`theme-option ${theme === "light" ? "selected" : ""}`}
            onClick={() => dispatch(setTheme("light"))}
          >
            <Sun size={20} />
            <span>
              <strong>Light mode</strong>
              <small>Bright and minimal</small>
            </span>
          </button>
          <button
            className={`theme-option ${theme === "dark" ? "selected" : ""}`}
            onClick={() => dispatch(setTheme("dark"))}
          >
            <Moon size={20} />
            <span>
              <strong>Dark mode</strong>
              <small>Easy on the eyes</small>
            </span>
          </button>
        </div>
      </section>
      <p className="settings-footnote">
        Your preferences are stored locally in this browser.
      </p>
    </main>
  );
}
