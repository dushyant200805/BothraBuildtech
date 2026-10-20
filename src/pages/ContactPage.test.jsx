import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import ContactPage from './ContactPage.jsx'

describe('ContactPage', () => {
  it('requires the essential inquiry fields before preparing an email', () => {
    const { container } = render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    )
    const form = container.querySelector('form')
    fireEvent.submit(form)
    expect(screen.getByLabelText('Name')).toBeInvalid()
    expect(screen.getByLabelText('Email')).toBeRequired()
    expect(screen.getByRole('status')).toHaveTextContent('This frontend does not submit or store your information.')
  })
})
