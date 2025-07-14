"use client";

import { useBookmarks } from "@/hooks/useBookmarks";

type Props = {
  userId: string;
  bookId: number;
  chapter: number;
  verse: number;
};

export default function BookmarkButton({
  userId,
  bookId,
  chapter,
  verse,
}: Props) {
  const { addBookmark } = useBookmarks(userId);

  function handleClick() {
    addBookmark({ bookId, chapter, verse });
  }

  return (
    <button
      onClick={handleClick}
      className="px-3 py-1 text-sm bg-green-600 text-white rounded"
    >
      📌 Bookmark
    </button>
  );
}
