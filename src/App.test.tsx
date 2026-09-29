import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.stubGlobal(
  'fetch',
  vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ status: 'ok', service: 'SpringBootBackend' }),
    }),
  ),
)

describe('App', () => {
  it('renders the title', () => {
    render(<App />)
    expect(screen.getByText('Spring + React')).toBeTruthy()
  })
})
