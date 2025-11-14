import { PrismaClient } from '@prisma/client';
import { User, Skin } from './types'; //esta importacion fue sin ayuda de IA
import { adaptSkins } from "@/lib/types/prismaAdapters";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function getAllSkins(): Promise<Skin[]> {
  const dbSkins = await prisma.skin.findMany({ orderBy: { createdAt: "desc" } });
  return adaptSkins(dbSkins);
}

/* !!!!! Necesito arreglar la parte que dice Promise<any> 
porque me quita los beneficos de tipado estricto, osea que me deja publicar skins sin campos requeridos
*/



// Obtener lista única de juegos
export async function getGames() {
  const games = await prisma.skin.findMany({
    select: { game: true },
    distinct: ['game'],
  });
  return games.map(g => g.game);
}

// Obtener lista única de rarezas
export async function getRarities() {
  const rarities = await prisma.skin.findMany({
    select: { rarity: true },
    distinct: ['rarity'],
  });
  return rarities.map(r => r.rarity);
}

export async function getSkinById(id: string) {
  return prisma.skin.findUnique({ where: { id } });
}

export async function createSkin(data: { name: string; game: string; rarity: string; price: number; imageUrl: string; description?: string }) {
  return prisma.skin.create({ data });
}

export async function updateSkin(id: string, data: Partial<{ name: string; game: string; rarity: string; price: number; imageUrl: string; description?: string }>) {
  return prisma.skin.update({ where: { id }, data });
}

export async function deleteSkin(id: string) {
  return prisma.skin.delete({ where: { id } });
}

export async function createPurchase(userId: string, skinId: string) {
  return prisma.purchase.create({ data: { userId, skinId } });
}

export async function getPurchasesForUser(userId: string) {
  return prisma.purchase.findMany({ where: { userId }, orderBy: { purchaseDate: 'desc' } });
}

//este array/objeto es extraido del archivo data.ts de las otra rama local del proyecto
export const users: User[] = [
    {
        id: '1',
        name: 'Alex Gamer',
        email: 'alex@example.com'
    },
    {
        id: '2',
        name: 'Bella Collector',
        email: 'bella@example.com'
    }
];
export async function getRecommendationsForUser(userId: string) {
  // simple co-purchase heuristic implemented here for convenience
  const userPurchases = await prisma.purchase.findMany({ where: { userId } });
  const userSkinIds = userPurchases.map(p => p.skinId);

  const coBuyerRows = await prisma.purchase.findMany({ where: { skinId: { in: userSkinIds } } });
  const coBuyers = Array.from(new Set(coBuyerRows.map(r => r.userId))).filter(id => id !== userId);

  const coBuyerPurchases = await prisma.purchase.findMany({ where: { userId: { in: coBuyers } } });
  const recommendedIds = Array.from(new Set(coBuyerPurchases.map(p => p.skinId))).filter(id => !userSkinIds.includes(id));

  return prisma.skin.findMany({ where: { id: { in: recommendedIds } } });
}
