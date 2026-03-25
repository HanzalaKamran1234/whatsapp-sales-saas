import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  return NextResponse.json(store.faqs);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newFaq = { faq_id: Date.now().toString(), user_id: 'demo', ...body };
  store.faqs.push(newFaq);
  return NextResponse.json(newFaq, { status: 201 });
}

export async function DELETE(request: Request) {
  const { faq_id } = await request.json();
  store.faqs = store.faqs.filter(f => f.faq_id !== faq_id);
  return NextResponse.json({ success: true });
}
