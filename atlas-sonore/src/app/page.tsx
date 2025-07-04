import { BubbleBackground } from "@/components/animate-ui/backgrounds/bubble";
import { GradientText } from "@/components/animate-ui/text/gradient";
import { HighlightText } from "@/components/animate-ui/text/highlight";
import { RotatingText } from "@/components/animate-ui/text/rotating";
import { FlipButton } from "@/components/ui/flip-button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si l'utilisateur est connecté, rediriger vers le profil
  if (user) {
    redirect("/profile");
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen text-white space-y-6">
      <BubbleBackground
        className="absolute inset-0 -z-10"
        colors={{
          first: "40,40,40", // Gris sombre
          second: "60,60,60", // Gris moyen sombre
          third: "30,30,30", // Gris très sombre
          fourth: "50,50,50", // Gris intermédiaire
          fifth: "35,35,35", // Gris profond
          sixth: "45,45,45", // Gris nuancé
        }}
        interactive={true}
      />
      <div className="text-center space-y-2">
        <GradientText
          text="Atlas Sonore"
          className="text-7xl font-bold"
          gradient="linear-gradient(75deg, #1ED760 0%, rgb(221,74,255) 25%, #1ED760 50%, rgb(140,100,255) 75%, #1ED760 100%)"
        />
        <RotatingText
          text={[
            "Connectez-vous avec Spotify pour commencer",
            "Connect with Spotify to get started",
            "Conéctate con Spotify para empezar",
            "Verbinden Sie sich mit Spotify",
            "Connetti con Spotify per iniziare",
          ]}
          duration={3000}
          className="font-light text-shadow-neutral-400 text-lg font"
        />
      </div>

      <Link href="/api/auth/spotify">
        <FlipButton
          className="font-semibold "
          from="top"
          frontClassName="bg-spotify-green"
          backClassName="bg-spotify-black border-spotify-green border"
          frontText="Se connecter avec Spotify"
          backContent={
            <div className="flex items-center space-x-2 animate-pulse">
              <img
                src="/Primary_Logo_Green_PMS_U.svg"
                alt="Spotify"
                className="w-5 h-5"
              />
            </div>
          }
        />
      </Link>
    </div>
  );
}
