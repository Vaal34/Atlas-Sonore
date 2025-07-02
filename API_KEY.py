import requests
import os

# Fonction pour lire le fichier .env
def load_env_file(file_path='.env'):
    env_vars = {}
    try:
        with open(file_path, 'r') as file:
            for line in file:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key.strip()] = value.strip()
    except FileNotFoundError:
        print(f"Fichier {file_path} non trouvé")
    return env_vars

# Charger les variables d'environnement depuis le fichier .env
env_vars = load_env_file()

# Configuration pour l'API Spotify
url = "https://accounts.spotify.com/api/token"
headers = {
    "Content-Type": "application/x-www-form-urlencoded"
}

spotify_id = env_vars.get('SPOTIFY_ID') or os.getenv('SPOTIFY_ID')
spotify_secret = env_vars.get('SPOTIFY_SECRET') or os.getenv('SPOTIFY_SECRET')

data = {
    "grant_type": "client_credentials",
    "client_id": spotify_id,
    "client_secret": spotify_secret
}

response = requests.post(url, headers=headers, data=data).json()
print(response["access_token"])