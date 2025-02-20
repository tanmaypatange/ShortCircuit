import { connectToDB } from '../../lib/db'

export default function SlugRedirect() {
  return null
}

export async function getServerSideProps(context) {
  try {
    const { slug } = context.params
    const db = await connectToDB()
    const entry = await db.collection('urls').findOne({ slug })
    
    return entry 
      ? { redirect: { destination: entry.url, permanent: false } }
      : { notFound: true }
  } catch (error) {
    console.error('Redirect error:', error)
    return { notFound: true }
  }
}
