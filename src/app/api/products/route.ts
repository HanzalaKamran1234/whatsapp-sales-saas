import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  return NextResponse.json(store.products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newProduct = { product_id: Date.now().toString(), user_id: 'demo', ...body };
  store.products.push(newProduct);
  return NextResponse.json(newProduct, { status: 201 });
}

export async function DELETE(request: Request) {
  const { product_id } = await request.json();
  store.products = store.products.filter(p => p.product_id !== product_id);
  return NextResponse.json({ success: true });
}
