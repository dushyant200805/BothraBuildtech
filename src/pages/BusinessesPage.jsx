import PageHero from '../components/ui/PageHero.jsx'
import Button from '../components/ui/Button.jsx'
import ParallaxRevealImage from '../components/ui/ParallaxRevealImage.jsx'
import ImageGallery from '../components/ui/ImageGallery.jsx'
import HorizontalProjects from '../components/sections/HorizontalProjects.jsx'
import useReveal from '../animations/useReveal.js'
import { groupBusinesses } from '../data/groupBusinesses.js'

export default function BusinessesPage() {
  useReveal()

  return (
    <>
      <PageHero
        eyebrow="Business directory"
        title="Different disciplines. Distinct identities."
        description="Explore the broader business ecosystem, affiliated ventures and enterprise initiatives associated with Bothra Group."
        image="/architecture-apartment-corner.jpg"
        size="compact"
      />

      {/* Status Overview Banner */}
      <section className="projects-controls-section">
        <div className="wrap">
          <div className="status-overview-banner">
            <div className="status-overview-copy">
              <span className="eyebrow">Enterprise Portfolio</span>
              <h3>Diversified operations spanning international trade, tea agriculture, and world-class education.</h3>
            </div>
            <p className="projects-verification-badge">3 Verified Businesses</p>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Showcase for Other Businesses */}
      <HorizontalProjects
        category="Enterprises"
        eyebrow="Cross-Sector Leadership"
        sectionTitle="Affiliated Enterprise Portfolio"
        sectionSubtitle="Diversified business entities operating across international supply chains, agro-plantations, and accredited academic institutions."
        projects={groupBusinesses}
        outroTitle="Integrated Scale Across Industry Sectors."
        outroDesc="Each independent enterprise operates with autonomous operational rigor while adhering to unified corporate governance and quality benchmarks."
      />

      {/* Standalone Business Philosophy & Scale Section */}
      <section className="section business-vision-section">
        <div className="wrap business-vision-grid">
          <div className="business-vision-copy" data-aos="fade-right">
            <span className="eyebrow">Multidisciplinary Strength</span>
            <h2>Integrated scale across industry sectors.</h2>
            <p>
              From large-scale real-estate developments to international trade and academic institutions, the Bothra Group leverages cross-disciplinary expertise to deliver enduring impact.
            </p>
            <p>
              Each independent business operates with autonomous operational rigor while adhering to unified corporate governance and quality benchmarks.
            </p>
            <Button to="/about-us" variant="outline">Learn more about our heritage</Button>
          </div>
          <ParallaxRevealImage
            src="/tea-plantation-misty-hills.jpg"
            alt="Bothra Group agricultural and enterprise heritage"
            className="business-vision-image image-frame"
            parallaxStrength={60}
          >
            <span className="image-caption">ENDURING ENTERPRISE · DIVERSE DISCIPLINES</span>
          </ParallaxRevealImage>
        </div>
      </section>

      <ImageGallery />
    </>
  )
}