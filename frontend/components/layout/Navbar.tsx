/**
 * Navbar.tsx
 * Top navigation bar shared across all pages.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/chat", label: "Medicine lookup" },
  { href: "/clinics", label: "Find clinics" },
  { href: "/medicines", label: "Medicines A–Z" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-100 bg-white px-6 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-medium text-gray-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-500">
            <HeartPulse className="h-4 w-4 text-white" />
          </span>
          HealthAssist UG
        </Link>

        {/* Links */}
        <ul className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  pathname === href
                    ? "bg-brand-50 font-medium text-brand-800"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
