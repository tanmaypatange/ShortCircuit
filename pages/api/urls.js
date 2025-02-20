import { MongoClient } from 'mongodb'

export default async function handler(req, res) {
  const client = new MongoClient(process.env.MONGODB_URI)
  
  try {
    await client.connect()
    const collection = client.db('urls').collection('mappings')

    if (req.method === 'POST') {
      const { slug, url } = req.body
      await collection.insertOne({ slug, url, createdAt: new Date() })
      return res.status(201).json({ success: true })
    }

    if (req.method === 'GET') {
      const docs = await collection.find().toArray()
      return res.json(docs)
    }

  } catch (error) {
    return res.status(500).json({ error: error.message })
  } finally {
    await client.close()
  }
}
