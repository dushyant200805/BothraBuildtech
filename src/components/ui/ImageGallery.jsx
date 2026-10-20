import { useMemo, useState } from 'react'
import { Waves } from 'lucide-react'
import { imageCategories, imageGallery } from '../../data/imageGallery.js'

export default function ImageGallery() {
  const [category, setCategory] = useState(imageCategories[0])
  const images = useMemo(() => category === 'All imagery'
    ? imageGallery
    : imageGallery.filter((image) => image.category === category), [category])

  return (
    <section className="section visual-library" aria-labelledby="visual-library-title">
      <div className="wrap">
        <div className="section-heading">
          <span className="eyebrow">Visual references</span>
          <h2 id="visual-library-title">A library of forms and places.</h2>
          <p>Browse our curated architectural library and regional field studies across forms, structural glazing, academic grounds, and tea heritage landscapes.</p>
        </div>

        <div className="gallery-filters" role="group" aria-label="Filter visual references">
          {imageCategories.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="projects-grid visual-grid-3 visual-gallery" aria-live="polite">
          {images.map((image, index) => {
            const itemNumber = String(index + 1).padStart(2, '0')

            return (
              <article
                className="project-card visual-card"
                key={image.src}
                data-aos="fade-up"
                data-aos-duration="550"
                data-aos-delay={(index % 3) * 60}
              >
                <div className="project-card-header">
                  <span className="project-card-number" aria-hidden="true">
                    {itemNumber}
                  </span>
                </div>

                <div className="project-card-content">
                  <h3 className="project-card-title">
                    <span>{image.title}</span>
                  </h3>
                  <p className="project-card-desc">{image.description}</p>
                </div>

                <div className="project-card-image-wrap visual-image">
                  <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
                </div>

                <div className="project-card-footer">
                  <div className="project-card-tag">
                    <Waves size={18} aria-hidden="true" />
                    <span>{image.category.toLowerCase()} · {image.location.toLowerCase()}</span>
                  </div>
                  <span className="project-status-tag">
                    {image.tag}
                  </span>
                </div>
              </article>
            )
          })}
        </div>

        <p className="gallery-disclaimer">
          Images are for visual reference only. No project, location, company affiliation, or ownership is implied.
        </p>
      </div>
    </section>
  )
}