import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(e) {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="modern-footer" aria-label="Site footer">
      <div className="modern-footer-wrap">
        {/* Top Section: Newsletter on Left, Navigation Columns on Right */}
        <div className="modern-footer-top">
          {/* Left: Newsletter & Social */}
          <div className="modern-footer-left">
            <h3 className="modern-newsletter-heading">
              Join our newsletter to stay up to date on the latest news and updates.
            </h3>

            {subscribed ? (
              <div className="modern-subscribe-success" role="status">
                <Check size={18} />
                <span>Thank you. You are subscribed to updates.</span>
              </div>
            ) : (
              <form className="modern-subscribe-pill" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  aria-label="Enter your email address"
                  required
                />
                <button type="submit">Subscribe</button>
              </form>
            )}

            <p className="modern-subscribe-disclaimer">
              By subscribing, you agree to our <Link to="/privacy-policy">Privacy Policy</Link> and consent to receive updates from us.
            </p>

            {/* Social Icons Row */}
            <div className="modern-social-row" aria-label="Social links">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="modern-social-circle">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="modern-social-circle">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="modern-social-circle">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="modern-social-circle">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right: 3 Nav Columns */}
          <div className="modern-footer-nav">
            {/* Column 1: Sitemap */}
            <div className="modern-nav-column">
              <h4>Sitemap</h4>
              <ul>
                <li><Link to="/about-us">About Us</Link></li>
                <li><Link to="/about-us/founders">Founders</Link></li>
                <li><Link to="/projects">Projects</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            {/* Column 2: Partners / Ventures */}
            <div className="modern-nav-column">
              <h4>Ventures</h4>
              <ul>
                <li><Link to="/projects" className="is-accent">Bothra Buildtech</Link></li>
                <li><Link to="/other-businesses">Bothra International</Link></li>
                <li><Link to="/other-businesses">Bothra Tea Co.</Link></li>
                <li><Link to="/other-businesses">Bodhi School</Link></li>
              </ul>
            </div>

            {/* Column 3: Services / Works */}
            <div className="modern-nav-column">
              <h4>Services</h4>
              <ul>
                <li><Link to="/projects/ongoing">Ongoing Works</Link></li>
                <li><Link to="/projects/completed">Completed Works</Link></li>
                <li><Link to="/other-businesses">Visual Library</Link></li>
                <li><Link to="/terms-of-use">Governance</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Giant Brand Wordmark: bothra® */}
        <div className="modern-footer-brand-wrap" aria-hidden="true">
          <span className="modern-giant-wordmark">
            bothra
            <span className="modern-tm-symbol">®</span>
          </span>
        </div>

        {/* Legal & Copyright Sub-footer */}
        <div className="modern-footer-sub">
          <span>© {new Date().getFullYear()} Bothra Group. All rights reserved.</span>
          <div className="modern-sub-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <span>·</span>
            <Link to="/terms-of-use">Terms of Use</Link>
            <span>·</span>
            <a href="#top">Back to top ↑</a>
          </div>
        </div>
      </div>
    </footer>
  )
}