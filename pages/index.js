import { useState } from 'react'

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // CALL CORRECT ENDPOINT
      const response = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: originalUrl })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to shorten')

      setShortUrl(data.shortUrl)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /* UI CODE REMAINS SAME AS BEFORE */
}
