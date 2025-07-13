"use client";
import { useEffect, useState } from "react";

export default function ProjectorPage() {
  const [verse, setVerse] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/project");
      const data = await res.json();
      setVerse(data.projected?.verse);
    };

    load();
    const interval = setInterval(load, 3000); // Polling every 3s
    return () => clearInterval(interval);
  }, []);

  if (!verse)
    return (
      <div className="text-white text-center mt-20">
        No verse projected yet...
      </div>
    );

  return (
    <div className="h-screen bg-black flex items-center justify-center px-8 text-white">
      <div className="text-center">
        <p className="text-5xl font-bold mb-6">{verse.text}</p>
        <p className="text-xl text-gray-400">
          {verse.Book.name} {verse.chapter}:{verse.verse}
        </p>
      </div>
    </div>
  );
}
