export default async function handler(req, res) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  // Get access token
  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  const tokenData = await tokenResponse.json();

  if (!tokenData.access_token) {
    return res.status(500).json({ error: 'Token failed', debug: tokenData });
  }

  const accessToken = tokenData.access_token;

  // Fetch artist
  const artistResponse = await fetch(
    'https://api.spotify.com/v1/artists/073You0CZI4IlhXhpuzZ6x',
    {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    }
  );

  const artistData = await artistResponse.json();

  if (!artistData.followers) {
    return res.status(500).json({ error: 'Followers missing', debug: artistData });
  }

  return res.status(200).json({
    current: artistData.followers.total
  });
}
