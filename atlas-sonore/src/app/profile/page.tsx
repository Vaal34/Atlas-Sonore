import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import TopTracks from "@/components/TopTracks";

export default async function Profile() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/");
  }
  return (
    <div className="min-h-screen text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-green-500">
          Profil Spotify
        </h1>

        <div className="bg-gray-900 rounded-lg p-6 space-y-4">
          <div className="flex items-center space-x-4">
            {user.user_metadata?.avatar_url && (
              <img
                src={user.user_metadata.avatar_url}
                alt="Avatar"
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold">
                {user.user_metadata?.full_name ||
                  user.user_metadata?.name ||
                  "Utilisateur"}
              </h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p>
              <span className="text-green-500">ID:</span> {user.id}
            </p>
            <p>
              <span className="text-green-500">Provider:</span>{" "}
              {user.app_metadata?.provider}
            </p>
            <p>
              <span className="text-green-500">Dernière connexion:</span>{" "}
              {new Date(user.last_sign_in_at || "").toLocaleString()}
            </p>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-lg font-semibold mb-2 text-green-500">
              Métadonnées Spotify
            </h3>
            <pre className=" p-3 rounded text-xs overflow-auto">
              {JSON.stringify(user.user_metadata, null, 2)}
            </pre>
          </div>
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
    </div>
  );
}
