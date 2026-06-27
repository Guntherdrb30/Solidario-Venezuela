const allowedTypes = new Set([
  "consent.updated",
  "security.suspicious_path",
  "security.client_report",
]);

const allowedSeverity = new Set(["info", "warning", "critical"]);

function getClientIp(request: Request) {
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

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json(
      { ok: false, error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const type = typeof body.type === "string" ? body.type : "";
  const severity =
    typeof body.severity === "string" ? body.severity : "info";

  if (!allowedTypes.has(type) || !allowedSeverity.has(severity)) {
    return Response.json(
      { ok: false, error: "Invalid security event." },
      { status: 422 }
    );
  }

  const event = {
    source: "solidario.security.audit",
    type,
    severity,
    timestamp: new Date().toISOString(),
    ip: getClientIp(request),
    userAgent: request.headers.get("user-agent") || "unknown",
    referer: request.headers.get("referer") || null,
    path: typeof body.path === "string" ? body.path.slice(0, 300) : null,
    consent: typeof body.consent === "string" ? body.consent : null,
    message:
      typeof body.message === "string" ? body.message.slice(0, 500) : null,
  };

  console.warn("solidario.security.audit", JSON.stringify(event));

  return Response.json(
    { ok: true },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
