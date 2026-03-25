import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { planId } = await request.json();
    
    // Define plan details (Map these to your Stripe Price IDs in production)
    const PLANS: Record<string, { priceId: string; name: string }> = {
      starter: {
        priceId: process.env.STRIPE_STARTER_PRICE_ID || '',
        name: 'Starter Plan',
      },
      pro: {
        priceId: process.env.STRIPE_PRO_PRICE_ID || '',
        name: 'Pro Plan',
      },
    };

    const plan = PLANS[planId];
    if (!plan || !plan.priceId) {
      return NextResponse.json({ error: 'Invalid plan selected or Price ID missing' }, { status: 400 });
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
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/#pricing`,
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
