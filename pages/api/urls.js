import { connectToDB } from '../../utils/mongodb'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { slug, url } = req.body

  // Enhanced validation
  if (!slug || !url) {
    return res.status(400).json({ error: 'Both fields are required' })
  }

  if (!/^[a-zA-Z0-9-]+$/.test(slug)) {
    return res.status(400).json({ 
      error: 'Slug can only contain letters, numbers, and hyphens'
    })
  }

  const { db } = await connectToDB()

  try {
    const existingEntry = await db.collection('mappings').findOne({ slug })
    if (existingEntry) {
      return res.status(400).json({ error: 'This path is already taken' })
    }

    await db.collection('mappings').insertOne({
      slug,
      url: url.includes('://') ? url : `https://${url}`,
      createdAt: new Date()
    })

    return res.status(201).json({ success: true, slug })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}