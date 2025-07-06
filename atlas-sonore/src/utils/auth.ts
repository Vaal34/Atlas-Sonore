import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { User } from "@supabase/supabase-js";

/**
 * Obtient l'utilisateur courant. Redirige vers la page d'accueil si non connecté.
 * À utiliser dans les Server Components uniquement.
 */
export async function getAuthenticatedUser(): Promise<User> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/");
  }

  return user;
}

/**
 * Obtient l'utilisateur courant sans redirection.
 * Retourne null si non connecté.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
} 