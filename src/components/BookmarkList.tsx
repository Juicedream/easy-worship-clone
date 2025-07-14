"use client";

import { useEffect, useState } from "react";
import { useBookmarks } from "@/hooks/useBookmarks";

/* ---------- dnd‑kit imports ---------- */
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
/* ------------------------------------- */

type Props = { userId: string };

type Bookmark = {
  id: number;
  userId: string;
  bookId: number;
  chapter: number;
  verse: number;
  note: string | null;
  createdAt: string;
  Book?: { name?: string };
};

/* ---------- Sortable list item ---------- */
function SortableBookmarkItem({
  b,
  onDelete,
  onEdit,
  onSave,
  editingId,
  editedNote,
  setEditedNote,
}: {
  b: Bookmark;
  onDelete: (id: number) => void;
  onEdit: (id: number, note: string) => void;
  onSave: (id: number) => void;
  editingId: number | null;
  editedNote: string;
  setEditedNote: (note: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: b.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border p-3 rounded bg-gray-500 shadow-sm relative cursor-grab"
    >
      <div className="font-semibold">
        {b.Book?.name} {b.chapter}:{b.verse}
      </div>

      {editingId === b.id ? (
        <div className="flex items-center gap-2 mt-1">
          <input
            value={editedNote}
            onChange={(e) => setEditedNote(e.target.value)}
            className="text-sm px-2 py-1 rounded border flex-1"
          />
          <button
            onClick={() => onSave(b.id)}
            className="text-green-600 hover:underline text-xs"
          >
            💾 Save
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center mt-1">
          {b.note && <p className="text-sm text-black italic">{b.note}</p>}
          <button
            onClick={() => onEdit(b.id, b.note || "")}
            className="text-blue-500 cursor-pointer hover:underline text-xs"
          >
            ✏️ Edit
          </button>
        </div>
      )}

      <div className="text-xs text-gray-700">
        Saved {new Date(b.createdAt).toLocaleString()}
      </div>

      <button
        onClick={() => onDelete(b.id)}
        className="absolute top-2 right-2 text-red-400 text-xs hover:text-red-600"
      >
        🗑️ Delete
      </button>
    </li>
  );
}

/* ---------- Main list component ---------- */
export default function BookmarkList({ userId }: Props) {
  const {
    bookmarks: fetchedBookmarks,
    loading,
    deleteBookmark,
    updateBookmarkNote,
  } = useBookmarks(userId);

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedNote, setEditedNote] = useState("");

  const sensors = useSensors(useSensor(PointerSensor));

useEffect(() => {
  if (!loading && editingId === null) {
    setBookmarks(fetchedBookmarks);
  }
}, [fetchedBookmarks, loading, editingId]);


  const handleDelete = async (id: number) => {
    await deleteBookmark(id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleEdit = (id: number, note: string) => {
    setEditingId(id);
    setEditedNote(note);
  };

  const handleSave = async (id: number) => {
    await updateBookmarkNote(id, editedNote);
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, note: editedNote } : b))
    );
    setEditingId(null);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = bookmarks.findIndex((b) => b.id === active.id);
      const newIndex = bookmarks.findIndex((b) => b.id === over?.id);
      setBookmarks(arrayMove(bookmarks, oldIndex, newIndex));
    }
  };

  if (loading) return <p>Loading bookmarks...</p>;
  if (!bookmarks.length) return <p>No bookmarks yet.</p>;

  return (
    <div className="space-y-2 m-4">
      <h3 className="text-lg font-semibold mb-2">🔖 Your Bookmarks</h3>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={bookmarks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-2 max-h-80 overflow-y-auto">
            {bookmarks.map((b) => (
              <SortableBookmarkItem
                key={b.id}
                b={b}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onSave={handleSave}
                editingId={editingId}
                editedNote={editedNote}
                setEditedNote={setEditedNote}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}
