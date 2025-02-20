import { useState } from 'react'

export default function Home() {
  const [slug, setSlug] = useState('')
  const [url, setUrl] = useState('')

  const submit = async e => {
    e.preventDefault()
    const response = await fetch('/api/urls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, url })
    })
    if (response.ok) {
      alert(`Short URL created: ${window.location.origin}/${slug}`)
    } else {
      alert('Error creating short URL')
    }
  }

  return (
    <div style={{ margin: '2rem', fontFamily: 'Arial' }}>
      <h1>URL Shortener</h1>
      <form onSubmit={submit}>
        <input
          type="text"
          placeholder="Short path (e.g. 'github')"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          style={{ display: 'block', margin: '10px 0', padding: '8px', width: '300px' }}
        />
        <input
          type="url"
          placeholder="Long URL (https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={{ display: 'block', margin: '10px 0', padding: '8px', width: '300px' }}
        />
        <button
          type="submit"
          style={{ background: 'blue', color: 'white', padding: '10px', border: 'none' }}
        >
          Create Short URL
        </button>
      </form>
    </div>
  )
}
