import { connectToDB } from '../lib/db'

export default function SlugRedirect() {
  return null
}

export async function getServerSideProps({ params }) {
  try {
    const db = await connectToDB()
    const urlData = await db.collection('urls').findOne(
      { slug: params.slug },
      { projection: { _id: 0, url: 1 } }
    )

    if (!urlData) return { notFound: true }

    return {
      redirect: {
        destination: urlData.url,
        permanent: false
      }
    }
  } catch (error) {
    console.error('REDIRECT ERROR:', error)
    return { notFound: true }
  }
}
