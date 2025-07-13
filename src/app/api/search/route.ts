import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  const { query } = await req.json();

  if (!query || query.trim() === "") {
    return NextResponse.json({ results: [] });
  }

  const results = await prisma.verse.findMany({
    where: {
      text: {
        contains: query.toLowerCase(),
      },
    },
    include: {
      Book: true,
    },
    take: 50,
  });

  return NextResponse.json({ results });
}
