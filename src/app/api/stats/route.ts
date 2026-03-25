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

  return NextResponse.json({ total, hot, warm, cold, matchRate, faqCount: store.faqs.length, productCount: store.products.length });
}
