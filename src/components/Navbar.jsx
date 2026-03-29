import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const isActive = (path) => location.pathname === path

  return (
    <nav>
      <Link to="/" className="logo" onClick={closeMenu}>
        <img src="/images/iconwhite-nobg.png" className="logo-icon" alt="CherryStone" />
        CherryStone
      </Link>
      <button className="nav-toggle" aria-label="Menu" onClick={toggleMenu}>
        {isOpen ? '✕' : '☰'}
      </button>
      <div className={`nav-links${isOpen ? ' nav-open' : ''}`}>
        <Link to="/services" onClick={closeMenu} className={isActive('/services') ? 'nav-active' : ''}>What We Do</Link>
        <Link to="/references" onClick={closeMenu} className={isActive('/references') ? 'nav-active' : ''}>Collaborations</Link>
        <Link to="/about" onClick={closeMenu} className={isActive('/about') ? 'nav-active' : ''}>Our DNA</Link>
        <Link to="/biostone" onClick={closeMenu} className={isActive('/biostone') ? 'nav-active' : ''}>Biostone (Beta)</Link>
        <Link to="/contact" onClick={closeMenu} className={isActive('/contact') ? 'nav-active' : ''}>Contact</Link>
      </div>
    </nav>
  )
}
