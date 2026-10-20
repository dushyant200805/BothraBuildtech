import { ArrowUpRight, Plus } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { cubicBezier, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Button from '../components/ui/Button.jsx'
import ParallaxRevealImage from '../components/ui/ParallaxRevealImage.jsx'
import TestimonialMarquee from '../components/sections/TestimonialMarquee.jsx'
import useReveal from '../animations/useReveal.js'
import useTypewriter from '../animations/useTypewriter.js'
import { groupBusinesses } from '../data/groupBusinesses.js'
import { faqItems } from '../data/faq.js'

const photos = {
  hero: '/city-office-skyline.jpg',
  detail: '/architecture-curved-white-facade.jpg',
  structure: '/blue-glass-tower-angle.jpg',
  horizon: '/architecture-white-tower.jpg',
}

const heroHeadingLines = ['BUILDING', 'SPACES.', 'SHAPING TOMORROW.']
const cinematicEase = cubicBezier(0.25, 0.1, 0.25, 1)

export default function HomePage() {
  useReveal()
  const [openFaq, setOpenFaq] = useState(0)
  const { visibleText, isTyping } = useTypewriter(heroHeadingLines.join(''))
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
    prefersReducedMotion ? ['0px', '0px'] : ['0px', '-90px'],
    { ease: cinematicEase }
  )

  // 4. Hero text opacity fades from 1 to 0
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.7],
    [1, 0],
    { ease: cinematicEase }
  )

  // Subtle darkening of overlay as user scrolls down
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 1],
    [0.55, 0.88],
    { ease: cinematicEase }
  )

  return <>
    <section className="home-hero" ref={heroRef} style={{ '--hero-image': `url(${photos.hero})` }}>
      {/* Scroll-driven background scaling and blur */}
      <motion.div
        className="home-hero__media"
        style={{
          scale: bgScale,
          filter: bgBlur,
        }}
        aria-hidden="true"
      >
        <div
          className="home-hero__bg-image"
          style={{ backgroundImage: `url(${photos.hero})` }}
        />
        <motion.div
          className="home-hero__overlay"
          style={{ opacity: overlayOpacity }}
        />
      </motion.div>

      {/* Grid mark line fading in sync with content */}
      <motion.div
        className="hero-grid-mark"
        aria-hidden="true"
        style={{ opacity: contentOpacity }}
      />

      {/* Scroll-driven upward movement and text opacity fade */}
      <motion.div
        className="wrap hero-content"
        style={{
          y: contentY,
          opacity: contentOpacity,
        }}
      >
        <span className="eyebrow">A construction & development brand</span>
        <h1 aria-label={heroHeadingLines.join(' ')}>
          {heroHeadingLines.map((line, index) => {
            const lineStart = heroHeadingLines.slice(0, index).reduce((length, previousLine) => length + previousLine.length, 0)
            const text = visibleText.slice(lineStart, lineStart + line.length)
            const isTypingLine = isTyping && visibleText.length >= lineStart && (visibleText.length < lineStart + line.length || (index === heroHeadingLines.length - 1 && visibleText.length === lineStart + line.length))
            return (
              <span className="home-hero__typed-line" key={line} aria-hidden="true">
                {index === 1 ? <em>{text}</em> : text}
                {isTypingLine && <span className="typewriter-cursor" />}
              </span>
            )
          })}
        </h1>
        <div className="hero-bottom">
          <p>Thoughtful places begin with a clear vision. Discover the next chapter of Bothra Buildtech.</p>
          <div className="hero-actions">
            <Button to="/projects">Explore projects</Button>
            <Button to="/about-us" variant="outline">Discover our story</Button>
          </div>
        </div>
      </motion.div>

      {/* Smooth gradient transition to next section */}
      <div className="home-hero__bottom-feather" aria-hidden="true" />
    </section>

    <section className="section intro-section" id="introduction"><div className="wrap intro-grid"><div data-reveal><span className="eyebrow">A considered beginning</span><h2>Good spaces start with <i>good questions.</i></h2><p>Bothra Buildtech is a construction and real-estate development brand. Company history, capabilities and project information will be added here once approved details are available.</p><Button to="/about-us" variant="outline">Discover more</Button></div><ParallaxRevealImage src={photos.detail} alt="Curving white architectural facade" className="intro-image image-frame" parallaxStrength={70} data-reveal><span className="image-caption">SPACES SHAPED BY INTENTION</span></ParallaxRevealImage><div className="intro-aside" data-reveal><span>DESIGN · CONSTRUCTION · DEVELOPMENT</span><ParallaxRevealImage src={photos.structure} alt="Blue glass tower seen from below" className="image-frame" parallaxStrength={40} /></div></div></section>

    <section className="statement-band"><div className="wrap statement-grid"><span className="eyebrow">Our approach</span><h2>PLACE. PURPOSE.<br /><span>POSSIBILITY.</span></h2><p>We believe the built environment should feel considered at every scale. Our specific approach and services are being confirmed.</p><Link className="round-link" to="/about-us" aria-label="Read about our approach"><ArrowUpRight /></Link></div></section>

    <section className="section project-preview"><div className="wrap"><div className="section-heading" data-reveal><span className="eyebrow">Selected work</span><h2>OUR PROJECTS</h2><p>Project details are being verified before publication. The directory will feature confirmed locations, status and imagery.</p></div><div className="project-empty image-frame" style={{ '--project-image': `url(${photos.horizon})` }} data-reveal><div className="project-empty-copy"><span>PORTFOLIO IN PROGRESS</span><h3>Every project deserves a story told accurately.</h3><Button to="/projects" variant="light">Visit project directory</Button></div></div></div></section>

    <section className="section process-section"><div className="wrap"><div className="section-heading" data-reveal><span className="eyebrow">From idea to place</span><h2>THOUGHTFUL AT<br />EVERY STEP.</h2><p>A clear framework helps every decision feel connected. Company-specific processes are pending approval.</p></div><div className="process-grid">{[['01', 'PLAN', 'Start with place, people and purpose.'], ['02', 'BUILD', 'Bring the vision into physical form.'], ['03', 'DELIVER', 'Create a lasting sense of place.']].map(([number, title, copy]) => <article className="process-item" key={number} data-reveal><span>{number}</span><h3>{title}</h3><p>{copy}</p><div className="process-line" /></article>)}</div></div></section>

    <section className="group-preview"><ParallaxRevealImage src="/architecture-geometric-facade.jpg" alt="Geometric architectural facade" className="group-photo" parallaxStrength={65} /><div className="group-copy"><div className="section-heading" data-reveal><span className="eyebrow">Business references</span><h2>A broader<br />point of view.</h2><p>The following names and official references were supplied for review. Their relationship to Bothra Buildtech has not been confirmed.</p></div><div className="group-link-list">{groupBusinesses.map((business, index) => <Link to="/other-businesses" key={business.slug}><span>0{index + 1}</span><b>{business.name}</b><ArrowUpRight size={18} /></Link>)}</div><Button to="/other-businesses" variant="outline">View all business references</Button></div></section>

    <section className="section faq-section"><div className="wrap faq-layout"><div className="section-heading" data-reveal><span className="eyebrow">A few answers</span><h2>GOOD TO KNOW.</h2><p>We’ll add company-specific answers as information is confirmed.</p><Button to="/contact" variant="outline">Ask a question</Button></div><div className="faq-list">{faqItems.map(([question, answer], index) => <article className="faq-item" key={question}><button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq((current) => current === index ? -1 : index)}><span>{question}</span><Plus size={18} aria-hidden="true" /></button>{openFaq === index && <p>{answer}</p>}</article>)}</div></div></section>

    <TestimonialMarquee />

    <section className="contact-band" style={{ '--contact-image': `url(${photos.hero})` }}><div className="wrap contact-band-inner"><span className="eyebrow">Start a conversation</span><h2>LET’S BUILD<br />WHAT’S NEXT.</h2><p>For project or company inquiries, reach out to our team.</p><Button to="/contact" variant="light">Contact us</Button></div></section>
  </>
}