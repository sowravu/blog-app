import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// We use 'jose' here because standard 'jsonwebtoken' library is not fully compatible with
// Next.js Middleware Edge Runtime.
// Need to install 'jose': npm install jose

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Protect Admin Routes
    if (path.startsWith('/admin')) {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            const { payload } = await jwtVerify(token, secret);

            if (payload.role !== 'admin') {
                // Redirect to home if not admin (or show 403 page)
                return NextResponse.redirect(new URL('/', request.url));
            }
        } catch (error) {
            // Invalid token
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
