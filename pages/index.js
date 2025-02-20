import { useState } from 'react'

export default function Home() {
  const [slug, setSlug] = useState('')
  const [url, setUrl] = useState('')
  const [shortenedUrl, setShortenedUrl] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Input validation
    if (!slug || !url) {
      setError('Short Path and Long URL are required.')
      return
    }

    try {
      const response = await fetch('/api/urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, url }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to create URL')

      // Display generated URL on page
      setShortenedUrl(`${window.location.origin}/${data.slug}`)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Short Path</label>
          <input
            type="text"
            placeholder="e.g., 'github'"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Long URL</label>
          <input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="submit-btn">Create Short URL</button>
      </form>

      {shortenedUrl && (
        <div className="result">
          <p>Shortened URL:</p>
          <div className="url-display">
            <input
              type="text"
              value={shortenedUrl}
              readOnly
              onClick={(e) => e.target.select()}
            />
            <button
              onClick={() => navigator.clipboard.writeText(shortenedUrl)}
              className="copy-btn"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
