import { connectToDB } from '../lib/db'

export default function SlugRedirect() {
  return null
}

export async function getServerSideProps(context) {
  const { slug } = context.params
  const { db } = await connectToDB()

  const entry = await db.collection('urls').findOne({ slug })

  if (!entry || !entry.url) {
    return { notFound: true }
  }

  return {
    redirect: {
      destination: entry.url,
      permanent: false
    }
  }
}
