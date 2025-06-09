import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Keeping this here for reference, but not using it for now
// eslint-disable-next-line no-unused-vars
export function middleware(request: NextRequest) {
  const response = NextResponse.next({});

  // Set a new response header `x-react-learning-track`
  response.headers.set('x-react-learning-track', '1');
  return response;
}

// Only run the middleware on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
