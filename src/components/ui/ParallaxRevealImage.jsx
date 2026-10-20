import { useEffect, useRef, useState } from 'react'
import { cubicBezier, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

const cinematicEase = cubicBezier(0.25, 0.1, 0.25, 1)

/**
 * Reusable ParallaxRevealImage component
 * Combines horizontal clip-path reveal with vertical parallax depth on separate nested motion elements.
 *
 * Outer motion.div -> handles horizontal clipPath reveal (center outward) as image enters viewport.
 * Inner motion.div -> handles vertical parallax movement (y) and slight scale (1.05-1.10) for visual coverage.
 */
export default function ParallaxRevealImage({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  parallaxStrength = 48,
  offset,
  scale = 1,
  revealDirection = 'center',
  loading = 'lazy',
  children,
  style = {},
  ...props
}) {
  const containerRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)
  const strength = offset !== undefined ? offset : parallaxStrength

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // 1. Horizontal Clip-Path Reveal:
  // Starts partially hidden from center and smoothly reveals outward, completing around the time
  // the image reaches the center of the viewport (~0.45-0.5 scroll progress).
  const initialClip = prefersReducedMotion
    ? 'inset(0% 0% 0% 0%)'
    : isMobile
      ? 'inset(0% 25% 0% 25%)'
      : revealDirection === 'left'
        ? 'inset(0% 100% 0% 0%)'
        : revealDirection === 'right'
          ? 'inset(0% 0% 0% 100%)'
          : 'inset(0% 50% 0% 50%)'

  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.46, 1],
    prefersReducedMotion ? ['inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'] : [initialClip, 'inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
    { ease: cinematicEase }
  )

  // 2. Vertical Parallax Movement:
  // Moves image vertically at a slower rate (0.3x - 0.5x) than the foreground content.
  const effectiveStrength = prefersReducedMotion ? 0 : isMobile ? strength * 0.35 : strength

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [effectiveStrength, -effectiveStrength],
    { clamp: false }
  )

  const hasScale = Boolean(scale && scale !== 1 && !prefersReducedMotion)

  return (
    <motion.div
      ref={containerRef}
      className={`parallax-reveal-container parallax-image-container ${className}`.trim()}
      style={{
        clipPath,
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      {...props}
    >
      <motion.div
        className="parallax-reveal-inner"
        style={{
          y,
          ...(hasScale ? { scale: isMobile ? 1 : scale } : {}),
          position: 'absolute',
          top: '-8%',
          left: 0,
          width: '100%',
          height: '116%',
          willChange: 'transform',
          pointerEvents: 'none',
        }}
      >
        <img
          src={src}
          alt={alt}
          loading={loading}
          className={`parallax-reveal-image parallax-image-media ${imgClassName}`.trim()}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </motion.div>

      {children && (
        <div className="parallax-reveal-content" style={{ position: 'relative', zIndex: 2, height: '100%', pointerEvents: 'auto' }}>
          {children}
        </div>
      )}
    </motion.div>
  )
}
