"use client";

import BookmarkButton from "@/components/BookmarkButton";
import { useMutation, useStorage, useStorageRoot } from "@liveblocks/react";
import { useEffect, useState, useCallback } from "react";
import {
  useMyPresence,
  useOthers,
  useStatus,
  useSelf,
} from "@liveblocks/react";

type Verse = {
  translation: string;
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  bookId: number;
};

type UserPresence = {
  isControlling?: boolean;
  requestingControl?: boolean;
  userName?: string;
  userId?: string;
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
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [translation, setTranslation] = useState("KJV");
  const [hasInitializedControl, setHasInitializedControl] = useState(false);
  const [userName] = useState(
    () => `User-${Math.random().toString(36).substring(2, 6)}`
  );

  const self = useSelf();
  const others = useOthers();
  const status = useStatus();
  const [, updatePresence] = useMyPresence();

  // Initialize control state
  useEffect(() => {
    if (!hasInitializedControl && status === "connected") {
      const timer = setTimeout(() => {
        const someoneElseControlling = others.some(
          (o) => o.presence?.isControlling === true
        );

        updatePresence({
          isControlling: !someoneElseControlling,
          requestingControl: false,
          userName,
          userId: self?.connectionId,
        });

        setHasInitializedControl(true);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [
    hasInitializedControl,
    status,
    others,
    updatePresence,
    userName,
    self?.connectionId,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      updatePresence({
        isControlling: false,
        requestingControl: false,
        userName,
        userId: self?.connectionId,
      });
    };
  }, [updatePresence, userName, self?.connectionId]);

  // Audio notification system
  const playNotificationSound = useCallback(
    (type: "request" | "granted" | "taken") => {
      try {
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        if (type === "request") {
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(
            600,
            audioContext.currentTime + 0.1
          );
        } else if (type === "granted") {
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(
            800,
            audioContext.currentTime + 0.1
          );
          oscillator.frequency.setValueAtTime(
            1000,
            audioContext.currentTime + 0.2
          );
        } else {
          oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(
            300,
            audioContext.currentTime + 0.1
          );
        }

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.3
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (error) {
        console.error("Audio notification failed:", error);
      }
    },
    []
  );

  const controllingUser = others.find(
    (o) => o.presence?.isControlling === true
  );
  const isMeControlling = self?.presence?.isControlling === true;
  const isLocked = !isMeControlling && controllingUser !== undefined;
  const requestingUsers = others.filter(
    (o) => o.presence?.requestingControl === true && !o.presence?.isControlling
  );
  const isStorageLoaded = storageRoot !== null;

  const requestControl = useCallback(() => {
    if (!isLocked) return;
    updatePresence({
      requestingControl: true,
      isControlling: false,
      userName,
      userId: self?.connectionId,
    });
    playNotificationSound("request");
  }, [
    isLocked,
    updatePresence,
    userName,
    self?.connectionId,
    playNotificationSound,
  ]);

  const cancelRequest = useCallback(() => {
    updatePresence({
      requestingControl: false,
      isControlling: false,
      userName,
      userId: self?.connectionId,
    });
  }, [updatePresence, userName, self?.connectionId]);

  const grantControl = useCallback(
    (requestingUserId: string) => {
      updatePresence({
        isControlling: false,
        requestingControl: false,
        userName,
        userId: self?.connectionId,
      });
      playNotificationSound("granted");
    },
    [updatePresence, userName, self?.connectionId, playNotificationSound]
  );

  const takeControl = useCallback(() => {
    updatePresence({
      isControlling: true,
      requestingControl: false,
      userName,
      userId: self?.connectionId,
    });
    playNotificationSound("taken");
  }, [updatePresence, userName, self?.connectionId, playNotificationSound]);

  useEffect(() => {
    if (self?.presence?.requestingControl && !controllingUser) {
      takeControl();
    }
  }, [controllingUser, self?.presence, takeControl]);

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

  const versions = ["KJV", "ASV", "ESV", "AMP", "GNV", "NIV", "FBP"];

  const flatVerse = (v: any): Verse => ({
    id: v.id,
    book: v.Book?.name || "Unknown",
    chapter: v.chapter,
    verse: v.verse,
    text: v.text,
    bookId: v.bookId,
    translation: v.translation,
  });

  const setVerse = useMutation(({ storage }, verse: Verse | null) => {
    storage.set("currentVerse", verse);
    if (verse) {
      fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: verse.bookId,
          chapter: verse.chapter,
          verse: verse.verse,
        }),
      });
    }
  }, []);

  const fetchVerseWithFallback = async (
    book: string,
    chapter: number,
    verse: number,
    translation: string
  ): Promise<Verse | null> => {
    try {
      const res = await fetch("/api/all-verse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book, chapter, verse, translation }),
      });
      if (res.ok) {
        const { text } = await res.json();
        return {
          id: `${book}.${chapter}.${verse}.${translation}`,
          book,
          chapter,
          verse,
          text,
          translation,
          bookId: -1,
        };
      }
      throw new Error("Remote fetch failed");
    } catch {
      const local = await fetch("/api/specificVerse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book,
          chapter,
          verse,
          translation: "KJV",
          specific: true,
        }),
      });
      if (!local.ok) return null;
      const data = await local.json();
      return data.results?.length ? flatVerse(data.results[0]) : null;
    }
  };

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

      if (!response.ok) throw new Error(`Search failed: ${response.status}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const flattened = data.results.map(flatVerse);
      setVerseList(flattened);
      setIndex(0);
      if (flattened.length > 0 && isStorageLoaded) setVerse(flattened[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  const getSpecificVerse = async (
    book: string,
    chapter: string,
    verse: string
  ) => {
    if (!selectedBook || !selectedChapter || !selectedVerse) return;
    setIsLoading(true);
    setError(null);

    const result = await fetchVerseWithFallback(
      book,
      Number(chapter),
      Number(verse),
      translation
    );

    if (result) {
      setVerseList([result]);
      setIndex(0);
      isStorageLoaded && setVerse(result);
    } else {
      setError("Verse not found in any translation.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isStorageLoaded && !initialLoadComplete && isMeControlling) {
      searchByQuery("God");
      setInitialLoadComplete(true);
    }
  }, [isStorageLoaded, initialLoadComplete, isMeControlling]);

  const next = useCallback(() => {
    if (!isStorageLoaded || !isMeControlling) return;
    if (index < verseList.length - 1) {
      const nextIndex = index + 1;
      setVerse(verseList[nextIndex]);
      setIndex(nextIndex);
    }
  }, [isStorageLoaded, isMeControlling, index, verseList, setVerse]);

  const back = useCallback(() => {
    if (!isStorageLoaded || !isMeControlling) return;
    if (index > 0) {
      const prevIndex = index - 1;
      setVerse(verseList[prevIndex]);
      setIndex(prevIndex);
    }
  }, [isStorageLoaded, isMeControlling, index, verseList, setVerse]);

  const clear = useCallback(() => {
    if (!isStorageLoaded || !isMeControlling) return;
    setVerse(null);
    setError(null);
  }, [isStorageLoaded, isMeControlling, setVerse]);

  const handleSearch = () => {
    if (!isStorageLoaded || !isMeControlling) return;
    searchMode === "search"
      ? searchByQuery(searchQuery)
      : getSpecificVerse(selectedBook, selectedChapter, selectedVerse);
  };

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!isStorageLoaded || !isMeControlling) return;
      if (e.key === "n" || e.key === "N") next();
      if (e.key === "b" || e.key === "B") back();
      if (e.key === "c" || e.key === "C") clear();
    },
    [isStorageLoaded, isMeControlling, next, back, clear]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <div className="p-6 space-y-4">
      {/* Debug Panel */}
      <div className="fixed bottom-20 right-4 bg-gray-800 text-white p-2 rounded text-xs max-w-xs">
        <div>Status: {status}</div>
        <div>Initialized: {hasInitializedControl.toString()}</div>
        <div>My Control: {isMeControlling.toString()}</div>
        <div>Others Count: {others.length}</div>
        <div>
          Controlling User:{" "}
          {controllingUser?.presence?.userName
            ? typeof controllingUser.presence.userName === "string"
              ? controllingUser.presence.userName
              : JSON.stringify(controllingUser.presence.userName)
            : "None"}
        </div>
        <div>Storage Loaded: {isStorageLoaded.toString()}</div>
        <div>Currently Projecting: {currentVerse ? "true" : "false"}</div>
      </div>

      {/* Connection Status */}
      <div className="fixed bottom-2 left-2 text-xs px-2 py-1 rounded bg-black/60 text-white">
        {status === "connected"
          ? "🟢 Connected"
          : status === "connecting"
          ? "🟡 Connecting…"
          : "🔴 Disconnected"}
      </div>

      {/* Control Status */}
      <div className="fixed bottom-12 left-2 space-y-1">
        {isMeControlling && (
          <div className="text-xs px-2 py-1 rounded bg-green-600 text-white">
            ✓ You have control ({userName})
          </div>
        )}

        {isLocked && (
          <div className="text-xs px-2 py-1 rounded bg-red-600 text-white">
            🔒{" "}
            {controllingUser?.presence?.userName
              ? typeof controllingUser.presence.userName === "string"
                ? controllingUser.presence.userName
                : JSON.stringify(controllingUser.presence.userName)
              : "Another user"}{" "}
            is in control
          </div>
        )}

        {isLocked && !self?.presence?.requestingControl && (
          <button
            onClick={requestControl}
            className="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Request Control
          </button>
        )}

        {self?.presence?.requestingControl && (
          <div className="space-y-1">
            <div className="text-xs px-2 py-1 rounded bg-yellow-600 text-white">
              ⏳ Control requested...
            </div>
            <button
              onClick={cancelRequest}
              className="text-xs px-2 py-1 rounded bg-gray-600 text-white hover:bg-gray-700"
            >
              Cancel Request
            </button>
          </div>
        )}
      </div>

      {/* Control Requests Panel */}
      {isMeControlling && requestingUsers.length > 0 && (
        <div className="fixed top-4 right-4 bg-gray-500 border-2 border-blue-500 rounded-lg p-4 shadow-lg max-w-sm">
          <h3 className="font-semibold text-sm mb-2">Control Requests</h3>
          {requestingUsers.map((user) => (
            <div
              key={user.connectionId}
              className="flex items-center justify-between mb-2"
            >
              <span className="text-sm">
                {user.presence?.userName
                  ? typeof user.presence.userName === "string"
                    ? user.presence.userName
                    : JSON.stringify(user.presence.userName)
                  : "Unknown User"}
              </span>
              <button
                onClick={() => grantControl(String(user.connectionId))}
                className="text-xs px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Grant Control
              </button>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-xl font-semibold">Control Panel</h2>

      {!isStorageLoaded && (
        <div className="p-3 bg-blue-100 border border-blue-300 text-blue-700 rounded">
          Initializing storage...
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSearchMode("search")}
          disabled={isLocked || !isStorageLoaded}
          className={`px-4 py-2 rounded disabled:opacity-50 ${
            searchMode === "search"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Search by Word
        </button>
        <button
          onClick={() => setSearchMode("specific")}
          disabled={isLocked || !isStorageLoaded}
          className={`px-4 py-2 rounded disabled:opacity-50 ${
            searchMode === "specific"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Specific Verse
        </button>
      </div>

      {searchMode === "search" ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for verses..."
            className="flex-1 px-3 py-2 border rounded"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            disabled={isLocked || !isStorageLoaded}
          />
          <button
            onClick={handleSearch}
            disabled={
              isLocked || isLoading || !searchQuery.trim() || !isStorageLoaded
            }
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            className="px-3 py-2 border rounded text-black bg-white"
            disabled={isLocked || !isStorageLoaded}
          >
            <option value="">Select Book</option>
            {bibleBooks.map((book) => (
              <option key={book} value={book}>
                {book}
              </option>
            ))}
          </select>
          <select
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            className="px-3 py-2 border rounded text-white bg-black"
            disabled={isLocked || !isStorageLoaded}
          >
            {versions.map((version) => (
              <option key={version} value={version}>
                {version}
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
            disabled={isLocked || !isStorageLoaded}
          />
          <input
            type="number"
            value={selectedVerse}
            onChange={(e) => setSelectedVerse(e.target.value)}
            placeholder="Verse"
            min="1"
            className="px-3 py-2 border rounded"
            disabled={isLocked || !isStorageLoaded}
          />
          <button
            onClick={handleSearch}
            disabled={
              isLocked ||
              isLoading ||
              !selectedBook ||
              !selectedChapter ||
              !selectedVerse ||
              !isStorageLoaded
            }
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Get Verse"}
          </button>
        </div>
      )}

      {!isStorageLoaded ? (
        <p>Loading storage...</p>
      ) : currentVerse ? (
        <div className="p-4 bg-gray-500 border rounded">
          <strong>
            {currentVerse.book} {currentVerse.chapter}:{currentVerse.verse}
          </strong>
          <p className="mt-2 text-gray-800">{currentVerse.text}</p>
          <div className="text-sm text-gray-600 mt-2">
            {currentVerse.translation}
          </div>
          <BookmarkButton
            userId="demo-user"
            bookId={currentVerse.bookId}
            chapter={currentVerse.chapter}
            verse={currentVerse.verse}
          />
        </div>
      ) : (
        <p>No verse selected</p>
      )}

      {verseList.length > 0 && (
        <p className="text-sm text-gray-600">
          Showing {index + 1} of {verseList.length} verses
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={back}
          disabled={isLocked || !isStorageLoaded || index === 0}
          className="px-4 py-2 bg-yellow-500 text-white rounded disabled:opacity-50"
        >
          ⬅ Back (B)
        </button>
        <button
          onClick={next}
          disabled={
            isLocked || !isStorageLoaded || index >= verseList.length - 1
          }
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Next (N) ➡
        </button>
        <button
          onClick={clear}
          disabled={isLocked || !isStorageLoaded}
          className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
        >
          ❌ Clear (C)
        </button>
      </div>

      <div className="fixed bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded text-sm">
        {isMeControlling
          ? "Keyboard shortcuts: N = Next | B = Back | C = Clear"
          : "You don't have control"}
      </div>
    </div>
  );
}
