import { connectToDB } from '../../lib/db'
import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let parsedUrl
  try {
    parsedUrl = new URL(req.body.url)
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({ error: 'Invalid URL protocol' })
    }
  } catch (error) {
    return res.status(400).json({ error: 'Invalid URL format' })
  }

  try {
    const db = await connectToDB()
    const collection = db.collection('urls')

    // Generate collision-resistant slug
    let slug
    do {
      slug = crypto.randomBytes(6).toString('hex').slice(0, 8).toLowerCase()
    } while (await collection.findOne({ slug }))

    await collection.insertOne({
      slug,
      url: parsedUrl.href,
      created: new Date(),
      clicks: 0
    })

    res.status(200).json({ 
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`
    })
    
  } catch (error) {
    console.error('Database Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
