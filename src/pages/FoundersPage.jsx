import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/ui/PageHero.jsx'
import ParallaxRevealImage from '../components/ui/ParallaxRevealImage.jsx'
import useReveal from '../animations/useReveal.js'
import { founders } from '../data/founders.js'

function useCounter(targetValue, isTriggered, duration = 1800) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isTriggered) return undefined

    let startTime = null
    let frameId = null

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeProgress * targetValue))

      if (progress < 1) {
        frameId = requestAnimationFrame(step)
      } else {
        setCount(targetValue)
      }
    }

    frameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameId)
  }, [targetValue, isTriggered, duration])

  return count
}

function MetricNumber({ target, suffix = '', isVisible }) {
  const value = useCounter(target, isVisible)
  return (
    <div className="metric-number">
      {value.toLocaleString()}{suffix}
    </div>
  )
}

function SkillItem({ label, targetPercent, isVisible }) {
  const percent = useCounter(targetPercent, isVisible, 1400)
  return (
    <div className="skill-item">
      <div className="skill-info">
        <span className="skill-label">{label}</span>
        <span className="skill-percent">{percent}%</span>
      </div>
      <div className="skill-bar-track">
        <div
          className="skill-bar-fill"
          style={{ width: `${isVisible ? targetPercent : 0}%` }}
        />
      </div>
    </div>
  )
}

export default function FoundersPage() {
  useReveal()
  const sectionRef = useRef(null)
  const [hasEntered, setHasEntered] = useState(false)

  useEffect(() => {
    const target = sectionRef.current
    if (!target) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasEntered(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.25 }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <PageHero
        eyebrow="Leadership"
        title="The people behind the vision."
        description="Meet the founders, directors and architects shaping our developments and guiding our principles."
        image="/architecture-minimal-blue-building.jpg"
      />
      {/* Intro Highlight Banner before Owner Profiles */}
      <section className="founders-talent-cta-section" data-aos="fade-up">
        <div className="wrap">
          <div className="founders-talent-cta-grid">
            <h2 className="founders-talent-title">
              Looking for the <span className="highlight-gold">Right partners</span> for your vision?
            </h2>
            <div className="founders-talent-copy">
              <p>
                Connect with the leadership and engineering minds behind Bothra Buildtech. We bring decades of architectural mastery, precision execution, and disciplined governance to shape spaces with purpose.
              </p>
              <Link to="/contact" className="founders-talent-btn">
                Connect with Leadership
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section founders-section">
        <div className="wrap">
          <div className="section-heading" data-reveal style={{ textAlign: 'center', margin: '0 auto 48px' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Executive Leadership</span>
            <h2 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)' }}>Meet the Founders</h2>
            <p style={{ margin: '0 auto' }}>
              Visionary guidance driving our construction standards, architectural integrity, and client trust.
            </p>
          </div>

          {founders.length ? (
            <div className="founders-grid">
              {founders.map((founder, index) => (
                <article
                  className="founder-card"
                  key={founder.name}
                  data-aos="fade-up"
                  data-aos-duration="700"
                  data-aos-delay={(index % 4) * 120}
                >
                  <div className="founder-card-head">
                    <h3 className="founder-card-name">{founder.name}</h3>
                    <p className="founder-card-role">{founder.role}</p>
                  </div>
                  <div className="founder-card-portrait-wrap">
                    <img
                      src={founder.image}
                      alt={founder.name}
                      className="founder-card-portrait"
                      loading="lazy"
                    />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="eyebrow">Founder profiles</span>
              <h3>Leadership information is being verified.</h3>
              <p>No founder names, biographies, portraits or messages have been supplied for publication.</p>
            </div>
          )}
        </div>
      </section>

      {/* Standalone Leadership & Architecture Visual Showcase */}
      <section className="founders-showcase-section">
        <div className="wrap">
          <div className="founders-showcase-grid">
            <ParallaxRevealImage
              src="/dark-office-tower.jpg"
              alt="Bothra Buildtech executive development tower"
              className="founders-showcase-image image-frame"
              parallaxStrength={55}
            >
              <span className="image-caption">DISCIPLINED GOVERNANCE · LANDMARK ARCHITECTURE</span>
            </ParallaxRevealImage>
            <div className="founders-showcase-copy" data-aos="fade-left">
              <span className="eyebrow">Architectural Governance</span>
              <h2>Built on integrity. Guided by experience.</h2>
              <p>
                Our founders unite strategic capital allocation with architectural and civil engineering rigor. Every square foot is planned to maximize longevity, community value, and capital efficiency.
              </p>
              <div className="founders-showcase-pills">
                <span className="showcase-pill">Sustainable Engineering</span>
                <span className="showcase-pill">Urban Planning</span>
                <span className="showcase-pill">Capital Discipline</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Skills & Milestone Metrics Section */}
      <section className="skills-metrics-section" ref={sectionRef}>
        <div className="wrap">
          <div className="skills-metrics-grid">
            <div className="skills-block" data-aos="fade-right">
              <h2 className="skills-title">Our Skills</h2>
              <p className="skills-desc">
                Leading with architectural discipline, precision engineering, and modern sustainable design across large-scale developments.
              </p>

              <div className="skills-list">
                <SkillItem
                  label="Architectural Planning"
                  targetPercent={85}
                  isVisible={hasEntered}
                />
                <SkillItem
                  label="Structural Engineering"
                  targetPercent={90}
                  isVisible={hasEntered}
                />
                <SkillItem
                  label="Sustainable Development"
                  targetPercent={77}
                  isVisible={hasEntered}
                />
              </div>
            </div>

            <div className="metrics-block" data-aos="fade-left">
              <div className="metrics-grid">
                <div className="metric-item">
                  <MetricNumber target={20} suffix="+" isVisible={hasEntered} />
                  <div className="metric-label">Years Of Experience</div>
                </div>

                <div className="metric-item">
                  <MetricNumber target={1000} suffix="+" isVisible={hasEntered} />
                  <div className="metric-label">Project Done</div>
                </div>

                <div className="metric-item">
                  <MetricNumber target={300} suffix="+" isVisible={hasEntered} />
                  <div className="metric-label">Satisfied Client</div>
                </div>

                <div className="metric-item">
                  <MetricNumber target={64} isVisible={hasEntered} />
                  <div className="metric-label">Certified Award</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}