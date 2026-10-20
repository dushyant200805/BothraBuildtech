import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ImageGallery from './ImageGallery.jsx'

describe('ImageGallery', () => {
  it('shows all local visual references by default', () => {
    render(<ImageGallery />)
    expect(screen.getAllByRole('img')).toHaveLength(19)
    expect(screen.getByText(/No project, location, company affiliation, or ownership is implied/)).toBeInTheDocument()
  })

  it('filters images by subject category', () => {
    render(<ImageGallery />)
    fireEvent.click(screen.getByRole('button', { name: 'Education' }))
    expect(screen.getAllByRole('img')).toHaveLength(4)
    expect(screen.getByRole('button', { name: 'Education' })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Tea & gardens' }))
    expect(screen.getAllByRole('img')).toHaveLength(5)
  })
})