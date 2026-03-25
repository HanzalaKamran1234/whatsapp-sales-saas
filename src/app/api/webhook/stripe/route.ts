import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature');

  let event;

  try {
    if (!signature || !webhookSecret) {
       console.error('Missing Stripe Signature or Webhook Secret');
       return NextResponse.json({ error: 'Missing Signature or Secret' }, { status: 400 });
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const planId = session.metadata?.planId;

      if (userId && planId) {
        console.log(`Checkout session completed for user ${userId} (Plan: ${planId})`);
        
        const supabase = await createClient();
        const { error } = await supabase
          .from('profiles')
          .update({ 
            plan: planId,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (error) {
          console.error('Error updating profile in Supabase:', error);
        } else {
          console.log(`User ${userId} upgraded to ${planId}`);
        }
      }
      break;

    case 'customer.subscription.deleted':
    case 'customer.subscription.updated':
        // Handle plan cancellations or changes if needed
        const subscription = event.data.object;
        // In a full implementation, you'd lookup the user by subscription.customer
        // and update their plan accordingly.
        break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
