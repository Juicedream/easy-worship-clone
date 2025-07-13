"use client";

import { useState } from "react";

export default function ControlPanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
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

  const projectVerse = async (verseId: number) => {
    
    await fetch("/api/project", {
      method: "POST",
      body: JSON.stringify({ verseId }),
      headers: { "Content-Type": "application/json" },
    });
  
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">📽️ Control Panel</h1>

      <input
        className="border p-2 w-full rounded"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search a verse"
      />
      <button
        onClick={handleSearch}
        className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>

      <ul className="mt-4 space-y-2">
        {results.map((v: any) => (
          <li key={v.id} className="bg-gray-500 p-3 rounded">
            <div>
              <strong>
                {v.Book?.name} {v.chapter}:{v.verse}
              </strong>{" "}
              — {v.text}
            </div>
            <button
              onClick={() => projectVerse(v.id)}
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
            >
              Project
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
