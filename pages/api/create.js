import { connectToDB } from '../../lib/db'
import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { url } = req.body

  try {
    new URL(url) // Validate URL format
  } catch {
    return res.status(400).json({ error: 'Invalid URL' })
  }

  const { db } = await connectToDB()
  
  // Generate unique slug with collision check
  let slug
  let attempts = 0
  do {
    slug = crypto.randomBytes(5).toString('hex').slice(0,10)
    const exists = await db.collection('urls').findOne({ slug })
    if (!exists) break
  } while (++attempts < 5)

  if (attempts >= 5) {
    return res.status(500).json({ error: 'Failed to generate unique slug' })
  }

  try {
    await db.collection('urls').insertOne({
      slug,
      url,
      createdAt: new Date()
    })
    
    return res.status(200).json({
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`
    })
  } catch (err) {
    console.error('Database error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
