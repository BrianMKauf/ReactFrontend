import { useEffect, useState } from 'react'
import { apiUrl } from './api'
import Notes from './Notes'

export default function App() {
  const [health, setHealth] = useState('checking...')

  useEffect(() => {
    fetch(apiUrl('/api/health'))
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => setHealth(`${data.status} · ${data.service}`))
      .catch(() => setHealth('backend not reachable'))
  }, [])

  return (
    <div className="page">
      <h1>Spring + React</h1>
      <p className="sub">Kotlin Spring Boot API with a React frontend.</p>
      <div className="card">
        <strong>API health</strong>
        <p className="status">{health}</p>
      </div>
      <Notes />
    </div>
  )
}
