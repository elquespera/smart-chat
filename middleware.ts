import { withClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// export default withClerkMiddleware((req: NextRequest) => {
//   return NextResponse.next();
// });

// Stop Middleware running on static files
// export const config = {
//   matcher: "/((?!_next/image|_next/static|favicon.ico).*)",
// };

// export function middleware(request: NextRequest) {
//   console.log("running middleware", request.url);
//   return NextResponse.next();
// }

export const middleware = withClerkMiddleware((request: NextRequest) => {
  console.log("running middleware", request.url);
  return NextResponse.next();
});

export const config = {
  matcher: "/((?!_next/image|_next/static|favicon.ico|favicon.svg).*)",
};
