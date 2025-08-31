import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { AUTH_PATH } from "@/constants/routes";
import { auth } from "@/lib/auth/server";
import { isMatchingRoute } from "@/utils/routes";

const PUBLIC_ROUTES = ["/auth/*", "/api/auth/*", "/.well-known/*"];

export async function middleware(request: NextRequest) {
  // Check if the request is for a public route
  const isPublic = isMatchingRoute(request.nextUrl.pathname, PUBLIC_ROUTES);
  if (isPublic) return NextResponse.next();

  console.log(" Middleware->Path:", request.nextUrl.pathname);

  // Clone the request URL for redirection
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = AUTH_PATH.LOGIN;
  redirectUrl.searchParams.set("next", request.nextUrl.pathname);

  // Fetch user session
  // If the user is not logged in, redirect them to the login page
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || !session.user) return NextResponse.redirect(redirectUrl);
}

export const config = {
  runtime: "nodejs",
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
