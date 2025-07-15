import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
// Proper type for Next.js route parameters
type RouteParams = {
  params: {
    id: string;
  };
};

// GET /api/bookmarks/[id]
export async function GET(request: Request, { params }: RouteParams) {
  const bookmarkId = Number(params.id);
  if (isNaN(bookmarkId)) {
    return NextResponse.json({ error: "Invalid bookmark ID" }, { status: 400 });
  }

  try {
    const bookmark = await prisma.bookmark.findUnique({
      where: { id: bookmarkId },
      include: { Book: true },
    });

    if (!bookmark) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: bookmark.id,
      bookId: bookmark.bookId,
      chapter: bookmark.chapter,
      verse: bookmark.verse,
      note: bookmark.note,
      bookName: bookmark.Book.name,
    });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch bookmark" },
      { status: 500 }
    );
  }
}

// PUT /api/bookmarks/[id]
export async function PUT(request: Request, { params }: RouteParams) {
  const bookmarkId = Number(params.id);
  if (isNaN(bookmarkId)) {
    return NextResponse.json({ error: "Invalid bookmark ID" }, { status: 400 });
  }

  try {
    const { note } = await request.json();

    const updatedBookmark = await prisma.bookmark.update({
      where: { id: bookmarkId },
      data: { note },
      include: { Book: true },
    });

    return NextResponse.json(updatedBookmark);
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json(
      { error: "Failed to update bookmark" },
      { status: 500 }
    );
  }
}

// DELETE /api/bookmarks/[id]
export async function DELETE(request: Request, { params }: RouteParams) {
  const bookmarkId = Number(params.id);
  if (isNaN(bookmarkId)) {
    return NextResponse.json({ error: "Invalid bookmark ID" }, { status: 400 });
  }

  try {
    await prisma.bookmark.delete({
      where: { id: bookmarkId },
    });

    return NextResponse.json({ message: "Bookmark deleted successfully" });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}
