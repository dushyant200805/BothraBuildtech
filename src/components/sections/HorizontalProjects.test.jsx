import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import HorizontalProjects from './HorizontalProjects.jsx'

const mockProjects = [
  {
    slug: 'test-tower',
    name: 'Test Horizon Tower',
    status: 'Completed',
    category: 'Commercial',
    location: 'Jaipur',
    image: '/test-tower.jpg',
    year: '2024',
    area: '400,000 sq.ft.',
    tagline: 'Grade-A Corporate Landmark',
    description: 'A premier architectural tower combining sustainability and design.',
    features: ['LEED Gold efficiency', 'Automation'],
  },
  {
    slug: 'test-villas',
    name: 'Test Sky Villas',
    status: 'Completed',
    category: 'Residential',
    location: 'Jodhpur',
    image: '/test-villas.jpg',
    year: '2025',
    area: '300,000 sq.ft.',
    tagline: 'Ultra-Luxury High-Rise',
    description: 'Exclusive residential sanctuary with panoramic views.',
    features: ['Double-height living', 'Infinity pool'],
  },
]

describe('HorizontalProjects', () => {
  it('renders section title, subtitle, eyebrow, and project cards', () => {
    render(
      <MemoryRouter>
        <HorizontalProjects
          projects={mockProjects}
          sectionTitle="Completed Developments"
          sectionSubtitle="Verified projects delivered with precision."
          category="Completed"
          eyebrow="Delivered Portfolio"
        />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 2, name: 'Completed Developments' })).toBeInTheDocument()
    expect(screen.getByText('Verified projects delivered with precision.')).toBeInTheDocument()
    expect(screen.getByText('Delivered Portfolio')).toBeInTheDocument()
    expect(screen.getByText('2 Projects')).toBeInTheDocument()

    // Project cards
    expect(screen.getByRole('heading', { level: 3, name: 'Test Horizon Tower' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Test Sky Villas' })).toBeInTheDocument()
    expect(screen.getByText('Jaipur')).toBeInTheDocument()
    expect(screen.getByText('Jodhpur')).toBeInTheDocument()

    // CTAs
    expect(screen.getByRole('link', { name: 'View Test Horizon Tower' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View Test Sky Villas' })).toBeInTheDocument()

    // Outro card
    expect(screen.getByText('Built with intention, delivered with precision.')).toBeInTheDocument()
  })

  it('renders safely when no projects are passed', () => {
    const { container } = render(
      <MemoryRouter>
        <HorizontalProjects projects={[]} />
      </MemoryRouter>
    )

    expect(container.firstChild).toHaveStyle({ display: 'none' })
  })
})
