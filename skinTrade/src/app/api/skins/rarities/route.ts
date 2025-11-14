import { NextResponse } from 'next/server';
import { getRarities } from '@/lib/db';

export async function GET() {
  try {
    const rarities = await getRarities();
    return NextResponse.json({ ok: true, data: rarities });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
