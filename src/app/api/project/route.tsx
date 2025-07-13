import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// app/api/project/route.ts
export async function GET() {
  // Get latest projected verse
  const latest = await prisma.projectedVerse.findFirst({
    orderBy: { createdAt: "desc" },
    include: {
      verse: {
        include: {
          Book: true,
        },
      },
    },
  });

  return NextResponse.json({ projected: latest });
}



export async function POST(req: Request) {
  const { verseId } = await req.json();

  const verse = await prisma.verse.findUnique({
    where: { id: verseId },
    include: { Book: true },
  });

  if (!verse)
    return NextResponse.json({ error: "Verse not found" }, { status: 404 });

  await prisma.projectedVerse.deleteMany(); // Clear existing
  await prisma.projectedVerse.create({
    data: {
      verseId: verse.id,
    },
  });

  return NextResponse.json({ message: "Verse projected!" });
}
