import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const privatePaths = ['/user'];
const authPaths = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.headers.get('authorization');

    if (privatePaths.some((path) => pathname.startsWith(path)) && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (authPaths.some((path) => pathname.startsWith(path)) && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/register', '/forgot-password', '/user/:path*'],
};
