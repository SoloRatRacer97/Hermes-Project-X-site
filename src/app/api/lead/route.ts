import { siteConfig } from "@/lib/config";

function json(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status });
}

function buildRequestId() {
  return `projectx-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function POST(request: Request) {
  const requestId = buildRequestId();

  try {
    const payload = await request.json();
    const webhookUrl = String(siteConfig.formWebhookUrl || "").trim();

    if (!webhookUrl) {
      return json(500, {
        ok: false,
        requestId,
        error: "Landing webhook is not configured.",
      });
    }

    const requiredFields = [
      ["service", payload.service],
      ["address", payload.address],
      ["first_name", payload.first_name],
      ["last_name", payload.last_name],
      ["email", payload.email],
      ["phone", payload.phone],
    ];
    const missing = requiredFields
      .filter(([, value]) => !String(value || "").trim())
      .map(([key]) => key);

    if (missing.length > 0) {
      return json(400, {
        ok: false,
        requestId,
        error: `Missing required fields: ${missing.join(", ")}`,
      });
    }

    const upstreamPayload = {
      ...payload,
      source: payload.source || siteConfig.formSource,
      requestId,
      landingClientId: siteConfig.buildMeta.clientId,
      landingCompanyName: siteConfig.buildMeta.companyName,
    };

    const upstreamResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(upstreamPayload),
    });

    const text = await upstreamResponse.text();
    if (!upstreamResponse.ok) {
      return json(502, {
        ok: false,
        requestId,
        error: "Upstream webhook rejected the submission.",
        upstreamStatus: upstreamResponse.status,
        upstreamBody: text.slice(0, 400),
      });
    }

    return json(200, {
      ok: true,
      requestId,
      upstreamStatus: upstreamResponse.status,
      upstreamBody: text.slice(0, 400),
    });
  } catch (error) {
    return json(500, {
      ok: false,
      requestId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
