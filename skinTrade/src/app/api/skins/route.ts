import { NextResponse } from 'next/server';
import { getAllSkins, createSkin } from '@/lib/db';

export async function GET() {
  try {
    const skins = await getAllSkins();
    return NextResponse.json({ ok: true, data: skins });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await createSkin(body);
    return NextResponse.json({ ok: true, data: created });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}