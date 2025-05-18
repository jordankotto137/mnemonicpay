import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, csrfCheck, validatePhraseFormat, sanitizeInput } from '@/lib/security';

/**
 * Middleware for API routes to apply security checks
 * @param request The incoming request
 */
export async function middleware(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;
  
  // Apply CSRF protection for non-GET requests
  if (request.method !== 'GET') {
    const csrfResponse = csrfCheck(request);
    if (csrfResponse) return csrfResponse;
  }
  
  // Continue to the route handler
  return NextResponse.next();
}

// Configure the middleware to run only for API routes
export const config = {
  matcher: '/api/:path*',
};
