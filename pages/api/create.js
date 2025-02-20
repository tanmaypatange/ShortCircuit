import { connectToDB } from '../../lib/db'
import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { url } = req.body

  try {
    // Validate URL format
    const urlObj = new URL(url)
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Invalid URL protocol')
    }
  } catch (err) {
    return res.status(400).json({ error: 'Invalid URL format' })
  }

  const { db } = await connectToDB()
  let attempts = 0
  let slug

  while (attempts < 5) {
    // Generate 8-character random slug
    slug = crypto.randomBytes(6).toString('base64url').slice(0,8)
    const exists = await db.collection('urls').findOne({ slug })
    
    if (!exists) break
    attempts++
  }

  if (attempts >= 5) {
    return res.status(500).json({ error: 'Failed to generate unique slug' })
  }

  try {
    await db.collection('urls').insertOne({
      slug,
      url,
      createdAt: new Date()
    })

    res.json({
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`
    })
  } catch (err) {
    console.error('Database error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
