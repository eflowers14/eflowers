import { NextResponse } from 'next/server';
import { getGames } from '@/lib/db';

export async function GET() {
  try {
    const games = await getGames();
    return NextResponse.json({ ok: true, data: games });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
