"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  Compass,
  LayoutDashboard,
  Settings2,
  TrendingUp,
  Zap,
} from "lucide-react";

const links = [
  { href: "/", label: "For you", icon: LayoutDashboard },
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/favorites", label: "Favorites", icon: Bookmark },
  { href: "/settings", label: "Preferences", icon: Settings2 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/" className="brand">
        <span className="brand-mark">
          <Zap size={19} fill="currentColor" />
        </span>
        <span>
          pulse<span className="brand-dot">.</span>
        </span>
      </Link>
      <p className="nav-label">DISCOVER</p>
      <nav className="nav-list" aria-label="Main navigation">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`nav-link ${active ? "active" : ""}`}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {active && <span className="nav-indicator" />}
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note">
          <div className="note-icon">
            <Compass size={17} />
          </div>
          <p className="note-title">Your world, curated.</p>
          <p className="note-copy">A little more of what matters to you.</p>
        </div>
        <div className="profile-row">
          <div className="avatar">D</div>
          <div>
            <p className="profile-name">Guest explorer</p>
            <p className="profile-sub">Personal workspace</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
