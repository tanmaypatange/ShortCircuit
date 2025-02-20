import { connectToDB } from '../../lib/db'
import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Validate URL format
    new URL(req.body.url)
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL' })
  }

  const db = await connectToDB()
  const collection = db.collection('urls')

  let slug
  let attempts = 0
  do {
    slug = crypto.randomBytes(6).toString('hex').slice(0, 8)
  } while (await collection.findOne({ slug }) && ++attempts < 5)

  if (attempts >= 5) {
    return res.status(500).json({ error: 'Failed to generate unique path' })
  }

  try {
    await collection.insertOne({
      slug,
      url: req.body.url,
      createdAt: new Date()
    })
    return res.json({
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`
    })
  } catch (err) {
    console.error('Insert error:', err)
    return res.status(500).json({ error: 'Database write failed' })
  }
}
