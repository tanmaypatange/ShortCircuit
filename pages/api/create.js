import { connectToDB } from '../../lib/db'
import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Validate URL
  let targetUrl
  try {
    targetUrl = new URL(req.body.url)
    if (!['http:', 'https:'].includes(targetUrl.protocol)) {
      return res.status(400).json({ error: 'Invalid protocol' })
    }
  } catch {
    return res.status(400).json({ error: 'Malformed URL' })
  }

  const db = await connectToDB()
  const collection = db.collection('urls')

  // Nuclear-grade slug generation
  let slug
  do {
    slug = crypto.randomBytes(6).toString('hex').slice(0, 8).toLowerCase()
  } while (await collection.countDocuments({ slug }) > 0)

  try {
    await collection.insertOne({
      slug,
      url: targetUrl.href, // Store normalized URL
      created: new Date(),
      clicks: 0
    })
    return res.json({
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`
    })
  } catch (error) {
    console.error('Critical DB Failure:', error)
    return res.status(500).json({ error: 'Database write failed' })
  }
}
