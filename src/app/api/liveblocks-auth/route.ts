// src/app/api/liveblocks-auth/route.ts
import { Liveblocks } from "@liveblocks/node";
import { NextRequest, NextResponse } from "next/server";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    // Get room ID from request body
    const { room } = await request.json();

    // Get the session and user info
    const session = liveblocks.prepareSession("anon-user", {
      userInfo: {
        name: "User Name",
        // Add any other user info you need
      },
    });

    // Grant access to the room
    session.allow(room, session.FULL_ACCESS);

    // Generate the token
    const { status, body } = await session.authorize();

    // Return proper JSON response
    return new NextResponse(body, {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Liveblocks auth error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Authentication failed" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
