import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const { note } = await request.json();

  try {
    const updated = await prisma.bookmark.update({
      where: { id },
      data: { note },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 404 });
  }
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: { id: string } }
) {
  return PUT(request, ctx); // alias PATCH to PUT for convenience
}
