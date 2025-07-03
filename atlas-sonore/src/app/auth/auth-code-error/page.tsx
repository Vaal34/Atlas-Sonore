import { ArrowLeftIcon } from '@/components/animate-ui/icons/arrow-left'
import { LogOut, LogOutIcon } from '@/components/animate-ui/icons/log-out'
import { FlipButton } from '@/components/ui/flip-button'
import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-3xl font-black text-red-300">
          Erreur d'Authentification
        </h1>
        
        <p className="text-xl">
          Une erreur s'est produite lors de l'authentification avec Spotify.
        </p>
        
        <Link href="/">
          <FlipButton
            from="top"
            frontClassName="bg-spotify-green"
            backClassName="bg-spotify-black border-spotify-green border"
            frontText="Retour à l'accueil"
            backContent={
              <div className="flex items-center space-x-2">
                <ArrowLeftIcon className="w-5 h-5 text-spotify-green" animateOnHover animation="default-loop" loop={true}/>
              </div>
            }
          />
      </Link>
      </div>
    </div>
  )
} 