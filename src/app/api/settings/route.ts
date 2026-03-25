import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';

// GET - return current config from Supabase (masked for security)
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    connected: !!profile?.whatsapp_phone_number_id,
    phone_number_id: profile?.whatsapp_phone_number_id ?? '',
    business_account_id: profile?.whatsapp_business_account_id ?? '',
    access_token_set: !!profile?.whatsapp_access_token,
    auto_reply_enabled: profile?.auto_reply_enabled ?? true,
    connected_at: profile?.connected_at ?? null,
  });
}

// POST - save seller's WhatsApp configuration to Supabase
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { access_token, phone_number_id, business_account_id } = body;

    if (!access_token || !phone_number_id) {
      return NextResponse.json({ error: 'access_token and phone_number_id are required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        whatsapp_access_token: access_token,
        whatsapp_phone_number_id: phone_number_id,
        whatsapp_business_account_id: business_account_id || '',
        auto_reply_enabled: body.auto_reply_enabled ?? true,
        connected_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, message: 'WhatsApp credentials saved successfully!' });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

