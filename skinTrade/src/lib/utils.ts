import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
//debo instalar estas dependencias
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}
