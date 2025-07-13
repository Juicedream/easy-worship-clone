import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const book = searchParams.get("book");
  const chapter = parseInt(searchParams.get("chapter") || "");
  const start = parseInt(searchParams.get("start") || "");
  const end = parseInt(searchParams.get("end") || start.toString());

  if (!book || isNaN(chapter) || isNaN(start) || isNaN(end)) {
    return NextResponse.json(
      { error: "Missing or invalid params" },
      { status: 400 }
    );
  }

  const foundBook = await prisma.book.findUnique({ where: { name: book } });
  if (!foundBook) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  const verses = await prisma.verse.findMany({
    where: {
      bookId: foundBook.id,
      chapter,
      verse: { gte: start, lte: end },
    },
    orderBy: { verse: "asc" },
  });

  return NextResponse.json({
    verses: verses.map((v) => `${v.verse}. ${v.text}`),
  });
}
