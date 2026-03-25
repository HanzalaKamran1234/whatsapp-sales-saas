import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/server';
import { processIncomingMessage } from '@/lib/whatsapp/engine';

// Meta requires a GET request to verify the webhook initially
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Verify token matches your config (we will use an env variable for this)
  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('WEBHOOK_VERIFIED');
    return new NextResponse(challenge, { status: 200 });
  } else {
    return new NextResponse('Forbidden', { status: 403 });
  }
}

// POST requests are where Meta sends the actual WhatsApp messages
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if it's a WhatsApp status update or message
    if (body.object) {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        const phoneNumberId = body.entry[0].changes[0].value.metadata.phone_number_id;
        const from = body.entry[0].changes[0].value.messages[0].from; // sender number
        const msgBody = body.entry[0].changes[0].value.messages[0].text.body; // text
        
        console.log(`Received message from ${from}: ${msgBody}`);

        // Process message through the rule engine asynchronously
        // We don't await because Meta needs a 200 OK immediately
        processIncomingMessage(phoneNumberId, from, msgBody);

      }
      return new NextResponse('EVENT_RECEIVED', { status: 200 });
    } else {
      return new NextResponse('Not Found', { status: 404 });
    }
  } catch (error) {
    console.error('Error in webhook POST:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
