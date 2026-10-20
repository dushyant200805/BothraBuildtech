import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import useReveal from '../animations/useReveal.js'
import TypewriterHeading from '../components/ui/TypewriterHeading.jsx'

export default function NotFoundPage() {
  useReveal()
  return <section className="not-found"><div className="wrap"><span className="eyebrow">404 — Page not found</span><TypewriterHeading title={'THIS ISN’T\nTHE RIGHT PLACE.'} /><Link className="text-link" to="/"><ArrowLeft size={16} /> Return home</Link></div><span className="not-found-caption">Illustrative image</span></section>
}