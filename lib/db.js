import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
let cachedDb = null

export async function connectToDB() {
  if (cachedDb) return cachedDb

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000
  })

  const dbName = process.env.MONGODB_DB || new URL(uri).pathname.split('/')[1]
  cachedDb = client.db(dbName)

  return cachedDb
}
