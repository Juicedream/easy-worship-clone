// GET /api/books
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const books = await prisma.book.findMany({
    orderBy: { bookOrder: "asc" },
  });

  return NextResponse.json({ books });
}
