import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Menu, Moon, Sun, X } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/useTheme.js'

const menus = {
  'About Us': [
    ['/about-us', 'Our story', 'An introduction to Bothra Buildtech'],
    ['/about-us/founders', 'Founders', 'Leadership information pending verification'],
  ],
}

export default function Header({ onMenuOpen }) {
  const [openMenu, setOpenMenu] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  const navRef = useRef(null)

  function isCurrentSection(label) {
    if (label === 'About Us') return pathname === '/about-us' || pathname.startsWith('/about-us/founders')
    return false
  }

  function closeMegaMenu() {
    setOpenMenu('')
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    function handleKeys(event) {
      if (event.key === 'Escape') setOpenMenu('')
      if (event.key === 'ArrowDown' && openMenu) {
        event.preventDefault()
        navRef.current?.querySelector('.mega-menu a')?.focus()
      }
    }
    document.addEventListener('keydown', handleKeys)
    return () => document.removeEventListener('keydown', handleKeys)
  }, [openMenu])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header-inner wrap" ref={navRef}>
        <Link className="wordmark" to="/" aria-label="Bothra Buildtech home" onMouseEnter={closeMegaMenu} onFocus={closeMegaMenu}>
          <span className="wordmark-mark" aria-hidden="true">B</span>
          <span>BOTHRA <b>BUILDTECH</b></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <NavLink to="/" end onClick={closeMegaMenu} onMouseEnter={closeMegaMenu} onFocus={closeMegaMenu}>Home</NavLink>
          {Object.keys(menus).map((label) => (
            <button key={label} className={`${openMenu === label ? 'active' : ''} ${isCurrentSection(label) ? 'is-current' : ''}`.trim()} type="button" aria-current={isCurrentSection(label) ? 'page' : undefined} aria-expanded={openMenu === label} aria-haspopup="true" onClick={() => setOpenMenu(label)} onMouseEnter={() => setOpenMenu(label)}>
              {label}
            </button>
          ))}
          <NavLink to="/projects" className={({ isActive }) => `${isActive || pathname.startsWith('/projects') ? 'is-current' : ''}`.trim()} aria-current={pathname.startsWith('/projects') ? 'page' : undefined} onClick={closeMegaMenu} onMouseEnter={closeMegaMenu} onFocus={closeMegaMenu}>Projects</NavLink>
          <NavLink to="/other-businesses" className={({ isActive }) => `${isActive ? 'is-current' : ''}`.trim()} onClick={closeMegaMenu} onMouseEnter={closeMegaMenu} onFocus={closeMegaMenu}>Other Businesses</NavLink>
          <NavLink to="/contact" onClick={closeMegaMenu} onMouseEnter={closeMegaMenu} onFocus={closeMegaMenu}>Contact</NavLink>
        </nav>
        <div className="header-actions">
          <button className="icon-button theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          <button className="icon-button menu-trigger" type="button" onClick={onMenuOpen} aria-label="Open navigation"><Menu size={21} /></button>
        </div>
        {openMenu && <div className="mega-menu" role="region" aria-label={`${openMenu} menu`} onMouseLeave={() => setOpenMenu('')}>
          <div className="mega-intro"><span className="eyebrow">Navigate</span><h2>{openMenu}</h2><p>Explore more about Bothra Buildtech.</p></div>
          <div className="mega-links">{menus[openMenu].map(([to, title, description]) => <Link key={to} to={to} onClick={() => setOpenMenu('')}><span><b>{title}</b><small>{description}</small></span><ArrowRight size={16} /></Link>)}</div>
          <button className="mega-close icon-button" type="button" aria-label="Close menu" onClick={() => setOpenMenu('')}><X size={17} /></button>
        </div>}
      </div>
    </header>
  )
}