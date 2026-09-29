import { useEffect, useState } from 'react'
import { createNote, deleteNote, fetchNotes, updateNote, type Note } from './notesApi'

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function load() {
    const data = await fetchNotes()
    setNotes(data)
  }

  useEffect(() => {
    load().catch(() => setError('Could not load notes'))
  }, [])

  async function save() {
    setLoading(true)
    setError('')
    try {
      if (!title.trim()) {
        setError('Title is required')
        return
      }
      if (editingId == null) {
        await createNote(title.trim(), content)
      } else {
        await updateNote(editingId, title.trim(), content)
      }
      setTitle('')
      setContent('')
      setEditingId(null)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  async function remove(id: number) {
    setError('')
    try {
      await deleteNote(id)
      if (editingId === id) {
        setEditingId(null)
        setTitle('')
        setContent('')
      }
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  function edit(note: Note) {
    setEditingId(note.id)
    setTitle(note.title)
    setContent(note.content)
  }

  return (
    <div className="card">
      <strong>Notes</strong>
      <p>
        <input
          aria-label="Title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </p>
      <p>
        <textarea
          aria-label="Content"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </p>
      <p>
        <button onClick={save} disabled={loading}>
          {editingId == null ? 'Add note' : 'Save note'}
        </button>
        {editingId != null && (
          <button
            onClick={() => {
              setEditingId(null)
              setTitle('')
              setContent('')
            }}
          >
            Cancel
          </button>
        )}
      </p>
      {error && <p className="status">{error}</p>}
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <strong>{note.title}</strong>
            {note.content ? ` — ${note.content}` : ''}
            <button onClick={() => edit(note)}>Edit</button>
            <button onClick={() => remove(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
