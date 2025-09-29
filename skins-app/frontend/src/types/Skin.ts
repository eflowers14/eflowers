export interface Skin {
  id: number;
  name: string;
  description: string;
  price: number;
  rarity: string;
  image_url: string;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}