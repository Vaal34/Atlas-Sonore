import { z } from 'zod'

// Schéma pour un track individuel
export const TrackSchema = z.object({
  id: z.string(),
  name: z.string(),
  artists: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })),
  album: z.object({
    id: z.string(),
    name: z.string(),
    images: z.array(z.object({
      url: z.string(),
      height: z.number().nullable(),
      width: z.number().nullable(),
    })),
    release_date: z.string(),
  }),
  duration_ms: z.number(),
  explicit: z.boolean(),
  popularity: z.number(),
  preview_url: z.string().nullable(),
  external_urls: z.object({
    spotify: z.string().optional(),
  }),
  origin: z.object({
    country: z.string().optional(),
    country_name: z.string().optional(),
    city: z.string().optional(),
    aiError: z.string().optional(),
    source: z.literal('AI'),
  }),
})

// Schéma pour la réponse complète de l'API
export const TracksResponseSchema = z.object({
  tracks: z.array(TrackSchema),
  artistsProcessed: z.number(),
})

// Types inférés
export type Track = z.infer<typeof TrackSchema>
export type TracksResponse = z.infer<typeof TracksResponseSchema>

// Fonction de validation pour la réponse complète
export const validateTracksResponse = (data: unknown) => TracksResponseSchema.parse(data)