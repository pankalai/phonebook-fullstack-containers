import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import App from '../src/App'
import personService from '../src/services/persons'

// Mock the service module
vi.mock('../src/services/persons')

describe('<App />', () => {

  beforeEach(() => {
    personService.getAll.mockResolvedValue([
      { id: 1, name: 'Ada Lovelace', number: '123' },
      { id: 2, name: 'Alan Turing', number: '456' },
    ])
  })

  it('fetches persons on mount and displays them', async () => {
    render(<App />)

    // persons appear asynchronously
    expect(await screen.findByText(/Ada Lovelace/)).toBeVisible()
    expect(await screen.findByText(/Alan Turing/)).toBeVisible()

    expect(personService.getAll).toHaveBeenCalledTimes(1)
  })
})
