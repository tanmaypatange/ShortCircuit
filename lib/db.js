import { MongoClient } from 'mongodb'

const url = process.env.MONGODB_URI
let cachedDb = null

export async function connectToDB() {
  if (cachedDb) return cachedDb

  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000
  })

  const dbName = new URL(url).pathname.split('/')[1]
  cachedDb = client.db(dbName)

  return cachedDb
}
