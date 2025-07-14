"use client";

import { useBookmarks } from "@/hooks/useBookmarks";
import { useEffect, useState } from "react";

type Props = {
  userId: string;
};

type Bookmark = {
  userId: string;
  id: number;
  bookId: number;
  chapter: number;
  verse: number;
  note: string | null;
  createdAt: Date;
  Book?: {
    name?: string;
  };
};

export default function BookmarkList({ userId }: Props) {
  const { bookmarks: fetchedBookmarks, loading, deleteBookmark } = useBookmarks(userId);
  const [bookmarks, setBookmarks] = useState(fetchedBookmarks);

  // Sync fetched bookmarks into local state once loaded
  useEffect(() => {
    if (!loading) {
      setBookmarks(fetchedBookmarks);
    }
  }, [fetchedBookmarks, loading]);

  const handleDelete = async (id: number) => {
    await deleteBookmark(id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  if (loading) return <p>Loading bookmarks...</p>;
  if (!bookmarks.length) return <p>No bookmarks yet.</p>;

  return (
    <div className="space-y-2 m-4">
      <h3 className="text-lg font-semibold mb-2">🔖 Your Bookmarks</h3>
      <ul className="space-y-2 max-h-80 overflow-y-auto">
        {bookmarks.map((b:Bookmark) => (
          <li
            key={b.id}
            className="border p-3 rounded bg-gray-500 shadow-sm mr-2 relative"
          >
            <div className="font-semibold">
              {b.Book?.name} {b.chapter}:{b.verse}
            </div>
            {b.note && <p className="text-sm text-black italic">{b.note}</p>}
            <div className="text-xs text-gray-700">
              Saved on {new Date(b.createdAt).toLocaleString()}
            </div>
            <button
              onClick={() => handleDelete(b.id)}
              className="absolute top-2 right-2 text-red-400 text-xs hover:text-red-600"
            >
              🗑️ Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
