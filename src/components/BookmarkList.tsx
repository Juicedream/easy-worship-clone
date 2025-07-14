"use client";

import { useBookmarks } from "@/hooks/useBookmarks";

type Props = {
  userId: string;
};

export default function BookmarkList({ userId }: Props) {
  const { bookmarks, loading } = useBookmarks(userId);

  if (loading) return <p>Loading bookmarks...</p>;
  if (!bookmarks.length) return <p>No bookmarks yet.</p>;

  return (
    <div className="space-y-2 m-4">
      <h3 className="text-lg font-semibold mb-2">🔖 Your Bookmarks</h3>
      <ul className="space-y-2 max-h-80 overflow-y-auto">
        {bookmarks.map((b) => (
          <li key={b.id} className="border p-3 rounded bg-gray-500 shadow-sm mr-2">
            <div className="font-semibold">
              {b.Book.name} {b.chapter}:{b.verse}
            </div>
            {b.note && <p className="text-sm text-black italic">{b.note}</p>}
            <div className="text-xs text-gray-700">
              Saved on {new Date(b.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
