import { connectToDatabase } from '../_lib/db.js';
import { Venue } from '../_lib/models.js';
import fs from 'fs';
import path from 'path';

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
      let venues = await Venue.find({}).lean();
      console.log(`📋 Found ${venues.length} venues in database`);
      
      // If no venues exist, import them from halls.txt
      if (venues.length === 0) {
        console.log('📥 No venues found, importing from halls.txt...');
        try {
          await importVenuesFromFile();
          venues = await Venue.find({}).lean();
          console.log(`✅ Successfully imported ${venues.length} venues`);
        } catch (importError) {
          console.error('❌ Failed to import venues:', importError);
          return res.status(500).json({ 
            message: 'Failed to import venue data', 
            error: importError.message 
          });
        }
      }
      
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

// Import venues from halls.txt file
async function importVenuesFromFile() {
  try {
    console.log('🧹 Clearing existing venues...');
    await Venue.deleteMany({});
    console.log('✅ Cleared existing venues');

    // Try multiple possible paths for halls.txt
    const possiblePaths = [
      path.resolve(process.cwd(), 'attached_assets/halls.txt'),
      path.resolve(process.cwd(), '../attached_assets/halls.txt'),
      path.resolve(__dirname, '../attached_assets/halls.txt'),
      path.resolve(__dirname, '../../attached_assets/halls.txt')
    ];

    let filePath = null;
    let data = null;

    for (const testPath of possiblePaths) {
      try {
        console.log(`🔍 Trying path: ${testPath}`);
        data = await fs.promises.readFile(testPath, 'utf8');
        filePath = testPath;
        console.log(`✅ Found halls.txt at: ${filePath}`);
        break;
      } catch (err) {
        console.log(`❌ Path not found: ${testPath}`);
        continue;
      }
    }

    if (!data) {
      throw new Error('halls.txt file not found in any expected location');
    }

    const lines = data.split('\n').filter(Boolean);
    console.log(`📄 Processing ${lines.length} lines from halls.txt`);

    const venues = [];
    for (const line of lines) {
      try {
        const parts = line.split('\t').map(part => part.trim());
        if (parts.length < 6) {
          console.log('⚠️ Skipping: insufficient parts:', line);
          continue;
        }

        const name = parts[0];
        const capacity = parseInt(parts[1], 10);
        const parking = parseInt(parts[2], 10);
        const phone = parts[3];
        const address = parts[4];
        const price = parseInt(parts[5], 10);
        const email = parts[6] || undefined;

        if (!name || !capacity || isNaN(price)) {
          console.log('⚠️ Skipping: invalid data:', line);
          continue;
        }

        venues.push({
          name,
          capacity,
          additionalMetric: parking,
          phone,
          address,
          price,
          email,
        });

        console.log(`✅ Successfully parsed venue: ${name}`);

      } catch (error) {
        console.error('❌ Error parsing line:', line);
        console.error('❌ Error details:', error.message);
      }
    }

    if (venues.length > 0) {
      const result = await Venue.insertMany(venues);
      console.log(`🎉 Successfully imported ${venues.length} venues from halls.txt`);
      return result;
    } else {
      console.log('⚠️ No valid venues found to import');
      return [];
    }

  } catch (error) {
    console.error('💥 Error importing venues:', error);
    console.error('💥 Error stack:', error.stack);
    throw error;
  }
}