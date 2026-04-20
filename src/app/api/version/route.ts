import { siteConfig } from "@/lib/config";

export function GET() {
  return Response.json({
    ok: true,
    clientId: siteConfig.buildMeta.clientId,
    companyName: siteConfig.buildMeta.companyName,
    generatedAt: siteConfig.buildMeta.generatedAt,
    profileSchemaDate: siteConfig.buildMeta.profileSchemaDate,
    formSource: siteConfig.formSource,
    webhookConfigured: Boolean(String(siteConfig.formWebhookUrl || "").trim()),
  });
}
