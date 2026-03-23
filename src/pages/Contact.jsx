import { useEffect, useState, useRef } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageWrapper from '../components/PageWrapper'
import useBgCanvas from '../hooks/useBgCanvas'
import useReveal from '../hooks/useReveal'

export default function Contact() {
  const canvasRef = useBgCanvas(false)
  const revealRef = useReveal()
  const [formState, setFormState] = useState('idle') // idle, sending, success, activation, error
  const formRef = useRef(null)

  useEffect(() => {
    document.title = 'Contact | CherryStone'
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormState('sending')

    const formData = new FormData(formRef.current)

    try {
      const response = await fetch('https://formsubmit.co/ajax/kirsteinzander@gmail.com', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      })
      const data = await response.json()

      if (data.success === 'false' || data.success === false) {
        setFormState('activation')
      } else if (data.success || data.ok || response.ok) {
        setFormState('success')
      } else {
        throw new Error('Form submission failed')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setFormState('error')
    }
  }

  const handleTextareaKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (window.innerWidth > 1024 || !('ontouchstart' in window)) {
        e.preventDefault()
        formRef.current?.querySelector('button[type="submit"]')?.click()
      }
    }
  }

  return (
    <PageWrapper>
      <div className="page-content">
        <canvas id="bg-canvas" ref={canvasRef}></canvas>
        <Navbar />
        <main ref={revealRef} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <section className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
            <h1 className="hero-title reveal" style={{ marginBottom: '20px', textAlign: 'center' }}>GET IN TOUCH</h1>
            <div className="reveal" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p style={{ fontSize: '1.5rem', maxWidth: '600px', color: 'var(--text-grey)', textAlign: 'center' }}>
                Ready to turn operational complexity into clarity? Let's start the conversation.
              </p>
              <div className="section-divider" style={{ marginTop: '30px' }}></div>

              <div id="contact-form-container" style={{ maxWidth: '600px', marginTop: '20px', width: '100%' }}>
                {formState !== 'success' && formState !== 'activation' && (
                  <form
                    ref={formRef}
                    id="contact-form"
                    onSubmit={handleSubmit}
                    className="contact-form"
                  >
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_subject" value="New Contact from CherryStone Website" />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
                      <div className="form-group">
                        <input type="text" name="Name" placeholder="First Name" required className="form-input" />
                      </div>
                      <div className="form-group">
                        <input type="text" name="Surname" placeholder="Last Name" required className="form-input" />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                      <input type="email" name="Email" placeholder="Email Address" required className="form-input" />
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                      <textarea
                        name="Message"
                        placeholder="Your Message"
                        rows="5"
                        required
                        className="form-input"
                        style={{ resize: 'vertical' }}
                        onKeyDown={handleTextareaKeyDown}
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="submit-btn logo"
                      style={{ display: 'inline-flex', padding: '15px 40px', fontSize: '1.1rem', borderColor: 'var(--primary-red)', cursor: 'pointer', background: 'transparent', color: 'white' }}
                      disabled={formState === 'sending'}
                    >
                      {formState === 'sending' ? 'Sending...' : formState === 'error' ? 'Error — Try Again' : 'Send Message →'}
                    </button>
                  </form>
                )}

                {formState === 'success' && (
                  <div style={{ padding: '40px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', textAlign: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
                    <div style={{ fontSize: '4rem', color: '#4CAF50', marginBottom: '20px' }}>✓</div>
                    <h2 style={{ marginBottom: '10px', fontSize: '1.8rem' }}>Email Received</h2>
                    <p style={{ color: 'var(--text-grey)', fontSize: '1.1rem' }}>Thank you for getting in touch. We will get back to you shortly.</p>
                  </div>
                )}

                {formState === 'activation' && (
                  <div style={{ padding: '40px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', textAlign: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
                    <div style={{ fontSize: '4rem', color: '#ffeb3b', marginBottom: '20px' }}>!</div>
                    <h2 style={{ marginBottom: '10px', fontSize: '1.8rem' }}>Activation Required</h2>
                    <p style={{ color: 'var(--text-grey)', fontSize: '1.1rem' }}>
                      We've sent an activation link to the receiving email address.<br />
                      Please click it to activate this form, then try submitting again.
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      style={{ marginTop: '20px', padding: '10px 20px', background: 'transparent', color: 'white', border: '1px solid white', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </PageWrapper>
  )
}
