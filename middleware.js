import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

// Initialize ArcJet with more specific rules
const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({
      mode: process.env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
    }),
    detectBot({
      mode: process.env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
      allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"],
    }),
  ],
});

export default clerkMiddleware(async (auth, req) => {
  // First run ArcJet protection
  const arcjetResponse = await createMiddleware(aj)(req);
  if (arcjetResponse) return arcjetResponse;

  // Then handle Clerk auth
  const { userId } = auth();
  
  // Skip auth for non-protected routes
  if (!isProtectedRoute(req)) {
    return NextResponse.next();
  }

  // Handle protected routes
  if (!userId) {
    return auth().redirectToSignIn();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Exclude static files and internal paths
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff2)).*)",
    // Include API routes
    "/api(.*)"
  ],
};