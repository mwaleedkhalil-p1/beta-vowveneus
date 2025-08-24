import { connectToDatabase } from '../_lib/db.js';
import { Venue } from '../_lib/models.js';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  console.log('🚀 Venue by ID API called:', {
    method: req.method,
    origin: req.headers.origin,
    venueId: req.query.id,
    timestamp: new Date().toISOString()
  });

  // Environment variable validation
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is not defined');
    return res.status(500).json({ 
      message: 'Server configuration error', 
      error: 'Database connection not configured' 
    });
  }

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
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectToDatabase();
    
    if (req.method === 'GET') {
      const { id } = req.query;
      
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid venue ID format' });
      }
      
      const venue = await Venue.findById(id).lean();
      
      if (!venue) {
        return res.status(404).json({ message: 'Venue not found' });
      }
      
      // Ensure the _id is converted to string
      venue._id = venue._id.toString();
      
      res.status(200).json(venue);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in venue API:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}