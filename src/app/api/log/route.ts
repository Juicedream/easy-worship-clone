

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { bookId, chapter, verse } = await req.json();

  try {
    const log = await prisma.projectionLog.create({
      data: { userId, bookId, chapter, verse },
      include: { Book: true },
    });
    return NextResponse.json(log);
  } catch (err) {
    console.error("ProjectionLog error:", err);
    return NextResponse.json({ error: "Log failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const logs = await prisma.projectionLog.findMany({
    where: { userId },
    orderBy: { timestamp: "desc" },
    include: { Book: true },
  });

  return NextResponse.json(logs);
}

export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.projectionLog.deleteMany({
    where: { userId },
  });

  return NextResponse.json({ success: true });
}


