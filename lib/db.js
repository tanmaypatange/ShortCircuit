import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
let cachedClient = null
let cachedDb = null

export async function connectToDB() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  const db = client.db(new URL(uri).pathname.substring(1))

  cachedClient = client
  cachedDb = db

  return { client, db }
}
