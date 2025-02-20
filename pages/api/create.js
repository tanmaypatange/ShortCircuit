import { connectToDB } from '../../lib/db'
import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Enhanced URL Validation
  let parsedUrl;
  try {
    parsedUrl = new URL(req.body.url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({ error: 'Only HTTP/HTTPS URLs allowed' });
    }
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  const db = await connectToDB()
  const collection = db.collection('urls')

  // Guaranteed-unique slug generation
  let slug;
  do {
    slug = crypto.randomBytes(6).toString('hex').slice(0, 8).toLowerCase();
  } while (await collection.countDocuments({ slug }) > 0);

  try {
    // Store normalized URL with full protocol
    await collection.insertOne({
      slug,
      url: parsedUrl.href, // Storing validated URL
      created: new Date(),
      clicks: 0
    });
    
    // Return HTTPS version even if original was HTTP
    return res.json({
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`
    });
    
  } catch (error) {
    console.error('Database Insert Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
