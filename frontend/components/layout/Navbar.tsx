"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartPulse, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme-context";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/chat", label: "Medicine lookup" },
  { href: "/clinics", label: "Find clinics" },
  { href: "/medicines", label: "Medicines A–Z" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="border-b border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3 transition-colors">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-500">
            <HeartPulse className="h-4 w-4 text-white" />
          </span>
          HealthAssist UG
        </Link>

        {/* Links + theme toggle */}
        <div className="flex items-center gap-1">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm transition-colors",
                    pathname === href
                      ? "font-medium text-brand-500"
                      : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
