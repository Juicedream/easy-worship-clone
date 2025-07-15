import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes (don't require authentication)
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/projector(.*)",
]);

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/control(.*)",
  "/bible(.*)",
  "/search(.*)",
  "/history(.*)",
  "/dashboard(.*)",
  "/bookmarks(.*)",
  "/api/bookmarks(.*)",
  // Add other protected routes here
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  // If user is on public route, let them through
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // If user is on root path "/"
  if (pathname === "/") {
    if (userId) {
      // User is signed in, redirect to control
      return NextResponse.redirect(new URL("/control", req.url));
    } else {
      // User is not signed in, redirect to sign-in
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  // For protected routes, check if user is authenticated
  if (isProtectedRoute(req)) {
    if (!userId) {
      // User is not authenticated, redirect to sign-in
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    // User is authenticated, allow access
    return NextResponse.next();
  }

  // For any other routes, allow access
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
