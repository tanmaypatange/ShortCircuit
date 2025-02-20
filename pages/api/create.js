import { connectToDB } from '../../lib/db'
import crypto from 'crypto'

export default async function handler(req, res) {
  try {
    // 1. Validate request
    if (req.method !== 'POST') return res.status(405).end()
    if (!req.body?.url) return res.status(400).json({ error: 'Missing URL' })
    
    // 2. Generate UNIQUE slug (new collision-free method)
    const db = await connectToDB()
    let slug
    while(true) {
      slug = crypto.randomBytes(6).toString('hex').slice(0, 8).toLowerCase()
      const exists = await db.collection('urls').countDocuments({ slug }, { limit: 1 })
      if (!exists) break
    }

    // 3. Insert with atomic write concern
    const result = await db.collection('urls').insertOne({
      slug,
      url: req.body.url,
      createdAt: new Date()
    }, { w: 'majority' })

    if (!result.acknowledged) throw new Error('Write failed')

    return res.status(200).json({
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`
    })

  } catch (error) {
    console.error(`NUCLEAR FAILURE: ${error.message}`)
    return res.status(500).json({ error: 'System collapse - try again' })
  }
}
