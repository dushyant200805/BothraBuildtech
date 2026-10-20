import { ArrowLeft, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import PageHero from '../components/ui/PageHero.jsx'
import Button from '../components/ui/Button.jsx'
import { projects } from '../data/projects.js'

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const project = projects.find((entry) => entry.slug === slug)

  if (!project) {
    return (
      <>
        <PageHero
          eyebrow="Project details"
          title="Project information unavailable."
          description="This project has not been published in the verified project directory."
          image="/architecture-geometric-facade.jpg"
        />
        <section className="section">
          <div className="wrap">
            <div className="empty-state">
              <h3>We don’t have verified details for this project.</h3>
              <p>Project locations, status, amenities and specifications are not published until confirmed.</p>
              <Link className="text-link" to="/projects">Return to all projects</Link>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <PageHero
        eyebrow={`${project.status} Development · ${project.category}`}
        title={project.name}
        description={project.tagline || project.description}
        image={project.image}
      />
      <section className="section">
        <div className="wrap detail-layout">
          <div>
            <span className="eyebrow">Project overview</span>
            <h2>{project.name}</h2>
            <p className="project-detail-desc">{project.description}</p>

            {project.features && (
              <div className="project-features-block">
                <h3>Key Highlights & Features</h3>
                <ul className="project-features-list">
                  {project.features.map((feature) => (
                    <li key={feature}>
                      <CheckCircle2 size={18} className="feature-icon" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="project-detail-actions">
              <Button to="/contact">Inquire about this project</Button>
              <Link className="text-link" to="/projects">
                <ArrowLeft size={16} /> Back to all projects
              </Link>
            </div>
          </div>

          <aside className="detail-aside">
            <span>PROJECT SPECIFICATIONS</span>
            <p>{project.name}</p>
            <div className="project-spec-item">
              <span>Status</span>
              <b>{project.status}</b>
            </div>
            <div className="project-spec-item">
              <span>Category</span>
              <b>{project.category}</b>
            </div>
            <div className="project-spec-item">
              <span>Location</span>
              <b>{project.location}</b>
            </div>
            <div className="project-spec-item">
              <span>Development Area</span>
              <b>{project.area}</b>
            </div>
            <div className="project-spec-item">
              <span>Timeline / Delivery</span>
              <b>{project.year}</b>
            </div>
            <div className="project-other-links">
              <span className="eyebrow">Other Developments</span>
              {projects
                .filter((entry) => entry.slug !== slug)
                .slice(0, 3)
                .map((entry) => (
                  <Link key={entry.slug} to={`/projects/${entry.slug}`}>
                    {entry.name} <ArrowUpRight size={15} />
                  </Link>
                ))}
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}