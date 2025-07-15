import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
// Adjust import path as needed

interface Params {
  params: { id: string };
}

// Helper to convert string ID to number with validation
function validateId(id: string): number | null {
  const numId = Number(id);
  return isNaN(numId) ? null : numId;
}

// GET /api/bookmarks/[id]
export async function GET(_: Request, { params }: Params) {
  const bookmarkId = validateId(params.id);
  if (!bookmarkId) {
    return NextResponse.json({ error: "Invalid bookmark ID" }, { status: 400 });
  }

  try {
    const bookmark = await prisma.bookmark.findUnique({
      where: { id: bookmarkId },
      include: {
        Book: {
          select: {
            name: true,
            abbreviation: true,
            testament: true,
          },
        },
      },
    });

    if (!bookmark) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: bookmark.id,
      userId: bookmark.userId,
      bookId: bookmark.bookId,
      chapter: bookmark.chapter,
      verse: bookmark.verse,
      note: bookmark.note,
      createdAt: bookmark.createdAt,
      bookName: bookmark.Book.name,
      bookAbbreviation: bookmark.Book.abbreviation,
      testament: bookmark.Book.testament,
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
export async function PUT(request: Request, { params }: Params) {
  const bookmarkId = validateId(params.id);
  if (!bookmarkId) {
    return NextResponse.json({ error: "Invalid bookmark ID" }, { status: 400 });
  }

  try {
    const { note, bookId, chapter, verse } = await request.json();

    // Validate book exists
    const bookExists =
      (await prisma.book.count({
        where: { id: bookId },
      })) > 0;

    if (!bookExists) {
      return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
    }

    const updatedBookmark = await prisma.bookmark.update({
      where: { id: bookmarkId },
      data: {
        note,
        bookId,
        chapter,
        verse,
      },
      include: {
        Book: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: updatedBookmark.id,
      bookId: updatedBookmark.bookId,
      bookName: updatedBookmark.Book.name,
      chapter: updatedBookmark.chapter,
      verse: updatedBookmark.verse,
      note: updatedBookmark.note,
    });
  } catch (err) {
    console.error("PUT error:", err);

    // if (err instanceof Prisma.PrismaClientKnownRequestError) {
    //   if (err.code === "P2025") {
    //     return NextResponse.json(
    //       { error: "Bookmark not found" },
    //       { status: 404 }
    //     );
    //   }
    // }

    return NextResponse.json(
      { error: "Failed to update bookmark" },
      { status: 500 }
    );
  }
}

// DELETE /api/bookmarks/[id]
export async function DELETE(_: Request, { params }: Params) {
  const bookmarkId = validateId(params.id);
  if (!bookmarkId) {
    return NextResponse.json({ error: "Invalid bookmark ID" }, { status: 400 });
  }

  try {
    await prisma.bookmark.delete({
      where: { id: bookmarkId },
    });

    return NextResponse.json(
      { message: "Bookmark deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE error:", err);

    // if (err instanceof Prisma.PrismaClientKnownRequestError) {
    //   if (err.code === "P2025") {
    //     return NextResponse.json(
    //       { error: "Bookmark not found" },
    //       { status: 404 }
    //     );
    //   }
    // }

    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}
