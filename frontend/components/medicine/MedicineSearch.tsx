"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBar } from "../ui/SearchBar";

export function MedicineSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/medicines/${encodeURIComponent(trimmed.toLowerCase())}`);
    }
  };

  return (
    <SearchBar
      placeholder="Search for a medicine, e.g. Paracetamol..."
      value={query}
      onChange={setQuery}
      onSubmit={handleSubmit}
      className="max-w-lg"
    />
  );
}
