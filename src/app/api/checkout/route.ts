import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { auth } from '@clerk/nextjs/server';
import { COUNTRIES } from '@/lib/pricing';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { planId, countryCode } = await request.json();
    
    // Find country and rate
    const country = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];
    const unitAmount = country.rates[planId as 'starter' | 'pro'];

    const PRODUCTS: Record<string, { productId: string; name: string }> = {
      starter: {
        productId: process.env.STRIPE_STARTER_PRODUCT_ID || '',
        name: 'Starter Plan',
      },
      pro: {
        productId: process.env.STRIPE_PRO_PRODUCT_ID || '',
        name: 'Pro Plan',
      },
    };

    const product = PRODUCTS[planId];
    if (!product) {
      return NextResponse.json({ error: `Plan '${planId}' does not exist.` }, { status: 400 });
    }
    if (!product.productId) {
      return NextResponse.json({ error: `Stripe Product ID for '${planId}' is missing in your Vercel Environment Variables.` }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl || !appUrl.startsWith('http')) {
      return NextResponse.json({ 
        error: `Your NEXT_PUBLIC_APP_URL is missing or invalid (${appUrl}). It must start with https://` 
      }, { status: 400 });
    }

    // Create Stripe Checkout Session with Dynamic Price Data
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: country.currency.toLowerCase(),
            product: product.productId,
            unit_amount: unitAmount * 100, // Stripe expects cents/paisa
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/#pricing`,
      metadata: {
        userId,
        planId,
        countryCode: country.code,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

