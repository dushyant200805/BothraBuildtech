import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PageHero from './PageHero.jsx'

describe('PageHero', () => {
  it('renders eyebrow, title, description and illustrative caption with scroll animation wrappers', () => {
    const { container } = render(
      <PageHero
        eyebrow="Our Story"
        title="Building with clarity."
        description="A considered beginning for Bothra Buildtech."
        image="/test-hero.jpg"
      />
    )

    expect(screen.getByText('Our Story')).toBeInTheDocument()
    expect(screen.getByText('Building with clarity.')).toBeInTheDocument()
    expect(screen.getByText('A considered beginning for Bothra Buildtech.')).toBeInTheDocument()
    expect(screen.getByText('Illustrative image')).toBeInTheDocument()

    // Media & animated elements
    const mediaContainer = container.querySelector('.page-hero__media')
    expect(mediaContainer).toBeInTheDocument()

    const bgImage = container.querySelector('.page-hero__bg-image')
    expect(bgImage).toBeInTheDocument()
    expect(bgImage).toHaveStyle({ backgroundImage: 'url(/test-hero.jpg)' })

    const content = container.querySelector('.page-hero__content')
    expect(content).toBeInTheDocument()

    const bottomFeather = container.querySelector('.page-hero__bottom-feather')
    expect(bottomFeather).toBeInTheDocument()
  })

  it('supports compact size modifier', () => {
    const { container } = render(
      <PageHero
        eyebrow="Business Directory"
        title="Distinct identities."
        size="compact"
      />
    )

    const hero = container.querySelector('.page-hero')
    expect(hero).toHaveClass('page-hero--compact')
  })
})
