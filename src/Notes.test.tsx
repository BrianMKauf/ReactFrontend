import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Notes from './Notes'

function jsonResponse(data: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  })
}

describe('Notes', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string, init?: RequestInit) => {
        const method = init?.method ?? 'GET'
        if (url.endsWith('/api/notes') && method === 'GET') {
          return jsonResponse([{ id: 1, title: 'First', content: 'Hello' }])
        }
        if (url.endsWith('/api/notes') && method === 'POST') {
          const body = JSON.parse(String(init?.body))
          return jsonResponse({ id: 2, title: body.title, content: body.content }, 201)
        }
        if (url.includes('/api/notes/1') && method === 'PUT') {
          const body = JSON.parse(String(init?.body))
          return jsonResponse({ id: 1, title: body.title, content: body.content })
        }
        if (url.includes('/api/notes/1') && method === 'DELETE') {
          return Promise.resolve({ ok: true, status: 204, json: () => Promise.resolve(null) })
        }
        return jsonResponse({}, 404)
      }),
    )
  })

  it('lists notes from the API', async () => {
    render(<Notes />)
    expect(await screen.findByText(/First/)).toBeTruthy()
    expect(screen.getByText(/Hello/)).toBeTruthy()
  })

  it('requires a title before create', async () => {
    render(<Notes />)
    await screen.findByText(/First/)
    fireEvent.click(screen.getByText('Add note'))
    expect(await screen.findByText('Title is required')).toBeTruthy()
  })

  it('creates a note', async () => {
    const fetchMock = fetch as unknown as ReturnType<typeof vi.fn>
    render(<Notes />)
    await screen.findByText(/First/)
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Second' } })
    fireEvent.change(screen.getByLabelText('Content'), { target: { value: 'More' } })
    fireEvent.click(screen.getByText('Add note'))
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/notes'),
        expect.objectContaining({ method: 'POST' }),
      )
    })
  })
})
