curl -X POST "https://accounts.spotify.com/api/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=client_credentials&client_id=71ade1cd6c4c4554bb2eb6c2ef009b6a&client_secret=d9bf7a5a623b4c74944010449bb1fc53" \
     -s | jq -r '.access_token'
