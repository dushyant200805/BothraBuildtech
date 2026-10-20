import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, MapPin, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Button from '../ui/Button.jsx'

/**
 * Reusable HorizontalProjects Showcase Component
 * Transforms vertical page scroll into smooth horizontal movement across a sticky 100vh viewport.
 * Supports both development projects and enterprise business directories.
 *
 * Props:
 * - projects: Array of project/business data objects
 * - sectionTitle: Title of the category/showcase
 * - sectionSubtitle: Subtitle description
 * - category / projectCategory: Category name (Completed, Ongoing, Upcoming, Enterprise, etc.)
 * - eyebrow: Optional custom eyebrow label
 * - scrollDistance: Optional vertical scroll distance override (e.g. '280vh')
 * - showOutro: Whether to show closing CTA card (default: true)
 * - outroTitle: Custom title for closing card
 * - outroDesc: Custom description for closing card
 * - className: Optional custom class name
 */
export default function HorizontalProjects({
  projects = [],
  sectionTitle = 'Featured Developments',
  sectionSubtitle = 'Architectural landmarks crafted with precision, purpose and enduring presence.',
  category,
  projectCategory,
  eyebrow,
  scrollDistance,
  showOutro = true,
  outroTitle,
  outroDesc,
  className = '',
  id,
}) {
  const containerRef = useRef(null)
  const trackRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)
  const [maxScrollX, setMaxScrollX] = useState(0)

  const activeCategory = category || projectCategory || (projects[0]?.status ? `${projects[0].status} Developments` : 'Projects')
  const activeEyebrow = eyebrow || activeCategory

  // Detect mobile viewports (< 768px) where natural touch momentum swipe is optimal
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Measure dynamic horizontal scroll range
  useEffect(() => {
    if (isMobile || prefersReducedMotion) return undefined

    const updateMaxScroll = () => {
      if (trackRef.current) {
        const trackWidth = trackRef.current.scrollWidth
        const windowWidth = window.innerWidth
        const endPadding = Math.min(windowWidth * 0.12, 160)
        const scrollDelta = Math.max(0, trackWidth - windowWidth + endPadding)
        setMaxScrollX(scrollDelta)
      }
    }

    updateMaxScroll()
    window.addEventListener('resize', updateMaxScroll, { passive: true })
    const timer = setTimeout(updateMaxScroll, 350)
    return () => {
      window.removeEventListener('resize', updateMaxScroll)
      clearTimeout(timer)
    }
  }, [projects, isMobile, prefersReducedMotion])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Horizontal track movement: maps vertical scroll 0 -> 1 to horizontal translation
  const fallbackPercentage = projects.length <= 2 ? '-35%' : projects.length <= 4 ? '-60%' : '-75%'
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    maxScrollX > 0 ? [0, -maxScrollX] : ['0%', scrollDistance || fallbackPercentage]
  )

  // Outer section height: scales smoothly based on number of cards
  const calculatedHeight = `${Math.min(360, Math.max(220, 160 + projects.length * 50))}vh`
  const sectionHeight = scrollDistance && scrollDistance.endsWith('vh') ? scrollDistance : calculatedHeight

  const enableStickyScroll = !isMobile && !prefersReducedMotion && projects.length > 0

  if (!projects.length) {
    return <div ref={containerRef} style={{ display: 'none' }} />
  }

  const badgeLabel = category === 'Enterprises' || category === 'Businesses'
    ? (projects.length === 1 ? 'Business' : 'Businesses')
    : (projects.length === 1 ? 'Project' : 'Projects')

  return (
    <section
      ref={containerRef}
      id={id}
      className={`horizontal-projects-section ${className}`.trim()}
      style={{
        height: enableStickyScroll ? sectionHeight : 'auto',
      }}
    >
      <div className={`horizontal-projects-sticky ${enableStickyScroll ? 'is-sticky' : 'is-natural'}`}>
        {/* Sticky Header with Title and Badges (Screen shot cue removed) */}
        <header className="horizontal-projects-header">
          <div className="wrap horizontal-projects-header__inner">
            <div className="horizontal-projects-header__copy">
              <div className="horizontal-projects-header__meta-row">
                <span className="eyebrow">{activeEyebrow}</span>
                <span className="horizontal-projects-badge">
                  {projects.length} {badgeLabel}
                </span>
              </div>
              <h2 className="horizontal-projects-header__title">{sectionTitle}</h2>
              {sectionSubtitle && (
                <p className="horizontal-projects-header__subtitle">{sectionSubtitle}</p>
              )}
            </div>
          </div>
        </header>

        {/* Horizontal Track */}
        <div className="horizontal-projects-viewport">
          <motion.div
            ref={trackRef}
            className="horizontal-projects-track"
            style={enableStickyScroll ? { x } : undefined}
          >
            {projects.map((project, index) => {
              const projectNumber = String(index + 1).padStart(2, '0')
              const imageSrc = project.image || project.heroImage
              const hasExternalLink = Boolean(project.website)
              const isProject = Boolean(project.year || project.area)
              const statusClass = project.status ? project.status.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'active'

              return (
                <article
                  className="horizontal-project-card project-card"
                  key={project.slug}
                  data-aos={!enableStickyScroll ? 'fade-up' : undefined}
                  data-aos-delay={!enableStickyScroll ? (index % 3) * 100 : undefined}
                >
                  {/* Large Image Wrap */}
                  <div className="horizontal-project-card__image-wrap">
                    {hasExternalLink ? (
                      <a
                        href={project.website}
                        target="_blank"
                        rel="noreferrer"
                        className="horizontal-project-card__image-link"
                        tabIndex={-1}
                        aria-hidden="true"
                      >
                        <img
                          src={imageSrc}
                          alt={project.name}
                          className="horizontal-project-card__img"
                          loading="lazy"
                        />
                      </a>
                    ) : isProject ? (
                      <Link
                        to={`/projects/${project.slug}`}
                        className="horizontal-project-card__image-link"
                        tabIndex={-1}
                        aria-hidden="true"
                      >
                        <img
                          src={imageSrc}
                          alt={project.name}
                          className="horizontal-project-card__img"
                          loading="lazy"
                        />
                      </Link>
                    ) : (
                      <div className="horizontal-project-card__image-link">
                        <img
                          src={imageSrc}
                          alt={project.name}
                          className="horizontal-project-card__img"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Overlay Badges */}
                    <div className="horizontal-project-card__badges">
                      <span className={`project-status-tag project-status-tag--${statusClass}`}>
                        {project.status}
                      </span>
                      {project.category && (
                        <span className="horizontal-project-card__category-tag">
                          {project.category}
                        </span>
                      )}
                    </div>

                    <span className="horizontal-project-card__number" aria-hidden="true">
                      {projectNumber}
                    </span>
                  </div>

                  {/* Editorial Card Body */}
                  <div className="horizontal-project-card__body">
                    <div className="horizontal-project-card__specs">
                      {project.location && (
                        <span className="horizontal-project-card__spec">
                          <MapPin size={12} aria-hidden="true" />
                          {project.location}
                        </span>
                      )}
                      {project.area && (
                        <span className="horizontal-project-card__spec">{project.area}</span>
                      )}
                      {project.year && (
                        <span className="horizontal-project-card__spec">{project.year}</span>
                      )}
                    </div>

                    <h3 className="horizontal-project-card__title">
                      {hasExternalLink ? (
                        <a href={project.website} target="_blank" rel="noreferrer">
                          {project.name}
                        </a>
                      ) : isProject ? (
                        <Link to={`/projects/${project.slug}`}>{project.name}</Link>
                      ) : (
                        <span>{project.name}</span>
                      )}
                    </h3>

                    {project.tagline && (
                      <p className="horizontal-project-card__tagline">{project.tagline}</p>
                    )}

                    <p className="horizontal-project-card__desc">{project.description}</p>

                    {project.features && project.features.length > 0 && (
                      <div className="horizontal-project-card__features">
                        {project.features.slice(0, 2).map((feat) => (
                          <span className="horizontal-project-card__feature-pill" key={feat}>
                            {feat}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="horizontal-project-card__footer">
                      {hasExternalLink ? (
                        <a
                          href={project.website}
                          target="_blank"
                          rel="noreferrer"
                          className="horizontal-project-card__cta"
                          aria-label={`Visit official website for ${project.name}`}
                        >
                          <span>Visit Website</span>
                          <ArrowUpRight size={16} aria-hidden="true" />
                        </a>
                      ) : isProject ? (
                        <Link
                          to={`/projects/${project.slug}`}
                          className="horizontal-project-card__cta"
                          aria-label={`View ${project.name}`}
                        >
                          <span>View Project</span>
                          <ArrowUpRight size={16} aria-hidden="true" />
                        </Link>
                      ) : (
                        <Link
                          to="/contact"
                          className="horizontal-project-card__cta"
                          aria-label={`Inquire about ${project.name}`}
                        >
                          <span>Contact Division</span>
                          <ArrowUpRight size={16} aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}

            {/* Closing Editorial Showcase Card */}
            {showOutro && (
              <article className="horizontal-project-card horizontal-project-card--outro">
                <div className="horizontal-project-card--outro-inner">
                  <div className="horizontal-outro-sparkle">
                    <Sparkles size={24} aria-hidden="true" />
                  </div>
                  <span className="eyebrow">Enduring Value</span>
                  <h3 className="horizontal-outro-title">
                    {outroTitle || 'Built with intention, delivered with precision.'}
                  </h3>
                  <p className="horizontal-outro-desc">
                    {outroDesc || 'Explore our comprehensive portfolio or connect with our leadership team for detailed partnership opportunities.'}
                  </p>
                  <div className="horizontal-outro-actions">
                    <Button to="/contact" variant="primary">
                      Contact team
                    </Button>
                    <Button to="/about-us" variant="outline">
                      Our approach
                    </Button>
                  </div>
                </div>
              </article>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
