// import { prisma } from "@/lib/db";
// import { NextResponse } from "next/server";


// export async function POST(req: Request) {
//   const { query } = await req.json();

//   if (!query || query.trim() === "") {
//     return NextResponse.json({ results: [] });
//   }

//   const results = await prisma.verse.findMany({
//     where: {
//       text: {
//         contains: query.toLowerCase(),
//       },
//     },
//     include: {
//       Book: true,
//     },
//     take: 50,
//   });

//   return NextResponse.json({ results });
// }


// src/app/api/search/route.ts
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    console.log("Search request received:", { query });
    
    if (!query || query.trim() === "") {
      return NextResponse.json({ results: [] });
    }

    const searchTerm = query.trim();
    
    // Search with both contains and case-insensitive matching
    const results = await prisma.verse.findMany({
      where: {
        text: {
          contains: searchTerm,
        },
      },
      include: {
        Book: true,
      },
      take: 50,
      orderBy: [
        { Book: { bookOrder: 'asc' } }, // Order by book order first
        { chapter: 'asc' },
        { verse: 'asc' },
      ],
    });

    console.log(`Search found ${results.length} results for: "${searchTerm}"`);
    
    return NextResponse.json({ results });
    
  } catch (error) {
    console.error("Search API error:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Search failed: " + error.message, results: [] },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Search failed", results: [] },
      { status: 500 }
    );
  }
}

// Optional: Add a GET method for testing
export async function GET() {
  return NextResponse.json({
    message: "Search API is running. Use POST method to search verses.",
  });
}