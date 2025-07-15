// src/app/api/bookmarks/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

// Make sure the PUT function is properly typed and exported
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;
    const body = await request.json();

    // Your PUT logic here
    // For example, updating a bookmark:
    // const updatedBookmark = await updateBookmark(id, body);

    return NextResponse.json({
      success: true,
      message: "Bookmark updated successfully",
      // data: updatedBookmark
    });
  } catch (error) {
    console.error("PUT /api/bookmarks/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update bookmark" },
      { status: 500 }
    );
  }
}

// Optional: Add other HTTP methods if needed
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;

    // Your GET logic here
    // const bookmark = await getBookmark(id);

    return NextResponse.json({
      success: true,
      // data: bookmark
    });
  } catch (error) {
    console.error("GET /api/bookmarks/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to get bookmark" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;

    // Your DELETE logic here
    // await deleteBookmark(id);

    return NextResponse.json({
      success: true,
      message: "Bookmark deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/bookmarks/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}
