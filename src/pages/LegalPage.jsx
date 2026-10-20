import PageHero from '../components/ui/PageHero.jsx'

export default function LegalPage({ kind }) {
  const privacy = kind === 'privacy'
  return <><PageHero eyebrow="Legal information" title={privacy ? 'Privacy policy.' : 'Terms of use.'} description="This page is a placeholder pending review and approval of the applicable legal terms." image="/dark-office-tower.jpg" /><section className="section"><div className="wrap legal-copy"><span className="eyebrow">Draft status</span><h2>{privacy ? 'Privacy information pending.' : 'Terms pending.'}</h2><p>{privacy ? 'No personal data is stored or sent to a backend by this frontend. The contact form prepares an email link in your own email application.' : 'These terms have not been reviewed or approved for publication. Do not rely on this placeholder as legal advice or as a final agreement.'}</p><p>Approved legal content should be added after review by the company’s authorized representative.</p></div></section></>
}