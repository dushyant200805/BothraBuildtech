import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { ArrowUp } from 'lucide-react'
import { usePageTransition } from '../../context/usePageTransition.js'
import Header from './Header.jsx'
import FullscreenMenu from './FullscreenMenu.jsx'
import Footer from './Footer.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function SiteLayout({ children }) {
  const { startTransition, completeTransition } = usePageTransition()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const location = useLocation()
  const lenisRef = useRef(null)
  const pageWipeRef = useRef(null)
  const completedPathnameRef = useRef(null)
  const isInitialRouteRef = useRef(true)

  // Configure manual scroll restoration to prevent native browser scroll snapping on refresh
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  // Save scroll position before reload so we can smoothly scroll on refresh
  useEffect(() => {
    function handleBeforeUnload() {
      sessionStorage.setItem('bothra_refresh_scroll_y', String(window.scrollY))
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  useLayoutEffect(() => {
    if (completedPathnameRef.current === location.pathname) {
      return undefined
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      completedPathnameRef.current = location.pathname
      completeTransition()
      return undefined
    }

    const panels = pageWipeRef.current?.querySelectorAll('.page-transition__panel')
    if (!panels?.length) {
      completedPathnameRef.current = location.pathname
      completeTransition()
      return undefined
    }

    startTransition()

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        onComplete: () => {
          completedPathnameRef.current = location.pathname
          completeTransition()
        },
      })

      timeline
        .set(pageWipeRef.current, { visibility: 'visible' })
        .set(panels, { yPercent: -105 })
        .to(panels, {
          yPercent: 0,
          duration: 0.38,
          stagger: 0.075,
          ease: 'power4.inOut',
        })
        .to(panels, {
          yPercent: 105,
          duration: 0.45,
          stagger: { each: 0.075, from: 'end' },
          ease: 'power4.inOut',
        }, '+=0.06')
        .set(pageWipeRef.current, { visibility: 'hidden' })
    }, pageWipeRef)

    return () => {
      ctx.revert()
    }
  }, [location.pathname, startTransition, completeTransition])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.05,
    })
    lenisRef.current = lenis

    const update = (time) => lenis.raf(time * 1000)
    const updateScrollTrigger = () => ScrollTrigger.update()
    lenis.on('scroll', updateScrollTrigger)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    // Smooth scroll on page refresh
    const isPageReload = (() => {
      try {
        const navEntries = performance.getEntriesByType?.('navigation')
        if (navEntries && navEntries.length > 0) {
          return navEntries[0].type === 'reload'
        }
        return performance.navigation?.type === 1
      } catch {
        return false
      }
    })()

    let savedScrollY = 0
    try {
      const stored = sessionStorage.getItem('bothra_refresh_scroll_y')
      if (stored) {
        savedScrollY = parseFloat(stored)
        sessionStorage.removeItem('bothra_refresh_scroll_y')
      }
    } catch {
      // Ignore storage access errors
    }

    if (isPageReload && (savedScrollY > 10 || window.scrollY > 10)) {
      const initialScrollY = savedScrollY > 10 ? savedScrollY : window.scrollY
      lenis.setScroll(initialScrollY)
      window.scrollTo(0, initialScrollY)
      requestAnimationFrame(() => {
        lenis.scrollTo(0, {
          duration: 1.2,
          easing: (t) => 1 - Math.pow(1 - t, 4),
          force: true,
        })
      })
    }

    return () => {
      lenis.off('scroll', updateScrollTrigger)
      gsap.ticker.remove(update)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    function updateVisibility() {
      const nearFooter = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 60
      setShowBackToTop(window.scrollY > 300 && !nearFooter)
    }

    const lenis = lenisRef.current
    if (lenis) lenis.on('scroll', updateVisibility)
    window.addEventListener('scroll', updateVisibility, { passive: true })
    window.addEventListener('resize', updateVisibility)
    updateVisibility()

    return () => {
      if (lenis) lenis.off('scroll', updateVisibility)
      window.removeEventListener('scroll', updateVisibility)
      window.removeEventListener('resize', updateVisibility)
    }
  }, [])

  useEffect(() => {
    if (isInitialRouteRef.current) {
      isInitialRouteRef.current = false
    } else {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reducedMotion) {
        window.scrollTo({ top: 0, behavior: 'instant' })
      } else if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true })
        window.scrollTo({ top: 0, behavior: 'instant' })
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    }
    const pageMetadata = {
      '/': ['Bothra Buildtech | Building spaces. Shaping tomorrow.', 'A construction and real-estate development brand. Company details and projects are being verified.'],
      '/about-us': ['About Us | Bothra Buildtech', 'Learn about Bothra Buildtech. Company history, capabilities, vision and mission are pending approval.'],
      '/about-us/founders': ['Founders | Bothra Buildtech', 'Founder identities and biographies will be published after verification and approval.'],
      '/projects': ['Projects | Bothra Buildtech', 'Browse the Bothra Buildtech project directory. Verified project information is pending publication.'],
      '/projects/completed': ['Completed Projects | Bothra Buildtech', 'Browse completed Bothra Buildtech projects. Project records are pending verification.'],
      '/projects/ongoing': ['Ongoing Projects | Bothra Buildtech', 'Browse ongoing Bothra Buildtech projects. Project records are pending verification.'],
      '/projects/upcoming': ['Upcoming Projects | Bothra Buildtech', 'Browse upcoming Bothra Buildtech projects. Project records are pending verification.'],
      '/other-businesses': ['Other Businesses | Bothra Buildtech', 'Browse business references supplied for review. Company affiliations are pending confirmation.'],
      '/contact': ['Contact | Bothra Buildtech', 'Prepare a project or company inquiry for Bothra Buildtech using the frontend email fallback.'],
      '/privacy-policy': ['Privacy Policy | Bothra Buildtech', 'Privacy information for the Bothra Buildtech frontend. Final legal content is pending review.'],
      '/terms-of-use': ['Terms of Use | Bothra Buildtech', 'Terms of use for the Bothra Buildtech website. Final legal content is pending review.'],
    }
    const [title, description] = pageMetadata[location.pathname] || (location.pathname.startsWith('/projects/') ? ['Project Details | Bothra Buildtech', 'Project information is pending verification.'] : ['Page Not Found | Bothra Buildtech', 'The requested page could not be found.'])
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
  }, [location.pathname])

  useEffect(() => {
    function handleAnchorClick(event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (!(event.target instanceof Element)) return
      const link = event.target.closest('a[href^="#"]')
      if (!link) return
      const target = document.querySelector(link.getAttribute('href'))
      if (!target) return

      event.preventDefault()
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reducedMotion) {
        target.scrollIntoView({ behavior: 'instant', block: 'start' })
        return
      }

      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, { duration: .9, easing: (progress) => 1 - Math.pow(1 - progress, 4), force: true })
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    document.addEventListener('click', handleAnchorClick)
    return () => document.removeEventListener('click', handleAnchorClick)
  }, [])

  function handleBackToTop() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    } else if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: .8, easing: (progress) => 1 - Math.pow(1 - progress, 4), force: true })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return <>
    <div id="top" />
    <Header onMenuOpen={() => setMenuOpen(true)} />
    <FullscreenMenu open={menuOpen} onClose={closeMenu} />
    <main>{children}</main>
    <Footer />
    <div className="page-transition" ref={pageWipeRef} aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <span className="page-transition__panel" key={index} />
      ))}
    </div>
    <button className={`back-to-top-float ${showBackToTop ? 'is-visible' : ''}`.trim()} type="button" aria-label="Back to top" aria-hidden={!showBackToTop} tabIndex={showBackToTop ? 0 : -1} onClick={handleBackToTop}>
      <ArrowUp size={19} aria-hidden="true" />
    </button>
  </>
}