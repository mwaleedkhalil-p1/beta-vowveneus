import { connectToDatabase } from './_lib/db.js';
import { User } from './_lib/models.js';
import { scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

const scryptAsync = promisify(scrypt);

async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split('.');
  const hashedBuf = Buffer.from(hashed, 'hex');
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export default async function handler(req, res) {
  console.log('Login API called:', {
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

  if (req.method !== 'POST') {
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
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Database connected successfully');
    
    const { username, password } = req.body;
    console.log('Login attempt for username:', username);
    
    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    console.log('Finding user in database...');
    const user = await User.findOne({ username }).lean();
    
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('User found, verifying password...');
    const passwordValid = await comparePasswords(password, user.password);
    
    if (!passwordValid) {
      console.log('Password verification failed for user:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('Password verified, creating JWT token...');
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    userWithoutPassword._id = userWithoutPassword._id.toString();
    
    console.log('Login successful for user:', username);
    res.status(200).json({ 
      user: userWithoutPassword, 
      token 
    });
  } catch (error) {
    console.error('Error in login API:', {
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