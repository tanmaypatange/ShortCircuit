import { MongoClient } from 'mongodb'
import crypto from 'crypto'

const client = new MongoClient(process.env.MONGODB_URI)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Validate URL format
    const url = new URL(req.body.url)
    if (!['http:', 'https:'].includes(url.protocol)) {
      return res.status(400).json({ error: 'Invalid URL protocol' })
    }
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL format' })
  }

  // Auto-generate path with collision check
  let shortPath
  let attempts = 0
  
  await client.connect()
  const collection = client.db().collection('urls')

  while (attempts < 5) {
    shortPath = crypto.randomBytes(6).toString('base64url').slice(0, 8)
    const exists = await collection.findOne({ shortPath })
    
    if (!exists) break
    attempts++
  }

  if (attempts >= 5) {
    return res.status(500).json({ error: 'Failed to generate unique path' })
  }

  // Store in existing MongoDB collection
  await collection.insertOne({
    originalUrl: req.body.url,
    shortPath,
    createdAt: new Date()
  })

  res.json({
    shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${shortPath}`
  })
}
