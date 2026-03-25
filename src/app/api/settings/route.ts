import { NextResponse } from 'next/server';
import { store, SellerConfig } from '@/lib/store';

// GET - return current config (masked for security)
export async function GET() {
  const config = store.sellerConfig;
  return NextResponse.json({
    connected: !!config,
    phone_number_id: config?.phone_number_id ?? '',
    business_account_id: config?.business_account_id ?? '',
    access_token_set: !!config?.access_token,
    auto_reply_enabled: config?.auto_reply_enabled ?? true,
    connected_at: config?.connected_at ?? null,
  });
}

// POST - save seller's WhatsApp configuration
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { access_token, phone_number_id, business_account_id } = body;

    if (!access_token || !phone_number_id) {
      return NextResponse.json({ error: 'access_token and phone_number_id are required' }, { status: 400 });
    }

    const config: SellerConfig = {
      access_token,
      phone_number_id,
      business_account_id: business_account_id || '',
      auto_reply_enabled: body.auto_reply_enabled ?? true,
      connected_at: new Date().toISOString(),
    };

    store.sellerConfig = config;
    console.log(`WhatsApp connected: Phone Number ID ${phone_number_id}`);

    return NextResponse.json({ success: true, message: 'WhatsApp credentials saved successfully!' });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
