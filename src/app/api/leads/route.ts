import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  return NextResponse.json(store.leads);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { lead_id, ...rest } = body;
  const newLead = { lead_id: Date.now().toString(), ...rest, created_at: new Date().toISOString() };
  store.leads.unshift(newLead);
  return NextResponse.json(newLead, { status: 201 });
}

export async function PATCH(request: Request) {
  const { lead_id, ...updates } = await request.json();
  const idx = store.leads.findIndex(l => l.lead_id === lead_id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  store.leads[idx] = { ...store.leads[idx], ...updates };
  return NextResponse.json(store.leads[idx]);
}
