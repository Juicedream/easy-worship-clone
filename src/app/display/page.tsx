"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DisplayPage() {
  const searchParams = useSearchParams();
  const book = searchParams.get("book");
  const chapter = parseInt(searchParams.get("chapter") || "");
  const verseStart = parseInt(searchParams.get("verse") || "");
  const verseEnd = parseInt(searchParams.get("end") || verseStart.toString());

  const [verses, setVerses] = useState<string[]>([]);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const fetchVerses = async () => {
      if (!book || !chapter || !verseStart) return;

      const res = await fetch(
        `/api/verses?book=${book}&chapter=${chapter}&start=${verseStart}&end=${verseEnd}`
      );
      const data = await res.json();
      setVerses(data.verses || []);
    };

    fetchVerses();

    // Listen for fullscreen toggle
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "f") {
        const el = document.documentElement;
        if (!document.fullscreenElement) el.requestFullscreen();
        else document.exitFullscreen();
      }
      if (e.key === "t") {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [book, chapter, verseStart, verseEnd]);

  return (
    <div
      className={`h-screen w-screen p-10 flex flex-col items-center justify-center ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="text-center space-y-6 text-4xl leading-relaxed">
        {verses.length === 0 ? (
          <p>Loading...</p>
        ) : (
          verses.map((v, i) => <p key={i}>{v}</p>)
        )}
      </div>

      <div className="absolute bottom-4 right-4 text-sm opacity-50">
        Press <strong>F</strong> for fullscreen | <strong>T</strong> to toggle
        theme
      </div>
    </div>
  );
}
