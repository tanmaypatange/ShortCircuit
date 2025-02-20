import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
let cachedDb = null

export async function connectToDB() {
  if (cachedDb) return cachedDb

  if (!uri) throw new Error('MONGODB_URI environment variable undefined')

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    serverSelectionTimeoutMS: 10000,
    ssl: process.env.NODE_ENV === 'production',
  })

  const dbName = process.env.MONGODB_DB || new URL(uri).pathname.substring(1)
  if (!dbName) throw new Error('Could not resolve database name')

  cachedDb = client.db(dbName)
  return cachedDb
}
