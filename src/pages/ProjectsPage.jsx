import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageHero from '../components/ui/PageHero.jsx'
import HorizontalProjects from '../components/sections/HorizontalProjects.jsx'
import TestimonialMarquee from '../components/sections/TestimonialMarquee.jsx'
import useReveal from '../animations/useReveal.js'
import { projects, projectStatuses, statusDescriptions } from '../data/projects.js'

export default function ProjectsPage({ initialStatus = 'All' }) {
  useReveal()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const statusRoutes = {
    All: '/projects',
    Completed: '/projects/completed',
    Ongoing: '/projects/ongoing',
    Upcoming: '/projects/upcoming',
  }

  const handleStatusClick = (status) => {
    navigate(statusRoutes[status] || '/projects')
  }

  const completedProjects = useMemo(
    () => projects.filter((p) => p.status === 'Completed'),
    []
  )
  const ongoingProjects = useMemo(
    () => projects.filter((p) => p.status === 'Ongoing'),
    []
  )
  const upcomingProjects = useMemo(
    () => projects.filter((p) => p.status === 'Upcoming'),
    []
  )

  // Filter based on status and search query
  const filteredProjects = useMemo(() => {
    let result = projects
    if (initialStatus !== 'All') {
      result = result.filter(
        (p) => p.status.toLowerCase() === initialStatus.toLowerCase()
      )
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q)
      )
    }
    return result
  }, [initialStatus, searchQuery])

  const currentDescription = statusDescriptions[initialStatus] || statusDescriptions.All
  const isSearchActive = searchQuery.trim().length > 0

  return (
    <>
      <PageHero
        eyebrow="Our work"
        title="Projects, with purpose."
        description="Browse our portfolio of verified developments and landmark projects built with architectural rigor and sustainable engineering."
        image="/architecture-white-tower.jpg"
      />

      <section className="projects-controls-section">
        <div className="wrap">
          <div className="status-overview-banner">
            <div className="status-overview-copy">
              <span className="eyebrow">
                {initialStatus === 'All' ? 'Portfolio Overview' : `${initialStatus} Portfolio`}
              </span>
              <h3>{currentDescription}</h3>
            </div>
            <p className="projects-verification-badge">Project information is being verified.</p>
          </div>

          {/* Search & Status Navigation Tabs */}
          <div className="projects-toolbar">
            <div
              className="projects-status-tabs"
              role="group"
              aria-label="Filter projects by status"
            >
              {projectStatuses.map((status) => {
                const isActive = initialStatus.toLowerCase() === status.toLowerCase()
                return (
                  <button
                    key={status}
                    type="button"
                    className={`projects-tab-btn ${isActive ? 'is-active' : ''}`}
                    aria-pressed={isActive}
                    onClick={() => handleStatusClick(status)}
                  >
                    {status}
                  </button>
                )
              })}
            </div>

            <div className="projects-search-wrap">
              <Search size={16} className="projects-search-icon" aria-hidden="true" />
              <input
                type="text"
                className="projects-search-input"
                placeholder="Search projects..."
                aria-label="Search projects"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="projects-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search text"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Showcases */}
      {isSearchActive ? (
        filteredProjects.length > 0 ? (
          <HorizontalProjects
            category={initialStatus === 'All' ? 'Filtered Developments' : `${initialStatus} Developments`}
            eyebrow="Search Results"
            sectionTitle={`Matching Projects (${filteredProjects.length})`}
            sectionSubtitle={`Found ${filteredProjects.length} verified developments matching "${searchQuery}".`}
            projects={filteredProjects}
          />
        ) : (
          <section className="section empty-search-section">
            <div className="wrap" style={{ textAlign: 'center', paddingBlock: '60px' }}>
              <p style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '18px' }}>
                No verified projects match this search.
              </p>
              <button
                type="button"
                className="button button--outline"
                onClick={() => setSearchQuery('')}
              >
                Clear filters
              </button>
            </div>
          </section>
        )
      ) : initialStatus === 'All' ? (
        <>
          <HorizontalProjects
            category="Completed"
            eyebrow="01 — Delivered Portfolio"
            sectionTitle="Completed Developments"
            sectionSubtitle={statusDescriptions.Completed}
            projects={completedProjects}
            id="completed-projects"
          />
          <HorizontalProjects
            category="Ongoing"
            eyebrow="02 — Active Construction"
            sectionTitle="Ongoing Developments"
            sectionSubtitle={statusDescriptions.Ongoing}
            projects={ongoingProjects}
            id="ongoing-projects"
          />
          <HorizontalProjects
            category="Upcoming"
            eyebrow="03 — Future Landmarks"
            sectionTitle="Upcoming Developments"
            sectionSubtitle={statusDescriptions.Upcoming}
            projects={upcomingProjects}
            id="upcoming-projects"
          />
        </>
      ) : (
        <HorizontalProjects
          category={initialStatus}
          eyebrow={`${initialStatus} Portfolio`}
          sectionTitle={`${initialStatus} Developments`}
          sectionSubtitle={currentDescription}
          projects={filteredProjects}
        />
      )}

      <TestimonialMarquee title="Projects built on trust." />
    </>
  )
}