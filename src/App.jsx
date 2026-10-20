import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PageTransitionProvider } from './context/PageTransitionContext.jsx'
import SiteLayout from './components/layout/SiteLayout.jsx'

const HomePage = lazy(() => import('./pages/HomePage.jsx'))
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'))
const FoundersPage = lazy(() => import('./pages/FoundersPage.jsx'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage.jsx'))
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage.jsx'))
const BusinessesPage = lazy(() => import('./pages/BusinessesPage.jsx'))
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'))
const LegalPage = lazy(() => import('./pages/LegalPage.jsx'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'))

function App() {
  return (
    <BrowserRouter>
      <PageTransitionProvider>
        <SiteLayout>
          <Suspense fallback={<div className="route-loader" aria-label="Loading page" />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about-us" element={<AboutPage />} />
              <Route path="/about-us/founders" element={<FoundersPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/completed" element={<ProjectsPage initialStatus="Completed" />} />
              <Route path="/projects/ongoing" element={<ProjectsPage initialStatus="Ongoing" />} />
              <Route path="/projects/upcoming" element={<ProjectsPage initialStatus="Upcoming" />} />
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />
              <Route path="/other-businesses" element={<BusinessesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<LegalPage kind="privacy" />} />
              <Route path="/terms-of-use" element={<LegalPage kind="terms" />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </SiteLayout>
      </PageTransitionProvider>
    </BrowserRouter>
  )
}

export default App
