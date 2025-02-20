import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
let cachedDb = null

export async function connectToDB() {
  if (cachedDb) return { db: cachedDb }

  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  const db = client.db(new URL(MONGODB_URI).pathname.substring(1))
  cachedDb = db

  return { db }
}
