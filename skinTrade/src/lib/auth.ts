import { users } from '@/lib/db';
import type { User } from '@/lib/types';

/**
 * Simulates fetching the currently authenticated user.
 * In a real application, this would involve verifying a session cookie or JWT.
 * For this MVP, we hardcode user '1' as the logged-in user.
 * @returns A promise that resolves to the user object or null if not authenticated.
 */
export async function getAuthenticatedUser(): Promise<User | null> {
  // To simulate a logged-out state, change the ID to one that doesn't exist.
  const loggedInUserId = '1'; 
  const user = users.find(u => u.id === loggedInUserId);
  return user || null;
}
