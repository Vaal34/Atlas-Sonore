"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { validateTracksResponse } from "../schema/tracks.schema";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Profile() {
  const { user, isLoading: userLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirection si non authentifié
  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [userLoading, isAuthenticated, router]);

  const getTracks = async () => {
    try {
      const response = await fetch("api/spotify/user/top-tracks");
      const data = await response.json();
      const validatedData = validateTracksResponse(data);
      return validatedData;
    } catch (error) {
      throw error;
    }
  };

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["tracks"],
    queryFn: getTracks,
    // Cache pendant 10 minutes (600000 ms)
    staleTime: 10 * 60 * 1000,
    // Garde les données en cache pendant 30 minutes même si non utilisées
    gcTime: 30 * 60 * 1000,
    // Ne pas refaire la requête quand la fenêtre reprend le focus
    refetchOnWindowFocus: false,
    // Ne pas refaire la requête automatiquement en arrière-plan
    refetchInterval: false,
    // Ne pas refaire la requête quand on remonte en ligne
    refetchOnReconnect: false,
    // Seulement exécuter si l'utilisateur est authentifié
    enabled: isAuthenticated,
    // Réessayer une seule fois
    retry: 1,
    retryDelay: 2000,
  });

  // Affichage du loading pendant la vérification d'authentification
  if (userLoading) {
    return <div className="min-h-screen text-white p-8">Chargement...</div>;
  }

  // Ne pas afficher la page si non authentifié
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen text-white p-8">
      <div className="">
        {/* Affichage conditionnel selon l'état de la requête */}
        {isLoading && <p>Chargement des pistes...</p>}
        {isError && (
          <div className="text-red-400">
            <p>Erreur lors du chargement des pistes</p>
            <p className="text-sm mt-2">
              Détails: {error?.message || "Erreur inconnue"}
            </p>
          </div>
        )}
        {data && (
          <div className="">
            <h2 className="text-2xl font-bold mb-4">
              Vos pistes les plus écoutées
            </h2>
            <p className="text-gray-400 mb-6">
              {data.tracks.length} pistes • {data.artistsProcessed} artistes
              analysés
            </p>
            <pre className="text-sm">
              {JSON.stringify(data.tracks, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-8 space-x-4">
        <Link
          href="/"
          className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Retour à l'accueil
        </Link>
        <form action="/api/auth/signout" method="post" className="inline">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Se déconnecter
          </button>
        </form>
      </div>
    </div>
  );
}
