import { useState } from 'react'
import { CheckCircle2, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHero from '../components/ui/PageHero.jsx'
import TestimonialMarquee from '../components/sections/TestimonialMarquee.jsx'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return
    const values = new FormData(form)
    const name = values.get('name') || ''
    const email = values.get('email') || ''
    const message = values.get('message') || ''

    const subject = encodeURIComponent(`Inquiry from ${name}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)
    const mailto = `mailto:contact@bothrabuildtech.com?subject=${subject}&body=${body}`

    if (!mailto.startsWith('mailto:')) {
      setError('Could not prepare an email link. Please try again.')
      return
    }

    window.location.href = mailto
    setSubmitted(true)
    setError('')
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s start a conversation."
        description="Fill out the inquiry form below to connect with our architectural and development leadership."
        image="/architecture-curved-white-facade.jpg"
        size="compact"
      />

      <section className="section contact-section" aria-labelledby="contact-heading">
        <div className="wrap contact-container">
          {/* Centered Heading Block */}
          <div className="contact-header-center">
            <span className="contact-eyebrow">CONTACT US</span>
            <h2 id="contact-heading">Get in touch with us</h2>
            <p>Fill out the form below or schedule a meeting with us at your convenience.</p>
          </div>

          {/* Main 2-Column Grid */}
          <div className="contact-grid-layout">
            {/* Left Column: Modern Contact Form */}
            <form className="contact-modern-form" onSubmit={handleSubmit} noValidate={false}>
              <div className="contact-field-group">
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="contact-field-group">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="Enter Your Email"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="contact-field-group">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Enter Your Message"
                  rows={4}
                  required
                  minLength={10}
                />
              </div>

              <div className="contact-agreement-row">
                <input
                  type="checkbox"
                  id="contact-terms"
                  name="terms"
                  required
                />
                <label htmlFor="contact-terms">
                  I agree with <Link to="/terms-of-use">Terms and Conditions</Link>
                </label>
              </div>

              <button type="submit" className="contact-submit-btn">
                Send Your Request
              </button>

              <p role="status" className="contact-status-note">
                {submitted
                  ? 'Your email application should open with your inquiry. No message has been sent from this website.'
                  : 'This frontend does not submit or store your information.'}
              </p>
              {error && <p role="alert" className="contact-error-note">{error}</p>}
            </form>

            {/* Right Column: Value Checklist & Offices */}
            <div className="contact-side-info">
              <div className="contact-services-block">
                <h3>With our services you can</h3>
                <ul className="contact-benefits-list">
                  <li>
                    <CheckCircle2 size={20} className="benefit-check-icon" aria-hidden="true" />
                    <span>Improve structural longevity and architectural distinction</span>
                  </li>
                  <li>
                    <CheckCircle2 size={20} className="benefit-check-icon" aria-hidden="true" />
                    <span>Sustainable engineering with certified environmental standards</span>
                  </li>
                  <li>
                    <CheckCircle2 size={20} className="benefit-check-icon" aria-hidden="true" />
                    <span>Accelerate project milestone delivery with complete transparency</span>
                  </li>
                  <li>
                    <CheckCircle2 size={20} className="benefit-check-icon" aria-hidden="true" />
                    <span>Comprehensive asset governance and long-term facility support</span>
                  </li>
                </ul>
              </div>

              <div className="contact-offices-row">
                <div className="contact-office-col">
                  <div className="office-title-row">
                    <MapPin size={18} className="office-pin-icon" aria-hidden="true" />
                    <h4>Jaipur (HQ)</h4>
                  </div>
                  <address>
                    Bothra Tower, M.I. Road,<br />
                    4th Floor, C-Scheme,<br />
                    Jaipur, Rajasthan 302001
                  </address>
                </div>

                <div className="contact-office-col">
                  <div className="office-title-row">
                    <MapPin size={18} className="office-pin-icon" aria-hidden="true" />
                    <h4>Corporate Office</h4>
                  </div>
                  <address>
                    Bothra House, Civil Lines,<br />
                    Near High Court Circle,<br />
                    Jodhpur, Rajasthan 342001
                  </address>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Direct Contact Bar */}
          <div className="contact-bottom-channels">
            <h3>You can also Contact Us via</h3>
            <div className="contact-channel-pills">
              <a href="mailto:contact@bothrabuildtech.com" className="contact-pill-item">
                <span className="channel-icon-circle">
                  <Mail size={16} aria-hidden="true" />
                </span>
                <span>contact@bothrabuildtech.com</span>
              </a>

              <a href="tel:+911412378900" className="contact-pill-item">
                <span className="channel-icon-circle">
                  <Phone size={16} aria-hidden="true" />
                </span>
                <span>+91 141 237 8900</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <TestimonialMarquee title="A conversation starts here." />
    </>
  )
}