import { MongoClient } from 'mongodb'

let cachedDb = null

export async function connectToDB() {
  if (cachedDb) return cachedDb
  
  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
  })
  
  cachedDb = client.db() // Critical fix: use connection string database name
  return cachedDb
}
