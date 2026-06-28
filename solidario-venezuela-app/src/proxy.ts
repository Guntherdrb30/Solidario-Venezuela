import { NextResponse, type NextRequest } from "next/server";

const suspiciousPathPatterns = [
  "/.env",
  "/wp-admin",
  "/wp-login",
  "/phpmyadmin",
  "/admin.php",
  "/config.php",
  "/server-status",
  "/.git",
];

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.toLowerCase();

  // CORS preflight for /api/* — allow external apps to query public endpoints
  if (pathname.startsWith('/api/') && request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const response = NextResponse.next();

  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  if (suspiciousPathPatterns.some((pattern) => pathname.includes(pattern))) {
    console.warn(
      "solidario.security.probe",
      JSON.stringify({
        source: "solidario.security.probe",
        type: "security.suspicious_path",
        severity: "warning",
        timestamp: new Date().toISOString(),
        ip: getClientIp(request),
        path: request.nextUrl.pathname,
        userAgent: request.headers.get("user-agent") || "unknown",
        referer: request.headers.get("referer") || null,
      })
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
  ],
};
