import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory store for rate limiting (For a single Node instance)
// In a serverless/multi-instance deployment (like Vercel), this should be replaced with Redis (Upstash)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests per minute for sensitive routes

export function proxy(request: NextRequest) {
  // 1. Security Headers
  const response = NextResponse.next();
  
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  // 2. Rate Limiting (Only apply to specific API routes to prevent abuse)
  const isProtectedApi = 
    request.nextUrl.pathname.startsWith('/api/v1/assistant') ||
    request.nextUrl.pathname.startsWith('/api/v1/search') ||
    request.nextUrl.pathname.startsWith('/api/auth');

  if (isProtectedApi) {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown-ip';
    const now = Date.now();
    
    const clientData = rateLimitMap.get(ip);
    
    if (!clientData) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    } else {
      if (now > clientData.resetTime) {
        // Reset window
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
      } else {
        clientData.count++;
        if (clientData.count > MAX_REQUESTS_PER_WINDOW) {
          return new NextResponse(
            JSON.stringify({ error: 'Too Many Requests', message: 'Rate limit exceeded.' }),
            { 
              status: 429, 
              headers: { 
                'Content-Type': 'application/json',
                'Retry-After': Math.ceil((clientData.resetTime - now) / 1000).toString()
              } 
            }
          );
        }
      }
    }
    
    // Optional: cleanup old entries to prevent memory leak
    if (Math.random() < 0.05) { // 5% chance to trigger cleanup
      for (const [key, data] of rateLimitMap.entries()) {
        if (Date.now() > data.resetTime) {
          rateLimitMap.delete(key);
        }
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
