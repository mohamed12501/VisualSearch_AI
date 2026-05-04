export default async function handler(req, res) {
  // Clear the cookie by setting an expired date
  res.setHeader('Set-Cookie', 'auth_token=; Path=/; Max-Age=0; SameSite=Lax');
  
  return res.status(200).json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
}
