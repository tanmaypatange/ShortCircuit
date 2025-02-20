import { connectToDB } from '../lib/db'

export default function SlugRedirect() { return null }

export async function getServerSideProps({ params }) {
  try {
    const db = await connectToDB()
    const entry = await db.collection('urls').findOne({ slug: params.slug })
    return entry?.url 
      ? { redirect: { destination: entry.url, permanent: false }}
      : { notFound: true }
  } catch (error) {
    console.error('Critical redirect failure:', error)
    return { notFound: true }
  }
}
