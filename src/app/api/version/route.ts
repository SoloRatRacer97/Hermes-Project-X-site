import { NextResponse } from 'next/server';
import { siteConfig } from '@/lib/config';

export async function GET() {
  const { buildMeta, formWebhookUrl, formSource } = siteConfig;
  return NextResponse.json({
    clientId: buildMeta.clientId,
    companyName: buildMeta.companyName,
    generatedAt: buildMeta.generatedAt,
    formSource: formSource,
    webhookConfigured: Boolean(formWebhookUrl && !formWebhookUrl.includes('placeholder')),
  });
}