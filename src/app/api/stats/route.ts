import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = await createClient();

  // Fetch all leads for this user
  const { data: leads, error: leadsError } = await supabase
    .from('leads')
    .select('*')
    .eq('user_id', userId);

  if (leadsError) return NextResponse.json({ error: leadsError.message }, { status: 500 });

  const total = leads.length;
  const hot = leads.filter(l => l.tags?.includes('hot')).length;
  const warm = leads.filter(l => l.tags?.includes('warm')).length;
  const cold = leads.filter(l => l.tags?.includes('cold')).length;
  const ruleMatched = leads.filter(l => l.rule_matched).length;
  const matchRate = total > 0 ? Math.round((ruleMatched / total) * 100) : 0;

  // Fetch counts for FAQs and Products
  const { count: faqCount } = await supabase.from('faqs').select('*', { count: 'exact', head: true }).eq('user_id', userId);
  const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('user_id', userId);

  // Fetch user profile for plan details
  const { data: profile } = await supabase.from('profiles').select('plan').eq('id', userId).single();
  const plan = profile?.plan || 'free';

  // Credit usage logic
  const planLimits: Record<string, number> = { free: 50, starter: 1000, pro: 999999 };
  const creditsUsed = ruleMatched; // each auto-reply = 1 credit
  const creditsLimit = planLimits[plan] || 50;
  const creditsPercent = creditsLimit === 999999 ? 0 : Math.min(100, Math.round((creditsUsed / creditsLimit) * 100));

  return NextResponse.json({
    total, hot, warm, cold, matchRate,
    faqCount: faqCount || 0,
    productCount: productCount || 0,
    credits: { used: creditsUsed, limit: creditsLimit, percent: creditsPercent, plan }
  });
}


