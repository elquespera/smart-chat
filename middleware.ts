import { getAuth, withClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const middleware = withClerkMiddleware((request: NextRequest) => {
  // const { userId } = getAuth(request);

  // if (!userId) {
  //   const signInUrl = new URL("/sign-in", request.url);
  //   signInUrl.searchParams.set("redirect_url", request.url);
  //   return NextResponse.redirect(signInUrl);
  // }

  return NextResponse.next();
});

export const config = {
  matcher: ["/api/chat"],
};
