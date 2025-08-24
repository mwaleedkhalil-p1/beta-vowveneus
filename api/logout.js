export default async function handler(req, res) {
  console.log('🚀 Logout API called:', {
    method: req.method,
    origin: req.headers.origin,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString()
  });

  // Handle CORS with specific origins
  const allowedOrigins = [
    'https://beta-vowveneus-v1.vercel.app',
    'https://beta-vowveneus.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // For JWT-based auth, logout is handled client-side by removing the token
  // This endpoint just confirms the logout action
  res.status(200).json({ message: 'Logged out successfully' });
}