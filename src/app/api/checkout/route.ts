import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { planId } = await request.json();
    
    const starterId = process.env.STRIPE_STARTER_PRICE_ID;
    const proId = process.env.STRIPE_PRO_PRICE_ID;

    const PLANS: Record<string, { priceId: string; name: string }> = {
      starter: {
        priceId: starterId || '',
        name: 'Starter Plan',
      },
      pro: {
        priceId: proId || '',
        name: 'Pro Plan',
      },
    };

    const plan = PLANS[planId];
    if (!plan) {
      return NextResponse.json({ error: `Plan '${planId}' does not exist.` }, { status: 400 });
    }
    if (!plan.priceId) {
      return NextResponse.json({ error: `Stripe Price ID for '${planId}' is missing in your Vercel Environment Variables.` }, { status: 400 });
    }
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!appUrl || !appUrl.startsWith('http')) {
      return NextResponse.json({ 
        error: `Your NEXT_PUBLIC_APP_URL is missing or invalid (${appUrl}). It must start with https:// (e.g. hhttps://whatsapp-sales-saas.vercel.app)` 
      }, { status: 400 });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/#pricing`,

      metadata: {
        userId,
        planId,
      },
      customer_email: undefined, // Clerk user's email can be passed here if available
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
