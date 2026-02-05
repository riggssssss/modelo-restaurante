import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const adminSession = request.cookies.get('admin_session')?.value;
    const isLoginPage = request.nextUrl.pathname === '/admin/login';
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

    // If trying to access admin routes (but not login) and not authenticated
    if (isAdminRoute && !isLoginPage && !adminSession) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // If trying to access login page while already authenticated
    if (isLoginPage && adminSession) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
