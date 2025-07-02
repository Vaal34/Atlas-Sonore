import { FlipButton } from "@/components/animate-ui/buttons/flip";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <FlipButton
        from="top"
        frontClassName="bg-spotify-green"
        frontText="Se connecter"
        backContent={
          <img 
            src="/Primary_Logo_Green_PMS_U.svg" 
            alt="Spotify" 
            className="w-5 h-5" 
          />
        }
      />
    </div>
  );
}
