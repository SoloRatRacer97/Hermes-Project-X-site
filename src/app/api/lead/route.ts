import { NextRequest, NextResponse } from 'next/server';
import { siteConfig } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward the lead payload to the Zapier webhook
    const webhookUrl = siteConfig.formWebhookUrl;
    if (!webhookUrl || webhookUrl.includes('placeholder')) {
      return NextResponse.json({ ok: false, error: 'No webhook configured' }, { status: 500 });
    }

    const payload = {
      ...body,
      source: body.source || siteConfig.formSource,
      pageUrl: body.pageUrl || `https://hermes-project-x-site.vercel.app`,
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ ok: false, error: `Upstream ${response.status}: ${text}` }, { status: 502 });
    }

    const result = await response.json().catch(() => ({ ok: true }));
    return NextResponse.json({ ok: true, requestId: result.requestId || '' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}