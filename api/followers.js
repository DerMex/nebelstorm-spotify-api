export default async function handler(req, res) {

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: "Missing environment variables" });
  }

  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: 'grant_type=client_credentials'
  });

  const tokenData = await tokenResponse.json();

  if (!tokenData.access_token) {
    return res.status(500).json({ error: 'Token failed', debug: tokenData });
  }

  const artistResponse = await fetch(
    'https://api.spotify.com/v1/artists/073You0CZI4IlhXhpuzZ6x',
    {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + tokenData.access_token,
        'Accept': 'application/json'
      }
    }
  );

  const artistData = await artistResponse.json();

  return res.status(200).json({
    fullResponse: artistData
  });
}
