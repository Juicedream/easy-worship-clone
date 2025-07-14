"use client";
import { useStorage } from "@liveblocks/react";
import { useEffect, useState } from "react";
 import {motion, AnimatePresence} from "framer-motion";

export default function Projector() {
    const [theme, setTheme] = useState<"dark" | "light">("dark");
  const verse = useStorage((root) => root.currentVerse);
  useEffect(() => {
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
  }, [verse]);

  if (
    !verse ||
    typeof verse !== "object" ||
    verse === null ||
    !("book" in verse) ||
    !("chapter" in verse) ||
    !("verse" in verse) ||
    !("text" in verse)
  ) {
    return (
      <div className="h-screen flex items-center justify-center text-4xl text-gray-400">
        Waiting for verse to be selected...
      </div>
    );
  }

  return (
    <div
      className={`h-screen w-screen p-10 flex flex-col items-center justify-center ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="text-2xl text-gray-600 mb-2">
        {(verse as any).book} {(verse as any).chapter}:{(verse as any).verse}
      </div>
      <div className="text-5xl font-bold max-w-4xl text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${verse.book}-${verse.chapter}-${verse.verse}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={`text-6xl font-bold ${theme === "light" ? "text-black":"text-white"} leading-snug max-w-5xl text-center`}
          >
            {`"${(verse as any).text}"`}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="absolute bottom-4 right-4 text-sm opacity-50">
        Press <strong>F</strong> for fullscreen | <strong>T</strong> to toggle
        theme
      </div>
    </div>
  );
}
