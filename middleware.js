import {NextResponse} from 'next/server';
import { jwtVerify } from 'jose';
import { ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute';
import { USER_DASHBOARD,WEBSITE_LOGIN } from '@/routes/WebsiteRoute';

function applyCors(request, res) {
  const origin = request.headers.get('origin');
  if (!origin) return res;

  const allowed = (process.env.CORS_ALLOWED_ORIGINS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  // If not configured, default to allowing same-origin only (i.e. do nothing).
  if (!allowed.length) return res;

  if (allowed.includes(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set('Access-Control-Allow-Credentials', 'true');
    res.headers.set('Vary', 'Origin');
    res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');

    const reqHeaders = request.headers.get('access-control-request-headers');
    res.headers.set(
      'Access-Control-Allow-Headers',
      reqHeaders || 'Content-Type, Authorization, X-Requested-With'
    );
    res.headers.set('Access-Control-Max-Age', '86400');
  }

  return res;
}

export async function middleware(request) {
  try {
      const pathname = request.nextUrl.pathname;

      // CORS for API routes (must happen before any redirects).
      if (pathname.startsWith('/api/')) {
        if (request.method === 'OPTIONS') {
          return applyCors(request, new NextResponse(null, { status: 204 }));
        }
        return applyCors(request, NextResponse.next());
      }

      const hasToken = request.cookies.has('access_token');
      if (!hasToken){
          if (!pathname.startsWith('/auth')){
              return NextResponse.redirect(new URL(WEBSITE_LOGIN,request.nextUrl));
          }
          return NextResponse.next();
      }

      const access_token = request.cookies.get('access_token').value;
      const { payload } = await jwtVerify(access_token,new TextEncoder().encode(process.env.SECRET_KEY));

      const role = payload.role;
      if(pathname.startsWith('/auth')) {
          return NextResponse.redirect(new URL(role === 'admin' ? 
                                               ADMIN_DASHBOARD : USER_DASHBOARD
                                               ,request.nextUrl))
      }
      if (pathname.startsWith('/admin') && role !== 'admin'){
          return NextResponse.redirect(new URL(WEBSITE_LOGIN,request.nextUrl));
      }

      if (pathname.startsWith('/my-account') && role !== 'user'){
          return NextResponse.redirect(new URL(WEBSITE_LOGIN,request.nextUrl));
      }
      return NextResponse.next();
  }catch(error) {
          return NextResponse.redirect(new URL(WEBSITE_LOGIN,request.nextUrl));
  }
}

export const config = {
    matcher: ['/api/:path*','/admin/:path*','/my-account/:path*','/auth/:path*']
}
