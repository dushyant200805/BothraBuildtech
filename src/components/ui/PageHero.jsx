import { useRef } from 'react'
import { cubicBezier, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import useReveal from '../../animations/useReveal.js'
import TypewriterHeading from './TypewriterHeading.jsx'

const cinematicEase = cubicBezier(0.25, 0.1, 0.25, 1)

export default function PageHero({
  eyebrow = 'Bothra Buildtech',
  title,
  description,
  image = '/architecture-white-tower.jpg',
  size = 'default',
}) {
  useReveal()
  const heroRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  // 1. Hero background image slowly scales from 1 to 1.08
  const bgScale = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [1, 1] : [1, 1.08],
    { ease: cinematicEase }
  )

  // 2. Background blur increases from 0px to 8px
  const bgBlur = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ['blur(0px)', 'blur(0px)'] : ['blur(0px)', 'blur(8px)'],
    { ease: cinematicEase }
  )

  // 3. Hero content moves upward smoothly
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ['0px', '0px'] : ['0px', '-70px'],
    { ease: cinematicEase }
  )

  // 4. Hero text opacity fades from 1 to 0
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.75],
    [1, 0],
    { ease: cinematicEase }
  )

  // 5. Subtle darkening overlay as user scrolls down
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 1],
    [0.6, 0.92],
    { ease: cinematicEase }
  )

  return (
    <section
      ref={heroRef}
      className={`page-hero ${size === 'compact' ? 'page-hero--compact' : ''}`.trim()}
      style={image ? { '--page-image': `url(${image})` } : undefined}
    >
      {/* Scroll-driven background scaling and blur */}
      <motion.div
        className="page-hero__media"
        style={{
          scale: bgScale,
          filter: bgBlur,
        }}
        aria-hidden="true"
      >
        <div
          className="page-hero__bg-image"
          style={image ? { backgroundImage: `url(${image})` } : undefined}
        />
        <motion.div
          className="page-hero__overlay"
          style={{ opacity: overlayOpacity }}
        />
      </motion.div>

      {/* Scroll-driven upward movement and text opacity fade */}
      <motion.div
        className="wrap page-hero__content"
        style={{
          y: contentY,
          opacity: contentOpacity,
        }}
      >
        <span className="eyebrow">{eyebrow}</span>
        <TypewriterHeading title={title} />
        {description && <p>{description}</p>}
      </motion.div>

      {/* Smooth bottom feather gradient transition to next section */}
      <div className="page-hero__bottom-feather" aria-hidden="true" />

      <span className="page-hero-caption">Illustrative image</span>
    </section>
  )
}