import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Footer({ footerText, contactLink = '/contact' }) {
  const [activeSpans, setActiveSpans] = useState({})

  const toggleSpan = (idx, e) => {
    e.stopPropagation()
    setActiveSpans(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  const defaultText = (
    <>
      <p>From scattered processes to structured clarity. We give growing businesses the visibility they need to lead with confidence.</p>
      <br />
      <Link to={contactLink}>Get in touch →</Link>
    </>
  )

  return (
    <footer className="footer-high">
      <div className="footer-grid">
        <div className="footer-manifesto">
          {['Identify.', 'Visualise.', 'Measure.'].map((word, idx) => (
            <span
              key={idx}
              className={activeSpans[idx] ? 'active' : ''}
              onClick={(e) => toggleSpan(idx, e)}
            >
              {word}
            </span>
          ))}
        </div>
        <div className="footer-details" style={{ textAlign: 'center' }}>
          <div className="footer-text">
            {footerText || defaultText}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div>&copy; 2026 CherryStone Business Services. All rights reserved. &trade;</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms &amp; Conditions</Link>
        </div>
      </div>
    </footer>
  )
}
