'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getAuthenticatedUser } from './auth';

// In a real application, these actions would interact with a database (e.g., Firestore)
// and Firebase Auth. For this MVP, we'll simulate the behavior.

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export async function loginUser(values: z.infer<typeof loginSchema>) {
  console.log('Simulating login for:', values.email);
  // In a real app, you would verify credentials with Firebase Auth.
  if (values.email === 'user@example.com' && values.password === 'password123') {
    // Simulate setting a session cookie
    revalidatePath('/', 'layout');
    return { success: true };
  }
  return { success: false, message: 'Invalid email or password.' };
}


const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});
export async function registerUser(values: z.infer<typeof registerSchema>) {
  console.log('Simulating registration for:', values.email);
  // In a real app, you would create a user with Firebase Auth and save user data to Firestore.
  // We'll simulate a successful registration.
  return { success: true };
}

export async function purchaseSkin(formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error('You must be logged in to purchase a skin.');
  }
  
  const skinId = formData.get('skinId') as string;
  if (!skinId) {
    throw new Error('Skin ID is missing.');
  }

  console.log(`Simulating purchase of skin ${skinId} for user ${user.id}`);
  // In a real app, you would:
  // 1. Check if the user already owns the skin.
  // 2. Process payment (e.g., with Stripe).
  // 3. Create a new document in the 'purchases' collection in Firestore.

  revalidatePath('/profile');
  revalidatePath(`/skins/${skinId}`);
}

const skinSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    game: z.string().min(1, "Please select a game."),
    rarity: z.string().min(1, "Please select a rarity."),
    price: z.coerce.number().min(0, "Price must be a positive number."),
    description: z.string().min(10, "Description must be at least 10 characters."),
});

export async function addSkin(values: z.infer<typeof skinSchema>) {
    console.log('Simulating adding new skin:', values);
    // In a real app, you would create a new skin document in Firestore.
    revalidatePath('/admin');
    revalidatePath('/');
}

export async function updateSkin(id: string, values: z.infer<typeof skinSchema>) {
    console.log(`Simulating updating skin ${id} with:`, values);
    // In a real app, you would update the skin document in Firestore.
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath(`/skins/${id}`);
}

export async function deleteSkin(id: string) {
    console.log(`Simulating deleting skin ${id}`);
    // In a real app, you would delete the skin document in Firestore.
    revalidatePath('/admin');
    revalidatePath('/');
}
