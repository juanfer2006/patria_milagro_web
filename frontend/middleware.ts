import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface JwtPayload {
  sub: string;
  role: 'ADMIN' | 'USER';
  exp: number;
}

function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get('cr_token');
  const token = tokenCookie?.value;

  let session: JwtPayload | null = null;
  if (token) {
    const parsed = parseJwt(token);
    // Verificar si no ha expirado
    if (parsed && parsed.exp * 1000 > Date.now()) {
      session = parsed;
    }
  }

  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const isCasesRoute = pathname === '/cases' || pathname.startsWith('/cases/');
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isPrivateRoute = isCasesRoute || isAdminRoute;

  // 1. Si no tiene sesión e intenta entrar a una ruta privada -> redirigir a /login
  if (!session && isPrivateRoute) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Si tiene sesión e intenta entrar a /login o /register -> redirigir a /cases
  if (session && isAuthRoute) {
    const casesUrl = new URL('/cases', request.url);
    return NextResponse.redirect(casesUrl);
  }

  // 3. Si intenta entrar a /admin sin rol ADMIN -> redirigir a /cases
  if (isAdminRoute && session?.role !== 'ADMIN') {
    const casesUrl = new URL('/cases', request.url);
    return NextResponse.redirect(casesUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/cases/:path*', '/cases', '/admin/:path*', '/admin'],
};
