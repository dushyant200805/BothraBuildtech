import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHero from '../components/ui/PageHero.jsx'
import Button from '../components/ui/Button.jsx'
import ParallaxRevealImage from '../components/ui/ParallaxRevealImage.jsx'

const aboutImage = '/architecture-minimal-blue-building.jpg'

export default function AboutPage() {
  return <>
    <PageHero eyebrow="About Bothra Buildtech" title={<>A place to begin.<br />A purpose to build.</>} description="An introduction to the brand, its story and the principles behind its work." image={aboutImage} />
    <section className="section"><div className="wrap about-story"><div className="about-side" data-reveal><span className="eyebrow">Our story</span><span className="vertical-note">01 — FOUNDATIONS</span></div><div data-reveal><h2>Building with clarity, from the ground up.</h2><p>Bothra Buildtech is a construction and real-estate development brand. Verified company history, operating locations, project experience and service details are pending approval and will be added here without unsupported claims.</p><p>For now, this page provides a framework for the company’s story rather than presenting unconfirmed milestones as fact.</p><Button to="/contact" variant="outline">Connect with us</Button></div><ParallaxRevealImage src={aboutImage} alt="Light-filled contemporary architecture" className="about-story-image image-frame" parallaxStrength={55} data-reveal /></div></section>
    <section className="vision-section"><div className="wrap vision-grid"><div data-reveal><span className="eyebrow">Vision & mission</span><h2>Grounded in a point of view.</h2><p>Approved vision and mission statements have not yet been provided. This space is reserved for the company’s own words.</p></div><div className="vision-note"><span>COMPANY STATEMENT</span><p>Vision and mission statement awaiting confirmation.</p><ArrowRight size={18} /></div></div></section>
    <section className="section values-section"><div className="wrap"><div className="section-heading"><span className="eyebrow">What matters</span><h2>CORE VALUES</h2><p>Company values will be published after review and approval.</p></div><div className="values-rule"><span>01</span><span>Approved company values pending.</span><span>—</span></div><div className="values-rule"><span>02</span><span>Quality philosophy pending approval.</span><span>—</span></div><div className="values-rule"><span>03</span><span>Leadership principles pending approval.</span><span>—</span></div></div></section>
    <section className="about-next"><div className="wrap"><span className="eyebrow">Next</span><h2>MEET THE PEOPLE<br />BEHIND THE WORK.</h2><Link to="/about-us/founders" className="text-link">Founders information <ArrowRight size={16} /></Link></div></section>
  </>
}