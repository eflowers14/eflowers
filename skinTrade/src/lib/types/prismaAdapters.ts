import type { Skin as PrismaSkin } from "@prisma/client";
import type { Skin } from "../types";

// Adaptador: convierte PrismaSkin → tu tipo Skin frontend
export function adaptSkin(prismaSkin: PrismaSkin): Skin {
  return {
    id: prismaSkin.id,
    name: prismaSkin.name,
    game: prismaSkin.game,
    rarity: prismaSkin.rarity as Skin["rarity"],
    price: prismaSkin.price,
    image: {
        id: prismaSkin.id,
        description: prismaSkin.description ?? "",
        imageUrl: prismaSkin.imageUrl,
        imageHint: "skin papaaaaa"
    },
    description: prismaSkin.description ?? ""
  };
}
export function adaptSkins(prismaSkins: PrismaSkin[]): Skin[] {
  return prismaSkins.map(adaptSkin);
}

