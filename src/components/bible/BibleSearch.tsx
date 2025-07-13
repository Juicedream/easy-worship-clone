"use client";

import { useState } from "react";

export default function BibleSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const res = await fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({ query }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setResults(data.results);
    setLoading(false);
  };

  return (
    <div className="p-4">
      <input
        className="border p-2 w-full rounded"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search any phrase or word..."
      />
      <button
        onClick={handleSearch}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>

      <div className="mt-4 space-y-2">
        {results.map((v, idx) => (
          <div key={idx} className="bg-gray-500 text-black p-3 rounded">
            <strong>
              {v.Book?.name ?? "Unknown Book"} {v.chapter}:{v.verse}
            </strong>{" "}
            — {v.text}
          </div>
        ))}
      </div>
    </div>
  );
}
