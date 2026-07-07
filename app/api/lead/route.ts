import { NextResponse } from "next/server";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { projectXConfig } from "../../project-x-config";

function parseEnvFile(filePath: string) {
  if (!existsSync(filePath)) return {} as Record<string, string>;

  return Object.fromEntries(
    readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const index = line.indexOf("=");

        return index === -1 ? [line, ""] : [line.slice(0, index), line.slice(index + 1)];
      }),
  );
}

function resolveWebhookUrl() {
  const configured = projectXConfig.integration.formWebhookUrl;
  if (configured && configured !== "server") return configured;

  const envWebhook = process.env.PROJECTX_SHARED_WEBHOOK_URL || process.env.ZAPIER_WEBHOOK_URL;
  if (envWebhook) return envWebhook;

  const home = process.env.HOME || "/Users/toddanderson";
  const envFile = process.env.PROJECTX_LEAD_ENV_FILE || join(home, "hermes-envs", "projectx", "testing.env");
  const env = parseEnvFile(envFile);

  return env.PROJECTX_SHARED_WEBHOOK_URL || env.ZAPIER_WEBHOOK_URL || "";
}

export async function POST(request: Request) {
  const webhookUrl = resolveWebhookUrl();

  if (!webhookUrl) {
    return NextResponse.json(
      { ok: false, error: "Lead intake is not configured." },
      { status: 503 },
    );
  }

  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid lead payload." },
      { status: 400 },
    );
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      source: payload.source || projectXConfig.integration.formSource,
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { ok: false, error: "Lead intake did not accept the request." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
