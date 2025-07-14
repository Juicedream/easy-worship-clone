import { Bookmark } from "@/generated/prisma";
import { useEffect, useState } from "react";

export function useBookmarks(userId: string) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () =>
    fetch(`/api/bookmarks?userId=${userId}`)
      .then((r) => r.json())
      .then(setBookmarks)
      .finally(() => setLoading(false));

  useEffect(() => {
    refresh();
  }, [userId]);

  async function addBookmark(b: {
    bookId: number;
    chapter: number;
    verse: number;
    note?: string;
  }) {
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...b, userId }),
    });
    refresh();
    return res.json();
  }

  async function removeBookmark(id: number) {
    await fetch("/api/bookmarks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    refresh();
  }

  async function deleteBookmark(id: number) {
    await fetch("/api/bookmarks/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });
  }


  /** true if this verse is already bookmarked */
  const isBookmarked = (bookId: number, chapter: number, verse: number) =>
    bookmarks.some(
      (b:any) => b.bookId === bookId && b.chapter === chapter && b.verse === verse
    );

  return { bookmarks, addBookmark, removeBookmark, isBookmarked, deleteBookmark, loading };
}
