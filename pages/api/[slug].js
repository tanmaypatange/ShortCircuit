import { MongoClient } from 'mongodb'

export default async function handler(req, res) {
  const client = new MongoClient(process.env.MONGODB_URI)
  const { slug } = req.query

  try {
    await client.connect()
    const doc = await client.db('urls').collection('mappings')
      .findOne({ slug })

    if (doc) {
      res.redirect(302, doc.url)
    } else {
      res.status(404).json({ error: 'URL not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  } finally {
    await client.close()
  }
}