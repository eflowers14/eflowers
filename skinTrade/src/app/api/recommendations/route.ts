import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    if (!userId) return NextResponse.json({ ok: false, error: 'userId required' }, { status: 400 });

    // get skins purchased by user
    const userPurchases = await prisma.purchase.findMany({ where: { userId } });
    const userSkinIds = userPurchases.map(p => p.skinId);

    // find other users who bought the same skins
    const coBuyerRows = await prisma.purchase.findMany({ where: { skinId: { in: userSkinIds } } });
    const coBuyers = Array.from(new Set(coBuyerRows.map(r => r.userId))).filter(id => id !== userId);

    // get other purchases from co-buyers
    const coBuyerPurchases = await prisma.purchase.findMany({ where: { userId: { in: coBuyers } } });
    const recommendedIds = Array.from(new Set(coBuyerPurchases.map(p => p.skinId))).filter(id => !userSkinIds.includes(id));

    const recommended = await prisma.skin.findMany({ where: { id: { in: recommendedIds } } });
    return NextResponse.json({ ok: true, data: recommended });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
