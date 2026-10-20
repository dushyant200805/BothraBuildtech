import { Star } from 'lucide-react'
import { testimonialSamples } from '../../data/testimonials.js'

function TestimonialCard({ testimonial }) {
  const initials = testimonial.avatarLabel || testimonial.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('')

  return (
    <article className="testimonial-card relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-2xl">
      {testimonial.projectImage && (
        <div className="testimonial-card-image relative w-full h-36 overflow-hidden rounded-lg mb-4 bg-muted">
          <img
            src={testimonial.projectImage}
            alt={testimonial.project || 'Project reference'}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            loading="lazy"
          />
          {testimonial.project && (
            <span className="testimonial-project-badge absolute bottom-2.5 left-2.5 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white bg-slate-950/80 backdrop-blur-sm rounded">
              {testimonial.project}
            </span>
          )}
        </div>
      )}

      <div className="testimonial-rating-row flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-1 text-amber-400" aria-label={`${testimonial.rating || 5} out of 5 stars`}>
          {Array.from({ length: testimonial.rating || 5 }, (_, i) => (
            <Star key={i} size={14} className="fill-amber-400 text-amber-400" aria-hidden="true" />
          ))}
        </div>
        {testimonial.date && (
          <span className="testimonial-date text-xs text-muted-foreground font-medium">
            {testimonial.date}
          </span>
        )}
      </div>

      <blockquote className="testimonial-quote my-2 text-sm md:text-base font-medium leading-relaxed flex-1">
        “{testimonial.quote}”
      </blockquote>

      <header className="testimonial-card-head flex items-center justify-between gap-3 mt-4 pt-4 border-t border-border">
        <footer className="testimonial-author flex items-center gap-3">
          {testimonial.avatar ? (
            <img src={testimonial.avatar} alt="" className="w-10 h-10 rounded-full object-cover" loading="lazy" />
          ) : (
            <span className="testimonial-avatar flex items-center justify-center w-10 h-10 rounded-full font-bold" aria-hidden="true">
              {initials}
            </span>
          )}
          <span className="testimonial-attribution flex flex-col">
            <cite className="font-semibold text-sm not-italic text-foreground">{testimonial.name}</cite>
            <span className="text-xs text-muted-foreground">
              {testimonial.role}{testimonial.company ? ` · ${testimonial.company}` : ''}
            </span>
          </span>
        </footer>
        {testimonial.sample && <span className="testimonial-sample-label">SAMPLE ONLY</span>}
      </header>
    </article>
  )
}

export default function TestimonialMarquee({ items = testimonialSamples, title = 'Client perspectives' }) {
  if (items.length === 0) return null

  const lanes = [
    items.filter((_, index) => index % 2 === 0),
    items.filter((_, index) => index % 2 === 1),
  ].filter((lane) => lane.length > 0)
  const showingSamples = items.some((testimonial) => testimonial.sample)

  return (
    <section className="testimonial-section relative w-full overflow-hidden py-24" aria-labelledby="testimonial-heading">
      <div className="testimonial-giant-bg" aria-hidden="true">
        <span>PERSPECTIVES</span>
      </div>

      <div className="wrap testimonial-heading relative z-10 mx-auto max-w-4xl text-center mb-12">
        <span className="eyebrow inline-block mb-2 font-bold tracking-widest text-xs uppercase text-primary">
          Client perspectives
        </span>
        <h2 id="testimonial-heading" className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
          {title}
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          {showingSamples
            ? 'Fictional sample content only. These are not real client endorsements.'
            : 'Shared with permission.'}
        </p>
      </div>

      <div className="testimonial-lanes relative z-10 w-full overflow-hidden">
        {lanes.map((lane, laneIndex) => (
          <div
            className={`testimonial-marquee-row group relative w-full overflow-hidden ${
              laneIndex % 2 ? 'testimonial-marquee-row--reverse' : ''
            }`}
            key={`lane-${laneIndex}`}
          >
            <div className="testimonial-marquee-track flex w-max will-change-transform group-hover:[animation-play-state:paused]">
              {[false, true].map((isCopy) => (
                <div
                  className="testimonial-marquee-set flex flex-shrink-0 items-stretch gap-6"
                  aria-hidden={isCopy || undefined}
                  key={String(isCopy)}
                >
                  {lane.map((testimonial) => (
                    <TestimonialCard
                      testimonial={testimonial}
                      key={`${isCopy ? 'copy-' : ''}${testimonial.name}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}