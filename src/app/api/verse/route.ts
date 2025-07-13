import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const book = searchParams.get("book");
  const chapter = parseInt(searchParams.get("chapter") || "");
  const verse = parseInt(searchParams.get("verse") || "");

  if (!book || isNaN(chapter) || isNaN(verse)) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const foundBook = await prisma.book.findUnique({ where: { name: book } });
  if (!foundBook) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  const result = await prisma.verse.findFirst({
    where: {
      bookId: foundBook.id,
      chapter,
      verse,
    },
  });

  return NextResponse.json({ text: result?.text });
}
