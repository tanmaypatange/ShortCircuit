import { useState } from 'react'

export default function Home() {
  const [slug, setSlug] = useState('')
  const [url, setUrl] = useState('')
  const [shortenedUrl, setShortenedUrl] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!slug || !url) {
      setError('Both fields are required')
      return
    }

    try {
      const response = await fetch('/api/urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, url })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create short URL')
      }

      const data = await response.json()
      setShortenedUrl(`${window.location.origin}/${data.slug}`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>
          <span className="logo-gradient">Short.ly</span>
          <span className="beta-badge">BETA</span>
        </h1>
        <p className="tagline">Modern URL Shortening for the Web</p>
      </header>

      <form onSubmit={handleSubmit} className="form-card">
        <div className="input-group">
          <label>Custom Path</label>
          <input
            type="text"
            placeholder="your-custom-path"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <span className="input-hint">Letters, numbers, and hyphens only</span>
        </div>

        <div className="input-group">
          <label>Destination URL</label>
          <input
            type="url"
            placeholder="https://your-long-url.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        {error && <div className="error-card">{error}</div>}

        <button type="submit" className="cta-button">
          Create Short URL
        </button>
      </form>

      {shortenedUrl && (
        <div className="result-card">
          <div className="success-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41L9 16.17z"/>
            </svg>
            <h3>Your Short URL is Ready!</h3>
          </div>
          <div className="url-container">
            <input
              type="text"
              value={shortenedUrl}
              readOnly
              onClick={(e) => e.target.select()}
            />
            <button 
              className="copy-button"
              onClick={() => {
                navigator.clipboard.writeText(shortenedUrl)
                // Visual feedback
                const btn = document.querySelector('.copy-button')
                btn.textContent = '✓ Copied!'
                setTimeout(() => btn.textContent = 'Copy', 2000)
              }}
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
