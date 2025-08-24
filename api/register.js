import { connectToDatabase } from './_lib/db.js';
import { User } from './_lib/models.js';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString('hex')}.${salt}`;
}

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
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

  try {
    await connectToDatabase();
    
    const { username, password, name, email } = req.body;
    
    if (!username || !password || !name || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ username }).lean();
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = new User({
      username,
      password: hashedPassword,
      name,
      email
    });
    
    const savedUser = await user.save();
    
    // Create JWT token
    const token = jwt.sign(
      { userId: savedUser._id.toString(), username: savedUser.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    // Remove password from response
    const userResponse = {
      _id: savedUser._id.toString(),
      username: savedUser.username,
      name: savedUser.name,
      email: savedUser.email,
      createdAt: savedUser.createdAt
    };
    
    res.status(201).json({ 
      user: userResponse, 
      token 
    });
  } catch (error) {
    console.error('Error in register API:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}