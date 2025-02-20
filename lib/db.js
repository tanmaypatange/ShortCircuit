import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
let cachedDb = null

export async function connectToDB() {
  if (cachedDb) return cachedDb

  // Error handling for missing env
  if (!uri) throw new Error('MONGODB_URI environment variable not defined')
  
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    serverSelectionTimeoutMS: 10000,
    ssl: true // REQUIRED FOR ATLAS
  })

  // Explicit database name detection
  const dbName = new URL(uri).pathname.split('/')[1] || 'urls'
  if (!dbName) throw new Error('Failed to detect database name from URI')

  cachedDb = client.db(dbName)
  return cachedDb
}
