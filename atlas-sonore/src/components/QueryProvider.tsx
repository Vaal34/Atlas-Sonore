"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Cache pendant 5 minutes par défaut
        staleTime: 5 * 60 * 1000,
        // Garde les données en cache pendant 30 minutes
        gcTime: 30 * 60 * 1000,
        // Ne pas refaire la requête quand la fenêtre reprend le focus
        refetchOnWindowFocus: false,
        // Ne pas refaire la requête quand on remonte en ligne
        refetchOnReconnect: false,
        // Réessayer maximum 1 fois en cas d'échec
        retry: 1,
        // Délai entre les tentatives
        retryDelay: 1000,
      },
    },
  }));

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}; 