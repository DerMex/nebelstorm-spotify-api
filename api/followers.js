export default async function handler(req, res) {

  const clientId = process.env.1c8cc9c4cd6d4e9ebea8608fd65e0ace;
  const clientSecret = process.env.bcd26b8c7f1047e5a3bad5d10af50907;

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
    return res.status(500).json({ error: 'Token failed' });
  }

  const artistResponse = await fetch(
    'https://api.spotify.com/v1/artists/073You0CZI4IlhXhpuzZ6x',
    {
      headers: {
        'Authorization': 'Bearer ' + tokenData.access_token
      }
    }
  );

  const artistData = await artistResponse.json();

  return res.status(200).json({
    current: artistData.followers.total
  });
}
