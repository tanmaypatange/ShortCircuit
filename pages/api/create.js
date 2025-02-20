import { connectToDB } from '../../lib/db'
import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const targetUrl = new URL(req.body.url).href
  } catch {
    return res.status(400).json({ error: 'Invalid URL' })
  }

  const db = await connectToDB()
  const collection = db.collection('urls')

  let slug
  do {
    slug = crypto.randomBytes(5).toString('hex').slice(0, 8)
  } while (await collection.countDocuments({ slug }) > 0)

  try {
    await collection.insertOne({
      slug,
      url: req.body.url,
      created: new Date()
    })
    return res.json({ shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}` })
  } catch (error) {
    console.error('INSERT CRASHED:', error)
    return res.status(500).end()
  }
}
