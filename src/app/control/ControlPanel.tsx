"use client";

import { useMutation, useStorage, useStorageRoot } from "@liveblocks/react";
import { useEffect, useState } from "react";

// Define the verse type for better type safety
type Verse = {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
};

export default function ControlPanel() {
  const storageRoot = useStorageRoot();
  const currentVerse = useStorage((root) => root.currentVerse as Verse | null);
  const [verseList, setVerseList] = useState<Verse[]>([]);
  const [index, setIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("God");
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedVerse, setSelectedVerse] = useState("");
  const [searchMode, setSearchMode] = useState<"search" | "specific">("search");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if storage is loaded
  const isStorageLoaded = storageRoot !== null;

  // Common Bible books
  const bibleBooks = [
    "Genesis",
    "Exodus",
    "Leviticus",
    "Numbers",
    "Deuteronomy",
    "Joshua",
    "Judges",
    "Ruth",
    "1 Samuel",
    "2 Samuel",
    "1 Kings",
    "2 Kings",
    "1 Chronicles",
    "2 Chronicles",
    "Ezra",
    "Nehemiah",
    "Esther",
    "Job",
    "Psalms",
    "Proverbs",
    "Ecclesiastes",
    "Song of Solomon",
    "Isaiah",
    "Jeremiah",
    "Lamentations",
    "Ezekiel",
    "Daniel",
    "Hosea",
    "Joel",
    "Amos",
    "Obadiah",
    "Jonah",
    "Micah",
    "Nahum",
    "Habakkuk",
    "Zephaniah",
    "Haggai",
    "Zechariah",
    "Malachi",
    "Matthew",
    "Mark",
    "Luke",
    "John",
    "Acts",
    "Romans",
    "1 Corinthians",
    "2 Corinthians",
    "Galatians",
    "Ephesians",
    "Philippians",
    "Colossians",
    "1 Thessalonians",
    "2 Thessalonians",
    "1 Timothy",
    "2 Timothy",
    "Titus",
    "Philemon",
    "Hebrews",
    "James",
    "1 Peter",
    "2 Peter",
    "1 John",
    "2 John",
    "3 John",
    "Jude",
    "Revelation",
  ];

  // Flatten structure from API
  const flatVerse = (v: any): Verse => ({
    id: v.id,
    book: v.Book?.name || "Unknown",
    chapter: v.chapter,
    verse: v.verse,
    text: v.text,
  });

  // Search by query
  const searchByQuery = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        body: JSON.stringify({ query }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const flattened = data.results.map(flatVerse);
      setVerseList(flattened);
      setIndex(0);

      if (flattened.length > 0) {
        setVerse(flattened[0]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setError(error instanceof Error ? error.message : "Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Get specific verse
  const getSpecificVerse = async (
    book: string,
    chapter: string,
    verse: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/specificVerse", {
        method: "POST",
        body: JSON.stringify({
          book,
          chapter: parseInt(chapter),
          verse: parseInt(verse),
          specific: true,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.results && data.results.length > 0) {
        const flattened = data.results.map(flatVerse);
        setVerseList(flattened);
        setIndex(0);
        setVerse(flattened[0]);
      } else {
        throw new Error(
          "Verse not found. Please check the book name, chapter, and verse number."
        );
      }
    } catch (error) {
      console.error("Verse fetch error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch verse";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    searchByQuery("God");
  }, []);

  const setVerse = useMutation(({ storage }, verse: Verse | null) => {
    storage.set("currentVerse", verse);
  }, []);

  const next = () => {
    if (!isStorageLoaded) return;
    if (index < verseList.length - 1) {
      setVerse(verseList[index + 1]);
      setIndex(index + 1);
    }
  };

  const back = () => {
    if (!isStorageLoaded) return;
    if (index > 0) {
      setVerse(verseList[index - 1]);
      setIndex(index - 1);
    }
  };

  const clear = () => {
    if (!isStorageLoaded) return;
    setVerse(null);
    setError(null);
  };

  const handleSearch = () => {
    if (searchMode === "search") {
      searchByQuery(searchQuery);
    } else {
      if (selectedBook && selectedChapter && selectedVerse) {
        getSpecificVerse(selectedBook, selectedChapter, selectedVerse);
      }
    }
  };

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "n" || e.key === "N") next();
    if (e.key === "b" || e.key === "B") back();
    if (e.key === "c" || e.key === "C") clear();
  };

  // Add keyboard event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [verseList, index, currentVerse, isStorageLoaded]);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Control Panel</h2>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Search Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSearchMode("search")}
          className={`px-4 py-2 rounded ${
            searchMode === "search"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Search by Word
        </button>
        <button
          onClick={() => setSearchMode("specific")}
          className={`px-4 py-2 rounded ${
            searchMode === "specific"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Specific Verse
        </button>
      </div>

      {/* Search Interface */}
      {searchMode === "search" ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for verses..."
            className="flex-1 px-3 py-2 border rounded"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || !searchQuery.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="">Select Book</option>
            {bibleBooks.map((book) => (
              <option key={book} value={book}>
                {book}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            placeholder="Chapter"
            min="1"
            className="px-3 py-2 border rounded"
          />
          <input
            type="number"
            value={selectedVerse}
            onChange={(e) => setSelectedVerse(e.target.value)}
            placeholder="Verse"
            min="1"
            className="px-3 py-2 border rounded"
          />
          <button
            onClick={handleSearch}
            disabled={
              isLoading || !selectedBook || !selectedChapter || !selectedVerse
            }
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Get Verse"}
          </button>
        </div>
      )}

      {/* Current Verse Display */}
      {!isStorageLoaded ? (
        <p>Loading...</p>
      ) : currentVerse ? (
        <div className="p-4 bg-gray-500 rounded">
          <strong>
            {currentVerse.book} {currentVerse.chapter}:{currentVerse.verse}
          </strong>
          <p className="mt-2">{currentVerse.text}</p>
        </div>
      ) : (
        <p>No verse selected</p>
      )}

      {/* Results info */}
      {verseList.length > 0 && (
        <p className="text-sm text-gray-600">
          Showing {index + 1} of {verseList.length} verses
        </p>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <button
          onClick={back}
          disabled={!isStorageLoaded || index === 0}
          className="px-4 py-2 bg-yellow-500 text-white rounded disabled:opacity-50"
        >
          ⬅ Back (B)
        </button>
        <button
          onClick={next}
          disabled={!isStorageLoaded || index >= verseList.length - 1}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Next (N) ➡
        </button>
        <button
          onClick={clear}
          disabled={!isStorageLoaded}
          className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
        >
          ❌ Clear (C)
        </button>
      </div>

      {/* Fixed position help text at bottom right */}
      <div className="fixed bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded text-sm">
        Keyboard shortcuts: N = Next | B = Back | C = Clear
      </div>
    </div>
  );
}
