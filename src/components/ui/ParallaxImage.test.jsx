import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ParallaxImage from './ParallaxImage.jsx'

describe('ParallaxImage', () => {
  it('renders image within an overflow-hidden container with correct attributes', () => {
    const { container } = render(
      <ParallaxImage
        src="/test-image.jpg"
        alt="Test Architecture"
        className="custom-frame"
      />
    )

    const wrapper = container.querySelector('.parallax-image-container')
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveClass('custom-frame')
    expect(wrapper).toHaveStyle({ overflow: 'hidden', position: 'relative' })

    const image = screen.getByRole('img', { name: 'Test Architecture' })
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/test-image.jpg')
    expect(image).toHaveClass('parallax-image-media')
  })

  it('renders children like captions in foreground relative layer', () => {
    render(
      <ParallaxImage src="/test-image.jpg" alt="Captioned Architecture">
        <span className="image-caption">LUXURY SPACES</span>
      </ParallaxImage>
    )

    expect(screen.getByText('LUXURY SPACES')).toBeInTheDocument()
  })
})
