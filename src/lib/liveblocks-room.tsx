"use client";
import { RoomProvider } from "@liveblocks/react";

export function LiveblocksRoom({ children }: { children: React.ReactNode }) {
  return (
    <RoomProvider
      id="projector-room"
      initialPresence={{}}
      initialStorage={{
        currentVerse: null, // 👈 Initialize the storage key!
      }}
    >
      {children}
    </RoomProvider>
  );
}
