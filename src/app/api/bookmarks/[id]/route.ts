// src/app/api/bookmarks/[id]/route.ts
// ✅ App‑Router compliant dynamic‑route handler
//    • first arg:  Web `Request`
//    • second arg: `{ params }` context (no extra types)
//    • return:     `Response` | `NextResponse`

import { NextResponse } from "next/server";

/* --------------------------------------------------
   PUT /api/bookmarks/[id]
   --------------------------------------------------*/
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // TODO: update bookmark in DB -> `updateBookmark(id, body)`
    // const updated = await updateBookmark(id, body);

    return NextResponse.json({
      success: true,
      message: "Bookmark updated successfully",
      // data: updated,
    });
  } catch (err) {
    console.error("PUT /api/bookmarks/[id] error", err);
    return NextResponse.json(
      { error: "Failed to update bookmark" },
      { status: 500 }
    );
  }
}

/* --------------------------------------------------
   GET /api/bookmarks/[id]
   --------------------------------------------------*/
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    // TODO: fetch bookmark -> `getBookmark(id)`
    // const bookmark = await getBookmark(id);

    return NextResponse.json({ success: true /*, data: bookmark */ });
  } catch (err) {
    console.error("GET /api/bookmarks/[id] error", err);
    return NextResponse.json(
      { error: "Failed to get bookmark" },
      { status: 500 }
    );
  }
}

/* --------------------------------------------------
   DELETE /api/bookmarks/[id]
   --------------------------------------------------*/
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    // TODO: delete bookmark -> `deleteBookmark(id)`
    // await deleteBookmark(id);

    return NextResponse.json({
      success: true,
      message: "Bookmark deleted successfully",
    });
  } catch (err) {
    console.error("DELETE /api/bookmarks/[id] error", err);
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}
