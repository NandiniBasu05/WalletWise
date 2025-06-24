import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({
      mode: "MONITOR", // prevent blocking during debug
    }),
    detectBot({
      mode: "MONITOR", // prevent blocking during debug
      allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"],
    }),
  ],
});

const clerk = clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  const publicRoutes = ["/", "/favicon.ico"];
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

  if (!userId && isProtectedRoute(req) && !isPublicRoute) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }

  return NextResponse.next();
});

export default async function middleware(req) {
  const publicRoutes = ["/", "/favicon.ico"];
  if (publicRoutes.includes(req.nextUrl.pathname)) {
    return clerk(req);
  }
  return createMiddleware(aj, clerk)(req);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
