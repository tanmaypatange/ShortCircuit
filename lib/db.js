import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
let cachedClient = null
let cachedDb = null

export async function connectToDB() {
  if (cachedDb) return { client: cachedClient, db: cachedDb }

  const client = await MongoClient.connect(uri, {
    maxPoolSize: 10, // Connection pooling
    connectTimeoutMS: 5000, // 5 seconds timeout
    serverSelectionTimeoutMS: 5000
  })
  
  const dbName = new URL(uri).pathname.split('/')[1]
  const db = client.db(dbName)

  cachedClient = client
  cachedDb = db

  return { client, db }
}
