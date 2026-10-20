import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TestimonialMarquee from './TestimonialMarquee.jsx'
import { testimonialSamples } from '../../data/testimonials.js'

describe('TestimonialMarquee', () => {
  it('shows clearly marked demo content while approved testimonials are unavailable', () => {
    const { getByText, container } = render(<TestimonialMarquee />)
    expect(getByText(/Fictional sample content only/)).toBeInTheDocument()
    expect(container.querySelectorAll('.testimonial-card')).toHaveLength(testimonialSamples.length * 2)
    expect(container.querySelectorAll('.testimonial-sample-label')).toHaveLength(testimonialSamples.length * 2)
    expect(container.querySelectorAll('.testimonial-marquee-row .testimonial-card')).toHaveLength(testimonialSamples.length * 2)
  })

  it('does not render when there are no items', () => {
    const { container } = render(<TestimonialMarquee items={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('creates alternating lanes and duplicate tracks for supplied testimonials', () => {
    const items = [
      { name: 'Client One', role: 'Project partner', quote: 'A clear and considered process.' },
      { name: 'Client Two', role: 'Resident', quote: 'A place that feels thoughtfully made.' },
      { name: 'Client Three', role: 'Business owner', quote: 'The communication was excellent.' },
    ]
    const { container } = render(<TestimonialMarquee items={items} />)

    expect(container.querySelectorAll('.testimonial-marquee-row')).toHaveLength(2)
    expect(container.querySelector('.testimonial-marquee-row--reverse')).toBeInTheDocument()
    expect(container.querySelectorAll('.testimonial-marquee-set[aria-hidden="true"]')).toHaveLength(2)
    expect(container.querySelector('.testimonial-card cite')).toHaveTextContent('Client One')
  })
})