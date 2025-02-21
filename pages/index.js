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
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: originalUrl })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to shorten URL')
      }

      const data = await response.json()
      setShortUrl(data.shortUrl)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Auto-Shorten URLs</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="Enter long URL"
          required
          autoFocus
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Create Short URL'}
        </button>

        {error && <div className="error">{error}</div>}

        {shortUrl && (
          <div className="result">
            <input
              type="text"
              value={shortUrl}
              readOnly
              onClick={(e) => {
                e.target.select()
                navigator.clipboard.writeText(shortUrl)
              }}
            />
          </div>
        )}
      </form>
    </div>
  )
}
