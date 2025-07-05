import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getArtistsOriginWithAI, cleanArtistName, type ArtistRequest } from "@/utils/groq-musicdata";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // Récupération de la session utilisateur
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    // Récupération du token d'accès Spotify depuis la session
    const spotifyToken = session.provider_token;
    
    if (!spotifyToken) {
      return NextResponse.json(
        { error: "Token Spotify non trouvé" },
        { status: 401 }
      );
    }

    // Paramètres pour la requête à l'API Spotify
    const { searchParams } = new URL(request.url);
    console.log(request.url);
    const limit = searchParams.get('limit') || '20';
    const timeRange = searchParams.get('time_range') || 'medium_term';
    const offset = searchParams.get('offset') || '0';

    // Requête à l'API Spotify pour récupérer les top tracks
    const spotifyResponse = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=${timeRange}&offset=${offset}`,
      {
        headers: {
          'Authorization': `Bearer ${spotifyToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!spotifyResponse.ok) {
      const errorData = await spotifyResponse.json();
      return NextResponse.json(
        { error: "Erreur lors de la récupération des données Spotify", details: errorData },
        { status: spotifyResponse.status }
      );
    }

    const spotifyData = await spotifyResponse.json();

    // Préparer la liste des artistes uniques pour l'IA
    const artistRequests: ArtistRequest[] = [];
    const artistMap = new Map<string, any>();

    spotifyData.items.forEach((track: any) => {
      const primaryArtist = track.artists[0]?.name;
      const albumName = track.album?.name;
      const trackName = track.name;
      
      if (primaryArtist) {
        // Nettoyer le nom de l'artiste (enlever les featuring)
        const cleanName = cleanArtistName(primaryArtist);
        
        if (cleanName && !artistMap.has(cleanName)) {
          artistRequests.push({
            name: cleanName,
            track: trackName,
            album: albumName
          });
          artistMap.set(cleanName, true);
        }
      }
    });

    console.log(`🎵 Récupération des données d'origine pour ${artistRequests.length} artistes via IA...`);

    // Récupération des informations d'origine via IA (une seule requête pour tous les artistes)
    const artistsOriginData = await getArtistsOriginWithAI(artistRequests);
    
    // Créer un map pour l'accès rapide aux données d'origine
    const originMap = new Map();
    artistsOriginData.forEach(origin => {
      originMap.set(origin.name, origin);
    });

    // Formatage des données avec enrichissement IA
    const formattedTracks = spotifyData.items.map((track: any) => {
      const primaryArtist = track.artists[0]?.name || 'Artiste inconnu';
      const cleanName = cleanArtistName(primaryArtist);
      const originInfo = originMap.get(cleanName) || { 
        name: cleanName, 
        error: 'Données non trouvées' 
      };
      
      return {
        id: track.id,
        name: track.name,
        artists: track.artists.map((artist: any) => ({
          id: artist.id,
          name: artist.name,
        })),
        album: {
          id: track.album.id,
          name: track.album.name,
          images: track.album.images,
          release_date: track.album.release_date,
        },
        duration_ms: track.duration_ms,
        explicit: track.explicit,
        popularity: track.popularity,
        preview_url: track.preview_url,
        external_urls: track.external_urls,
        // Informations d'origine pour l'Atlas Sonore (générées par IA)
        origin: {
          country: originInfo.country,
          country_name: originInfo.country_name,
          city: originInfo.city,
          aiError: originInfo.error,
          source: 'AI' // Indiquer que les données viennent de l'IA
        }
      };
    });

    console.log(`✅ Données d'origine récupérées pour ${formattedTracks.length} tracks`);

    return NextResponse.json({
      tracks: formattedTracks,
      total: spotifyData.total,
      limit: parseInt(limit),
      offset: parseInt(offset),
      time_range: timeRange,
      artistsProcessed: artistRequests.length,
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des top tracks:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 