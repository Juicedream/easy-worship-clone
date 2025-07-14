import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// CREATE a bookmark

export async function POST(req: NextRequest) {
  const data = await req.json();

  if (!data.userId || !data.bookId || !data.chapter || !data.verse) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const bookmark = await prisma.bookmark.create({
    data: {
      userId: data.userId,
      bookId: data.bookId,
      chapter: data.chapter,
      verse: data.verse,
      note: data.note || "",
    },
    include: { Book: true },
  });

  return NextResponse.json(bookmark);
}

// GET bookmarks for a user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    include: { Book: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookmarks);
}
