import { connectToDatabase } from '../_lib/db.js';
import { Venue } from '../_lib/models.js';

export default async function handler(req, res) {
  console.log('🚀 Venues API called:', {
    method: req.method,
    origin: req.headers.origin,
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
    console.log('📊 Connecting to database for venues...');
    await connectToDatabase();
    console.log('✅ Database connected successfully for venues');
    
    if (req.method === 'GET') {
      console.log('🔍 Fetching venues from database...');
      const venues = await Venue.find({}).lean();
      console.log(`📋 Found ${venues.length} venues in database`);
      
      if (venues.length > 0) {
        console.log('📝 Sample venue:', JSON.stringify(venues[0], null, 2));
      }
      
      // Ensure all IDs are strings in response
      const venuesWithStringIds = venues.map(venue => ({
        ...venue,
        _id: venue._id.toString()
      }));
      
      console.log(`🚀 Returning ${venuesWithStringIds.length} venues to client`);
      res.status(200).json(venuesWithStringIds);
    } else {
      console.log(`❌ Method ${req.method} not allowed for venues API`);
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('💥 Error in venues API:', error);
    console.error('💥 Error stack:', error.stack);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}