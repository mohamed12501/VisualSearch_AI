import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  // Mockup validation (Always succeeds for this demo)
  console.log(`Mockup Login attempt: ${username}`);

  // Create a payload for the JWT
  const payload = {
    user: username || 'Professor',
    role: 'examiner',
    iat: Math.floor(Date.now() / 1000),
  };

  // Sign the JWT
  // Note: In a real app, use a strong secret from process.env
  const secret = 'visualsearch_secret_key_2026';
  const token = jwt.sign(payload, secret, { expiresIn: '1h' });

  // Set the cookie
  // We'll make it NOT HttpOnly so it's visible in document.cookie for the demo, 
  // but we'll explain it should be HttpOnly in production.
  res.setHeader('Set-Cookie', `auth_token=${token}; Path=/; Max-Age=3600; SameSite=Lax`);

  return res.status(200).json({ 
    success: true, 
    message: 'Authentication successful',
    token: token,
    user: payload.user
  });
}
