import { apiUrl } from './api'

export type Note = {
  id: number
  title: string
  content: string
}

export async function fetchNotes(): Promise<Note[]> {
  const res = await fetch(apiUrl('/api/notes'))
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function createNote(title: string, content: string): Promise<Note> {
  const res = await fetch(apiUrl('/api/notes'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function updateNote(id: number, title: string, content: string): Promise<Note> {
  const res = await fetch(apiUrl(`/api/notes/${id}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function deleteNote(id: number): Promise<void> {
  const res = await fetch(apiUrl(`/api/notes/${id}`), { method: 'DELETE' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}
