import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI;
let cachedDb = null;

export async function connectToDB() {
  if (cachedDb) return cachedDb;

  // Validation layer
  if (!uri) throw new Error('MONGODB_URI missing in environment variables');
  
  const normalizedUri = uri.startsWith('mongodb+srv://') ? uri : 
    uri.replace('mongodb://', 'mongodb+srv://');

  const client = await MongoClient.connect(normalizedUri, {
    useNewUrlParser: true,
    serverSelectionTimeoutMS: 10000,
    ssl: true // Essential for MongoDB Atlas
  });

  const dbName = new URL(normalizedUri).pathname.split('/')[1] || 'urls';
  if (!dbName) throw new Error('Failed to resolve database name');

  cachedDb = client.db(dbName);
  return cachedDb;
}
