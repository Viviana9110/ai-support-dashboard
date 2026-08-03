import { NextRequest, NextResponse } from 'next/server';

import { SESSION_COOKIE, verifySessionToken } from '@/lib/jwt';

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/tickets',
  '/customers',
  '/conversations',
  '/knowledge',
  '/analytics',
  '/ai',
  '/settings',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (isProtected && !session) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (pathname === '/login' && session) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/dashboard/:path*',
    '/tickets/:path*',
    '/customers/:path*',
    '/conversations/:path*',
    '/knowledge/:path*',
    '/analytics/:path*',
    '/ai/:path*',
    '/settings/:path*',
  ],
};
