import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow requests for Next.js internals, static files, and the auth endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/public') ||
    pathname === '/favicon.ico' ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Try to get token from cookie via next-auth
  let token = null;
  try {
    token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  } catch (err) {
    // If getToken throws (e.g. missing secret), treat as unauthenticated
    console.error('getToken error in middleware:', err);
    token = null;
  }

  // If user is on /signup and already authenticated, redirect to /
  if (pathname === '/signup' && token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If not authenticated, redirect to /signup
  if (!token) {
    console.log(token)
    // Allow the signup and login pages; requests to these should not be redirected away
    if (pathname === '/signup' || pathname === '/login') {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/signup', req.url));
  }

  // Authenticated -> allow
  return NextResponse.next();
}

// Apply middleware to all routes except _next, static, api, and assets
export const config = {
  matcher: ['/((?!_next|static|api|favicon.ico|public).*)'],
};

