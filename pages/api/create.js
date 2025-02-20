import { MongoClient } from 'mongodb'
import crypto from 'crypto'

export default async function handler(req, res) {
  const client = new MongoClient(process.env.MONGODB_URI)
  
  try {
    // Validate request methode
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    // Validate URL format
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/
    if (!urlRegex.test(req.body.url)) {
      return res.status(400).json({ error: 'Invalid URL format' })
    }

    await client.connect()
    const db = client.db()
    const collection = db.collection('urls')

    // Generate unique ID
    let slug
    let attempts = 0
    do {
      slug = crypto.randomBytes(6).toString('base64url').substring(0, 8)
      attempts++
    } while (await collection.findOne({ slug }) && attempts < 5)

    if (attempts >= 5) {
      return res.status(500).json({ error: 'Failed to generate unique slug' })
    }

    // Insert document
    const result = await collection.insertOne({
      slug,
      url: req.body.url,
      createdAt: new Date()
    })

    res.status(201).json({
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`,
      id: result.insertedId
    })

  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    await client.close()
  }
}
