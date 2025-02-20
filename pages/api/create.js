import { connectToDB } from '../../lib/db'
import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Full URL validation
  let parsedUrl
  try {
    parsedUrl = new URL(req.body.url)
    
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({ error: 'Invalid protocol' })
    }
  } catch (error) {
    return res.status(400).json({ error: 'Invalid URL' })
  }

  const db = await connectToDB()
  const collection = db.collection('urls')

  // Generate guaranteed unique slug
  let slug
  do {
    slug = crypto.randomBytes(6).toString('hex').slice(0, 8).toLowerCase()
  } while (await collection.countDocuments({ slug }) > 0)

  try {
    // Store normalized URL
    await collection.insertOne({
      slug,
      url: parsedUrl.href, // Store FULL normalized URL
      created: new Date(),
      clicks: 0
    })
    return res.json({ 
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`
    })
  } catch (error) {
    console.error('DB WRITE FAILED:', error)
    return res.status(500).json({ error: 'Database error' })
  }
}
