"use client";

import { useEffect, useState } from "react";

export type Bookmark = {
  id: number;
  userId: string;
  bookId: number;
  chapter: number;
  verse: number;
  note?: string;
  createdAt: string;
  Book: {
    name: string;
  };
};

export function useBookmarks(userId: string) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    fetch(`/api/bookmarks?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setBookmarks(data);
        setLoading(false);
      });
  }, [userId]);

  async function addBookmark(bookmark: {
    bookId: number;
    chapter: number;
    verse: number;
    note?: string;
  }) {
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      body: JSON.stringify({ ...bookmark, userId }),
      headers: { "Content-Type": "application/json" },
    });

    const newBookmark = await res.json();
    setBookmarks((prev) => [newBookmark, ...prev]);
  }

  return { bookmarks, addBookmark, loading };
}
