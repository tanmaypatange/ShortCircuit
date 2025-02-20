import { connectToDB } from '../../utils/mongodb'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { slug, url } = req.body
  
  // Validate input
  if (!slug || !url) {
    return res.status(400).json({ error: 'Both slug and URL are required' })
  }

  const { db } = await connectToDB()
  
  try {
    const existingDoc = await db.collection('mappings').findOne({ slug })
    if (existingDoc) {
      return res.status(400).json({ error: 'Slug already exists' })
    }

    await db.collection('mappings').insertOne({
      slug,
      url: url.startsWith('http') ? url : `https://${url}`,
      createdAt: new Date()
    })

    res.status(200).json({ success: true, slug })
  } catch (error) {
    console.error('API error:', error)
    res.status(500).json({ error: error.message })
  }
}
