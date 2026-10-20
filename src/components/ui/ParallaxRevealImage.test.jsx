import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ParallaxRevealImage from './ParallaxRevealImage.jsx'
import ParallaxImage from './ParallaxImage.jsx'

describe('ParallaxRevealImage', () => {
  it('renders image within an overflow-hidden container with reveal and parallax inner wrappers', () => {
    const { container } = render(
      <ParallaxRevealImage
        src="/test-image.jpg"
        alt="Contemporary Architecture"
        className="custom-reveal-frame"
      />
    )

    const outerContainer = container.querySelector('.parallax-reveal-container')
    expect(outerContainer).toBeInTheDocument()
    expect(outerContainer).toHaveClass('custom-reveal-frame')
    expect(outerContainer).toHaveStyle({ overflow: 'hidden', position: 'relative' })

    const innerWrapper = container.querySelector('.parallax-reveal-inner')
    expect(innerWrapper).toBeInTheDocument()

    const image = screen.getByRole('img', { name: 'Contemporary Architecture' })
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/test-image.jpg')
    expect(image).toHaveClass('parallax-reveal-image')
  })

  it('renders children (e.g. captions) cleanly in the relative foreground layer', () => {
    render(
      <ParallaxRevealImage src="/test-image.jpg" alt="Showcase with caption">
        <span className="image-caption">CURATED SPACES</span>
      </ParallaxRevealImage>
    )

    expect(screen.getByText('CURATED SPACES')).toBeInTheDocument()
  })

  it('supports ParallaxImage backward compatibility alias', () => {
    const { container } = render(
      <ParallaxImage
        src="/test-legacy.jpg"
        alt="Legacy Architecture"
        className="legacy-frame"
        offset={60}
      />
    )

    const outerContainer = container.querySelector('.parallax-image-container')
    expect(outerContainer).toBeInTheDocument()
    expect(outerContainer).toHaveClass('legacy-frame')
    expect(screen.getByRole('img', { name: 'Legacy Architecture' })).toBeInTheDocument()
  })
})
