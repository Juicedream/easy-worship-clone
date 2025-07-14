"use client";

import { useEffect, useState } from "react";

export default function BookmarkForm() {
  const [books, setBooks] = useState<{ id: number; name: string }[]>([]);
  const [bookId, setBookId] = useState("");
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => setBooks(data.books));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "demo-user",
        bookId: parseInt(bookId),
        chapter: parseInt(chapter),
        verse: parseInt(verse),
        note,
      }),
    });

    if (res.ok) {
      setSuccess(true);
      setBookId("");
      setChapter("");
      setVerse("");
      setNote("");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h2 className="text-xl font-semibold">📌 Add a Bookmark</h2>

      <select
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
        required
        className="w-full p-2 bg-black border rounded"
      >
        <option value="">Select a Book</option>
        {books.map((book) => (
          <option key={book.id} value={book.id}>
            {book.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Chapter"
        value={chapter}
        onChange={(e) => setChapter(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="number"
        placeholder="Verse"
        value={verse}
        onChange={(e) => setVerse(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <textarea
        placeholder="Add a note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        {loading ? "Saving..." : "Save Bookmark"}
      </button>

      {success && <p className="text-green-600">✅ Bookmark saved!</p>}
    </form>
  );
}
