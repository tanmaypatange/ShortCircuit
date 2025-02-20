import { connectToDB } from '../lib/db'

export default function SlugRedirect() {
  return null // React component placeholder
}

export async function getServerSideProps(context) {
  const { slug } = context.params
  const { db } = await connectToDB()

  // Case-insensitive search with hexadecimal validation
  const urlDoc = await db.collection('urls').findOne({ 
    $or: [
      { slug: slug.toLowerCase() },
      { slug: { $regex: new RegExp(`^${slug}$`, 'i') }}
    ]
  })

  if (!urlDoc) {
    return { notFound: true } // Returns 404 if not found
  }

  return {
    redirect: {
      permanent: false,
      destination: urlDoc.url
    }
  }
}
