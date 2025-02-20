import { useState } from 'react'

export default function Home() {
  const [slug, setSlug] = useState('')
  const [url, setUrl] = useState('')
  const [shortenedUrl, setShortenedUrl] = useState('')
  const [error, setError] = useState('')

  // Keep existing handleSubmit and state logic unchanged

  return (
    <div className="container">
      <h1>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
          <path d="M10 13l5 5m0 0l5-5m-5 5V6"/>
        </svg>
        URL Shortener
      </h1>
      
      <form onSubmit={handleSubmit}>
        {/* Existing input group code */}
      </form>

      {shortenedUrl && (
        <div className="result">
          <p>Your short URL:</p>
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
