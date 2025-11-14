import { NextResponse } from 'next/server';
import { createPurchase, getPurchasesForUser } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    if (!userId) return NextResponse.json({ ok: false, error: 'userId required' }, { status: 400 });
    const purchases = await getPurchasesForUser(userId);
    return NextResponse.json({ ok: true, data: purchases });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, skinId } = body;
    if (!userId || !skinId) return NextResponse.json({ ok: false, error: 'userId and skinId required' }, { status: 400 });
    const created = await createPurchase(userId, skinId);
    return NextResponse.json({ ok: true, data: created });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

