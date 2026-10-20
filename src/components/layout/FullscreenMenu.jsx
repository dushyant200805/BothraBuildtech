import { useEffect, useRef } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { useTheme } from '../../context/useTheme.js'

const links = [
  ['01', 'Home', '/'],
  ['02', 'About us', '/about-us'],
  ['03', 'Projects', '/projects'],
  ['04', 'Other businesses', '/other-businesses'],
  ['05', 'Contact', '/contact'],
]

export default function FullscreenMenu({ open, onClose }) {
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const previousFocus = useRef(null)
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return undefined
    if (open) {
      previousFocus.current = document.activeElement
      document.body.style.overflow = 'hidden'
      closeRef.current?.focus()
      const context = gsap.context(() => {
        gsap.fromTo('.menu-item', { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: .55, stagger: .07, delay: .16, ease: 'power3.out' })
      }, panel)
      return () => context.revert()
    }
    document.body.style.overflow = ''
    if (previousFocus.current instanceof HTMLElement) previousFocus.current.focus()
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    function handleKey(event) {
      if (!open) return
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab') {
        const focusable = panelRef.current?.querySelectorAll('a[href], button:not([disabled])')
        const first = focusable?.[0]
        const last = focusable?.[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  return <div className={`menu-overlay ${open ? 'is-open' : ''}`} aria-hidden={!open}>
    <div className="menu-panel" ref={panelRef} inert={!open} data-lenis-prevent>
      <div className="menu-panel-top"><Link className="wordmark wordmark--light" to="/" onClick={onClose}><span className="wordmark-mark">B</span><span>BOTHRA <b>BUILDTECH</b></span></Link><button ref={closeRef} className="icon-button menu-close" onClick={onClose} aria-label="Close navigation"><X size={22} /></button></div>
      <div className="menu-panel-content">
        <nav className="menu-list" aria-label="Full-screen navigation">{links.map(([number, label, to]) => <Link className="menu-item" key={number} to={to} onClick={onClose} aria-current={location.pathname === to ? 'page' : undefined}><span>{number}</span><b>{label}</b><ArrowUpRight size={22} /></Link>)}</nav>
        <aside className="menu-aside"><span className="eyebrow">Bothra Buildtech</span><p>Building spaces.<br />Shaping tomorrow.</p><div className="menu-aside-bottom"><button className="text-link theme-inline" type="button" onClick={toggleTheme}>{theme === 'light' ? 'Dark presentation' : 'Light presentation'} <ArrowUpRight size={15} /></button><Link className="text-link" to="/contact" onClick={onClose}>Start a conversation <ArrowUpRight size={15} /></Link><small>Company details and project information are being verified.</small></div></aside>
      </div>
      <div className="menu-panel-foot"><span>COMPANY INFORMATION PENDING APPROVAL.</span><span>BOTHRA BUILDTECH</span></div>
    </div>
  </div>
}