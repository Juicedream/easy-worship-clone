"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";

type Log = {
  id: number;
  bookId: number;
  chapter: number;
  verse: number;
  timestamp: string;
  Book: { name: string };
};

export default function HistoryPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");

  // fetch once on mount
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/log");
      const data = await res.json();
      setLogs(data);
      setLoading(false);
    })();
  }, []);

  /** ---------- filtering ---------- */
  const filtered = logs
    .filter((log) => {
      const date = new Date(log.timestamp).toISOString().split("T")[0];
      return (!fromDate || date >= fromDate) && (!toDate || date <= toDate);
    })
    .filter((log) => {
      const q = search.toLowerCase();
      return (
        !q ||
        log.Book.name.toLowerCase().includes(q) ||
        log.chapter.toString().includes(q) ||
        log.verse.toString().includes(q)
      );
    });

  /** ---------- group by day ---------- */
  const grouped: Record<string, Log[]> = {};
  filtered.forEach((log) => {
    const day = new Date(log.timestamp).toLocaleDateString();
    (grouped[day] = grouped[day] || []).push(log);
  });

  if (loading) return <p className="p-4">Loading history…</p>;

  return (
    <>
      <Navbar />

      <div className="p-4 space-y-4">
        <h2 className="text-2xl font-bold">📜 Projection History</h2>

        {/* filters */}
        <div className="flex flex-wrap gap-4 mt-2">
          <div>
            <label className="text-sm block">From:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="text-sm block">To:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="text-sm block">Search:</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. John or 3"
              className="border rounded px-2 py-1 text-sm w-full"
            />
          </div>
        </div>

        <button
          onClick={async () => {
            if (confirm("Clear all projection history?")) {
              await fetch("/api/log", { method: "DELETE" });
              setLogs([]);
            }
          }}
          className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700"
        >
          🗑️ Clear All Logs
        </button>

        {/* history list */}
        {Object.keys(grouped).length === 0 ? (
          <p>No projection history for current filters.</p>
        ) : (
          Object.entries(grouped).map(([date, list]) => (
            <div key={date}>
              <h3 className="text-lg font-semibold mt-4">{date}</h3>
              <ul className="space-y-1 mt-2">
                {list.map((log) => (
                  <li key={log.id} className="p-2 bg-gray-500 rounded">
                    {log.Book.name} {log.chapter}:{log.verse}
                    <span className="text-xs text-gray-300 ml-2">
                      at {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </>
  );
}
