import type { ImagePlaceholder } from "./placeholder-images";

export type SkinRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';

export type Skin = {
  id: string;
  name: string;
  game: string;
  rarity: SkinRarity;
  price: number;
  image: ImagePlaceholder;
  description: string;
};

export type Purchase = {
  id: string;
  userId: string;
  skinId: string;
  purchaseDate: string; // ISO string for easy serialization
};

export type User = {
  id: string;
  email: string;
  name: string;
};
