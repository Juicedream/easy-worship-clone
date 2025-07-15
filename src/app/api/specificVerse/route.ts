// src/app/api/specificVerse/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { book, chapter, verse, specific, translation } = body;

    console.log("Received request:", { book, chapter, verse, specific, translation });

    // Validate required fields
    if (!book || !chapter || !verse) {
      return NextResponse.json(
        { error: "Book, chapter, and verse are required" },
        { status: 400 }
      );
    }

    // Handle both number and string inputs
    const chapterNum =
      typeof chapter === "string" ? parseInt(chapter) : chapter;
    const verseNum = typeof verse === "string" ? parseInt(verse) : verse;

    if (
      isNaN(chapterNum) ||
      isNaN(verseNum) ||
      chapterNum < 1 ||
      verseNum < 1
    ) {
      return NextResponse.json(
        { error: "Chapter and verse must be valid positive numbers" },
        { status: 400 }
      );
    }

    console.log("Searching for:", {
      book,
      chapter: chapterNum,
      verse: verseNum,
    });

    // First, let's check if the book exists
    const bookExists = await prisma.book.findFirst({
      where: {
        name: {
          equals: book,
        },
      },
    });

    console.log("Book found:", bookExists);

    if (!bookExists) {
      return NextResponse.json(
        {
          results: [],
          error: `Book "${book}" not found in database`,
        },
        { status: 404 }
      );
    }

    // Find the specific verse
    const verseData = await prisma.verse.findFirst({
      where: {
        bookId: bookExists.id,
        chapter: chapterNum,
        verse: verseNum,
        translation: "KJV"
      },
      include: {
        Book: true,
      },
    });

    console.log("Verse found:", verseData);

    if (!verseData) {
      return NextResponse.json(
        {
          results: [],
          error: `Verse not found: ${book} ${chapterNum}:${verseNum}`,
        },
        { status: 404 }
      );
    }

    // Return in the format expected by frontend
    return NextResponse.json({
      results: [verseData],
      success: true,
    });
  } catch (error) {
    console.error("Detailed error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("JSON")) {
        return NextResponse.json(
          { error: "Invalid JSON in request body" },
          { status: 400 }
        );
      }

      // Handle Prisma connection errors
      if (
        error.message.includes("connection") ||
        error.message.includes("ECONNREFUSED")
      ) {
        return NextResponse.json(
          { error: "Database connection failed" },
          { status: 500 }
        );
      }

      // Handle Prisma schema errors
      if (
        error.message.includes("Unknown field") ||
        error.message.includes("does not exist")
      ) {
        return NextResponse.json(
          { error: "Database schema error: " + error.message },
          { status: 500 }
        );
      }

      // Log the actual error for debugging
      console.error("Unhandled error:", error.message);
      return NextResponse.json(
        { error: "Internal server error: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Optional: Add a GET method for testing
export async function GET() {
  return NextResponse.json({
    message: "Verse API is running. Use POST method to fetch verses.",
  });
}
