import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  console.log('Database connection requested');
  
  if (cached.conn) {
    console.log('Using existing database connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    const MONGODB_URI = process.env.MONGODB_URI;
    
    console.log('Environment variables check:', {
      MONGODB_URI_exists: !!MONGODB_URI,
      NODE_ENV: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
    
    if (!MONGODB_URI) {
      const error = new Error('MONGODB_URI environment variable is not defined. Please set it in your Vercel environment variables.');
      console.error('Database connection failed:', error.message);
      throw error;
    }

    console.log('Creating new database connection...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Database connection established successfully');
      return mongoose;
    }).catch((error) => {
      console.error('Database connection failed:', {
        message: error.message,
        code: error.code,
        name: error.name,
        timestamp: new Date().toISOString()
      });
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('Database connection ready');
  } catch (e) {
    console.error('Failed to establish database connection:', {
      message: e.message,
      stack: e.stack,
      timestamp: new Date().toISOString()
    });
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}