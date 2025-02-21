import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
let cachedClient = null
let cachedDb = null

export async function connectToDB() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined')
  }

  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  const dbName = new URL(MONGODB_URI).pathname.substring(1)
  const db = client.db(dbName)

  cachedClient = client
  cachedDb = db

  return { client, db }
}