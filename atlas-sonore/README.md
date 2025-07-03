# Atlas Sonore

Un projet Next.js avec authentification Supabase pour une application musicale.

## Structure du projet

```
atlas-sonore/
├── scripts/           # Scripts utilitaires (Python, etc.)
│   └── spotify_token.py
├── src/
│   ├── app/          # Routes Next.js App Router
│   │   ├── api/      # Routes API
│   │   ├── auth/     # Pages d'authentification
│   │   ├── profile/  # Page de profil
│   │   ├── private/  # Pages privées
│   │   └── error/    # Page d'erreur
│   ├── components/   # Composants React
│   │   ├── ui/       # Composants UI réutilisables
│   │   └── index.ts  # Export centralisé
│   ├── lib/          # Bibliothèques et utilitaires
│   │   ├── utils.ts  # Utilitaires UI (Tailwind CSS)
│   │   └── supabase.ts # Exports Supabase centralisés
│   └── utils/        # Configuration et utilitaires spécifiques
│       └── supabase/ # Configuration Supabase
└── public/           # Assets statiques
```

## Technologies utilisées

- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Supabase** - Backend-as-a-Service (authentification, base de données)
- **Framer Motion** - Animations
- **Lucide React** - Icônes

## Démarrage

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Configuration

1. Créer un fichier `.env.local` avec vos clés Supabase :
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Pour l'API Spotify, créer un fichier `.env` avec :
```env
SPOTIFY_ID=your_spotify_client_id
SPOTIFY_SECRET=your_spotify_client_secret
```

## Scripts utiles

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Build de production
- `npm run start` - Démarre le serveur de production
- `npm run lint` - Vérification ESLint
- `python scripts/spotify_token.py` - Génère un token d'accès Spotify

## Architecture

Le projet suit les meilleures pratiques Next.js 15 avec une organisation claire :

- **Séparation des responsabilités** : UI, logique métier, et configuration
- **Imports centralisés** : Tous les composants exportés via des fichiers index
- **Structure modulaire** : Chaque dossier a une responsabilité claire
- **Type safety** : TypeScript configuré strictement

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
