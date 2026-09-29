import { useEffect, useState } from 'react'
import { apiUrl } from './api'

export default function App() {
  const [health, setHealth] = useState('checking...')
  const [name, setName] = useState('Brian')
  const [greeting, setGreeting] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(apiUrl('/api/health'))
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => setHealth(`${data.status} · ${data.service}`))
      .catch(() => setHealth('backend not reachable'))
  }, [])

  async function sayHello() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(apiUrl(`/api/hello?name=${encodeURIComponent(name)}`))
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setGreeting(data.message)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <h1>Spring + React</h1>
      <p className="sub">Kotlin Spring Boot API with a React frontend.</p>
      <div className="card">
        <strong>API health</strong>
        <p className="status">{health}</p>
      </div>
      <div className="card">
        <strong>Call /api/hello</strong>
        <p>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <button onClick={sayHello} disabled={loading}>
            {loading ? 'Calling...' : 'Greet'}
          </button>
        </p>
        {greeting && <p>{greeting}</p>}
        {error && <p className="status">{error}</p>}
      </div>
    </div>
  )
}
