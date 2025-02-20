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
      const response = await fetch('/api/create', {
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
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="Enter full URL (e.g., https://example.com)"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Shorten'}
        </button>
        
        {error && <p className="error">Error: {error}</p>}
        
        {shortUrl && (
          <div className="result">
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              {shortUrl}
            </a>
          </div>
        )}
      </form>
    </div>
  )
}
