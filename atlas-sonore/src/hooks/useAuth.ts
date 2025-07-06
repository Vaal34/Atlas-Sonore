import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

export function useAuth() {
  const supabase = createClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async (): Promise<User | null> => {
      console.log('🔄 useAuth: Requête getUser()');
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;
      console.log('✅ useAuth: Utilisateur récupéré', user?.id || 'null');
      return user;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Configuration optimisée pour éviter les requêtes multiples
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    // Réessayer rapidement en cas d'échec auth
    retryDelay: 500,
  });

  console.log('🔍 useAuth state:', { 
    isLoading, 
    hasUser: !!user, 
    isAuthenticated: !!user,
    error: error?.message || 'none'
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
  };
} 