import Link from "next/link";
import { Heart } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/chat", label: "Medicine lookup" },
  { href: "/clinics", label: "Find clinics" },
  { href: "/medicines", label: "Browse medicines" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white px-6 py-3">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-gray-900">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-500">
            <Heart className="h-4 w-4 text-white" />
          </div>
          HealthAssist UG
        </Link>
        <div className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-500 hover:text-brand-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
