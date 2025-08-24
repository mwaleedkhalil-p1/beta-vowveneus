import { connectToDatabase } from './_lib/db.js';
import { User } from './_lib/models.js';
import jwt from 'jsonwebtoken';

function verifyToken(token) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET environment variable is not set');
      return null;
    }
    return jwt.verify(token, secret);
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return null;
  }
}

export default async function handler(req, res) {
  console.log('User API called:', {
    method: req.method,
    url: req.url,
    headers: Object.keys(req.headers),
    timestamp: new Date().toISOString()
  });

  // Handle CORS
  const allowedOrigins = [
    'https://beta-vowveneus-v1.vercel.app',
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

  if (req.method !== 'GET') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Environment variable validation
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set');
    return res.status(500).json({ 
      message: 'Server configuration error', 
      error: 'Database connection not configured' 
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET environment variable is not set');
    return res.status(500).json({ 
      message: 'Server configuration error', 
      error: 'Authentication not configured' 
    });
  }

  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid authorization header');
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.substring(7);
    console.log('Token extracted, length:', token.length);
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      console.log('Token verification failed');
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    console.log('Token verified for user:', decoded.userId);
    
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Database connected successfully');
    
    console.log('Finding user by ID:', decoded.userId);
    const user = await User.findById(decoded.userId).select('-password').lean();
    
    if (!user) {
      console.log('User not found in database:', decoded.userId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    user._id = user._id.toString();
    console.log('User found and returning data');
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error in user API:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}