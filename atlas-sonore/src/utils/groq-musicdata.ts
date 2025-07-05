// Service IA gratuit pour récupérer les données d'origine des artistes via Groq
import Groq from 'groq-sdk';

// Interface pour les informations d'origine
export interface ArtistOriginInfo {
  name: string;
  country?: string;
  country_name?: string;
  city?: string;
  error?: string;
}

// Interface pour la requête batch
export interface ArtistRequest {
  name: string;
  track?: string;
  album?: string;
}

// Configuration Groq (100% gratuit)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

/**
 * Génère les données d'origine pour plusieurs artistes via Groq (GRATUIT)
 */
export async function getArtistsOriginWithAI(artists: ArtistRequest[]): Promise<ArtistOriginInfo[]> {
  try {
    const prompt = createPrompt(artists);
    
    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192", // Modèle plus intelligent (gratuit mais plus lent)
      messages: [
        {
          role: "system",
          content: "Tu es un expert en musique mondiale. Réponds uniquement avec du JSON valide, pas d'explication."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1, // Faible température pour plus de précision
      max_tokens: 4000,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('Pas de réponse de l\'IA');
    }

    // Parser la réponse JSON
    const parsedData = JSON.parse(responseText);
    
    // Valider et nettoyer les données
    return validateAndCleanData(parsedData, artists);
    
  } catch (error) {
    console.error('Erreur Groq:', error);
    
    // Fallback : retourner des objets vides avec erreur
    return artists.map(artist => ({
      name: artist.name,
      error: `Erreur IA: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
    }));
  }
}



/**
 * Nettoie le nom de l'artiste en supprimant les featuring
 */
function cleanArtistName(artistName: string): string {
  if (!artistName) return artistName;
  
  // Patterns pour détecter les featuring
  const featPatterns = [
    /\s+feat\.?\s+.*/i,
    /\s+ft\.?\s+.*/i,
    /\s+featuring\s+.*/i,
    /\s+with\s+.*/i,
    /\s+&\s+.*/i,
    /\s+x\s+.*/i,
    /\s+vs\.?\s+.*/i,
    /\s+versus\s+.*/i,
    /\s+\+\s+.*/i
  ];
  
  let cleanName = artistName.trim();
  
  // Supprimer tout ce qui vient après les patterns de featuring
  for (const pattern of featPatterns) {
    cleanName = cleanName.replace(pattern, '');
  }
  
  return cleanName.trim();
}

/**
 * Crée le prompt optimisé pour l'IA
 */
function createPrompt(artists: ArtistRequest[]): string {
  const artistList = artists.map((artist, index) => {
    // Nettoyer le nom de l'artiste en supprimant les featuring
    const cleanName = cleanArtistName(artist.name);
    let description = `${index + 1}. "${cleanName}"`;
    if (artist.track) {
      description += ` (titre: "${artist.track}")`;
    }
    if (artist.album) {
      description += ` (album: "${artist.album}")`;
    }
    return description;
  }).join('\n');

  return `Tu es un expert en musique mondiale avec une connaissance approfondie des artistes récents, locaux et internationaux de toutes époques et régions. 

Analyse ces artistes musicaux et leurs contextes :

${artistList}

Instructions :
- Utilise toutes les informations disponibles (nom artiste, titre, album) pour identifier l'origine
- Pour les artistes récents/émergents, base-toi sur les indices contextuels
- Pour les artistes latino-américains classiques : attention aux confusions Espagne/Argentine/Mexique
- Pour les artistes francophones : distingue France/Québec/Afrique francophone/Belgique
- Si tu n'es pas certain, utilise "null" plutôt qu'une estimation
- CRITIQUE : NE JAMAIS deviner ou estimer un pays sans certitude absolue
- ATTENTION : Pour les artistes très récents (2024+), sois extra prudent et utilise "null" si incertain
- Sois particulièrement attentif aux artistes francophones et européens récents
- Sois particulièrement attentif aux artistes des années 1960-1980 souvent mal identifiés
- IMPORTANT : Si un artiste collabore avec des artistes français connus (Josman, etc.), il est probablement français

Exemples d'erreurs à éviter :
- Piero = Argentine (pas Espagne)
- Céline Dion = Canada (pas France)
- Stromae = Belgique (pas France)
- Chezile = USA (pas France) - artiste américain d'Albuquerque, New Mexico

Indices contextuels pour les artistes français récents :
- Collaborations avec Josman, Laylow, Freeze Corleone, Damso, etc. = souvent français
- Albums récents (2020+) avec titres en français = probablement français
- Noms d'artistes simples (Zed, Jok'air, etc.) dans le rap français = souvent français
- MAIS si aucun indice français clair = utiliser "null"

RAPPEL FINAL : Mieux vaut dire "null" que de se tromper de pays !

Réponds UNIQUEMENT avec un JSON array structuré ainsi :
[
  {
    "name": "nom de l'artiste",
    "country": "code ISO 2 lettres ou null",
    "country_name": "nom complet du pays ou null", 
    "city": "ville d'origine ou null"
  }
]`;
}

/**
 * Valide et nettoie les données reçues de l'IA
 */
function validateAndCleanData(data: any[], originalArtists: ArtistRequest[]): ArtistOriginInfo[] {
  if (!Array.isArray(data)) {
    throw new Error('La réponse IA n\'est pas un array');
  }

  const results: ArtistOriginInfo[] = [];

  for (let i = 0; i < originalArtists.length; i++) {
    const original = originalArtists[i];
    const aiData = data[i];

    if (!aiData) {
      results.push({
        name: original.name,
        error: 'Pas de données IA pour cet artiste'
      });
      continue;
    }

    // Valider le format des données
    const result: ArtistOriginInfo = {
      name: aiData.name || cleanArtistName(original.name), // Utiliser le nom de l'IA ou fallback
      country: validateCountryCode(aiData.country),
      country_name: typeof aiData.country_name === 'string' ? aiData.country_name : undefined,
      city: typeof aiData.city === 'string' ? aiData.city : undefined
    };

    results.push(result);
  }

  return results;
}

/**
 * Valide le code pays ISO
 */
function validateCountryCode(country: any): string | undefined {
  if (typeof country !== 'string') return undefined;
  
  // Liste des codes pays ISO 2 lettres les plus courants
  const validCountryCodes = [
    'US', 'GB', 'FR', 'DE', 'IT', 'ES', 'CA', 'AU', 'JP', 'KR',
    'BR', 'MX', 'AR', 'NL', 'BE', 'SE', 'NO', 'DK', 'FI', 'IS',
    'IE', 'CH', 'AT', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'RS',
    'SI', 'SK', 'LT', 'LV', 'EE', 'GR', 'PT', 'TR', 'RU', 'UA',
    'IN', 'CN', 'TH', 'VN', 'PH', 'ID', 'MY', 'SG', 'NZ', 'ZA'
  ];

  const upperCountry = country.toUpperCase();
  return validCountryCodes.includes(upperCountry) ? upperCountry : undefined;
}



/**
 * Exporte la fonction de nettoyage pour usage externe
 */
export { cleanArtistName }; 