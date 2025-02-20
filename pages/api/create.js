import { connectToDB } from '../../lib/db'
import crypto from 'crypto'

export default async function handler(req, res) {
  // Set Vercel timeout limit (must match vercel.json)
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  
  try {
    // [Existing validation logic]
    
    const { db } = await connectToDB()
    const collection = db.collection('urls')

    // Generate slug with collision check (max 3 attempts)
    let attempts = 0
    let slug
    while(attempts < 3) {
      slug = crypto.randomBytes(5).toString('hex').slice(0,8).toLowerCase()
      const exists = await collection.findOne({ slug }, { projection: { _id: 1 } })
      if(!exists) break
      attempts++
    }

    if(attempts >= 3) throw new Error('Slug generation failed')
    
    // Force timeout if insertion takes >5s
    await Promise.race([
      collection.insertOne({ slug, url, createdAt: new Date() }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('DB insertion timeout')), 5000)
      )
    ])

    res.json({ shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}` })

  } catch(err) {
    console.error(`CREATE ERROR: ${err.message}`)
    res.status(500).json({ error: 'Shortening failed' })
  }
}
