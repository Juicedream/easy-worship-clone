"use client";

import { LiveblocksProvider } from "@liveblocks/react";


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      {children}
    </LiveblocksProvider>
  );
}
