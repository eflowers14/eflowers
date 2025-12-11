import type { Skin as PrismaSkin } from "@prisma/client";
import type { Skin } from "../types";

export function adaptSkin(dbSkins: any[]): Skin[] {
  return dbSkins.map(skin => ({
    id: skin.id,
    name: skin.name,
    game: skin.game,
    rarity: skin.rarity as Skin["rarity"],
    price: skin.price,
    image: skin.imageUrl || 'https://picsum.photos/seed/${skin.id}/300/300',
    description: skin.description ?? ""
  }));
}
export function adaptSkins(prismaSkins: PrismaSkin[]): Skin[] {
  return adaptSkin(prismaSkins);
}

