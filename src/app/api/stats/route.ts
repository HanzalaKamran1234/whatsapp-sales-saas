import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  const leads = store.leads;
  const total = leads.length;
  const hot = leads.filter(l => l.tags.includes('hot')).length;
  const warm = leads.filter(l => l.tags.includes('warm')).length;
  const cold = leads.filter(l => l.tags.includes('cold')).length;
  const ruleMatched = leads.filter(l => l.rule_matched).length;
  const matchRate = total > 0 ? Math.round((ruleMatched / total) * 100) : 0;

  // Credit usage (demo: Free plan = 50 limit)
  const plan = 'free';
  const planLimits: Record<string, number> = { free: 50, starter: 1000, pro: Infinity };
  const creditsUsed = ruleMatched; // each auto-reply = 1 credit
  const creditsLimit = planLimits[plan];
  const creditsPercent = creditsLimit === Infinity ? 0 : Math.min(100, Math.round((creditsUsed / creditsLimit) * 100));

  return NextResponse.json({
    total, hot, warm, cold, matchRate,
    faqCount: store.faqs.length, productCount: store.products.length,
    credits: { used: creditsUsed, limit: creditsLimit, percent: creditsPercent, plan }
  });
}

