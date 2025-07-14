"use client";
import { useState } from "react";
import { useBookmarks } from "@/hooks/useBookmarks";

type Props = {
  userId: string;
  bookId: number;
  chapter: number;
  verse: number;
};

export default function BookmarkButton(props: Props) {
  const { addBookmark, removeBookmark, isBookmarked, bookmarks } = useBookmarks(
    props.userId
  );
  const bookmarked = isBookmarked(props.bookId, props.chapter, props.verse);

  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");

  const handleSave = () => {
    addBookmark({ ...props, note });
    setShowNote(false);
    setNote("");
  };

  // If already bookmarked, show filled‑pin + delete option
  if (bookmarked) {
    const bm = bookmarks.find(
      (b) =>
        b.bookId === props.bookId &&
        b.chapter === props.chapter &&
        b.verse === props.verse
    );
    return (
      <button
        title="Remove bookmark"
        onClick={() => removeBookmark(bm!.id)}
        className="ml-2 text-red-500"
      >
        📌
      </button>
    );
  }

  return (
    <>
      {showNote ? (
        <div className="mt-2 space-y-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Add a note (optional)"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => setShowNote(false)}
              className="px-3 py-1 bg-red-600 rounded"
            >
              cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          title="Bookmark verse"
          onClick={() => setShowNote(true)}
          className="ml-2 text-pink-500 bg-white cursor-pointer border border-white p-1 text-center rounded-2xl hover:bg-pink-300 hover:text-white"
        >
          📌 Bookmark this verse
        </button>
      )}
    </>
  );
}
