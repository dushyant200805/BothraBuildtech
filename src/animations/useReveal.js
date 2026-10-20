import { useEffect } from 'react'
import AOS from 'aos'

let aosInitialized = false

const revealSelectors = [
  '[data-reveal]',
  '.page-hero .wrap',
  '.directory-card',
  '.visual-card',
  '.process-item',
  '.faq-item',
  '.values-rule',
  '.vision-note',
  '.empty-state',
  '.detail-layout > *',
  '.contact-intro',
  '.contact-form > label',
  '.project-card',
].join(',')

export default function useReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    document.querySelectorAll(revealSelectors).forEach((element) => {
      if (!element.hasAttribute('data-aos')) element.setAttribute('data-aos', 'fade-up')
      element.setAttribute('data-aos-duration', '650')
    })

    if (aosInitialized) {
      AOS.refreshHard()
    } else {
      AOS.init({ duration: 650, easing: 'ease-out-cubic', once: true, offset: 70 })
      aosInitialized = true
    }

    return undefined
  }, [])
}