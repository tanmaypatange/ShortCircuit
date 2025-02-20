import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
let cachedDb = null

export async function connectToDB() {
  if (cachedDb) return { db: cachedDb }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  const db = client.db(new URL(uri).pathname.substring(1))
  cachedDb = db

  return { db }
}
