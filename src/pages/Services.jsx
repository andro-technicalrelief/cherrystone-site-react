import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageWrapper from '../components/PageWrapper'
import Icon from '../components/Icon'
import useBgCanvas from '../hooks/useBgCanvas'
import useReveal from '../hooks/useReveal'

const PROCESS_STEPS = [
  { num: 1, iconName: 'target', title: 'Identify Outcomes', desc: 'Define exactly what success looks like before touching a single process.' },
  { num: 2, iconName: 'search', title: 'Identify Processes', desc: 'Map the step-by-step actions required to reach those outcomes.' },
  { num: 3, iconName: 'ruler', title: 'Establish Measurements', desc: 'Set clear metrics that alert you when performance deviates.' },
  { num: 4, iconName: 'chart', title: 'Measure Process', desc: 'Collect and review live data to track how processes perform.' },
  { num: 5, iconName: 'clipboard', title: 'Document', desc: 'Create a living reference that connects people, systems, and goals.' },
]

const CAPABILITIES = [
  { iconName: 'building', title: 'Process Architecture', desc: 'We design end-to-end process models that connect strategy to execution, giving leadership full operational visibility.' },
  { iconName: 'straightedge', title: 'Performance Measurement', desc: 'Every process gets KPIs and metrics — so you know instantly when something drifts from target.' },
  { iconName: 'folder', title: 'Knowledge Management', desc: 'We eliminate tribal knowledge by documenting every process, role, and decision pathway into structured frameworks.' },
  { iconName: 'loop', title: 'Continuous Improvement', desc: 'Our frameworks are designed to evolve. Built-in feedback loops ensure your processes improve as your business grows.' },
]

export default function Services() {
  const canvasRef = useBgCanvas(false)
  const revealRef = useReveal()

  useEffect(() => {
    document.title = 'What We Do | CherryStone'
  }, [])

  return (
    <PageWrapper theme="theme-green">
      <div className="page-content">
        <canvas id="bg-canvas" ref={canvasRef}></canvas>
        <Navbar />
        <main ref={revealRef}>
          {/* Hero */}
          <section className="container" style={{ alignItems: 'center' }}>
            <h1 className="hero-title reveal" style={{ textAlign: 'center' }}>WHAT WE DO</h1>
            <div className="section-divider reveal" style={{ transitionDelay: '0.1s' }}></div>
            <p className="reveal" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', textAlign: 'center', lineHeight: '1.6', transitionDelay: '0.15s' }}>
              We turn operational complexity into structured clarity — connecting your people, systems, and strategy into one measurable framework.
            </p>
          </section>

          {/* Our Process - Steps */}
          <section className="container" style={{ paddingTop: '40px', paddingBottom: '100px', alignItems: 'center' }}>
            <h2 className="reveal" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginBottom: '15px', textAlign: 'center' }}>Our Process</h2>
            <div className="section-divider"></div>
            <p className="reveal" style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)', maxWidth: '700px', lineHeight: '1.6', marginBottom: '50px', textAlign: 'center' }}>
              We map every business process from outcome to execution — creating a clear, measurable framework that
              connects people, systems, and objectives.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0', maxWidth: '400px', width: '100%' }}>
              {PROCESS_STEPS.map((step, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="reveal" style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '28px 32px',
                    width: '100%',
                    textAlign: 'center',
                    transitionDelay: `${0.1 * (i + 1)}s`,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  }}>
                    <div style={{ marginBottom: '8px' }}><Icon name={step.iconName} size={24} color="var(--primary-green)" /></div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '6px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-green)' }}>
                        {step.num}
                      </div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#222' }}>{step.title}</h3>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.5' }}>{step.desc}</p>
                  </div>
                  {i < PROCESS_STEPS.length - 1 && (
                    <div style={{ width: '2px', height: '24px', background: 'rgba(255,255,255,0.3)' }}></div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Bespoke Frameworks */}
          <section className="reveal" style={{ backgroundColor: 'var(--primary-green)', position: 'relative', zIndex: 2, paddingTop: '80px', paddingBottom: '60px' }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
              <h2 className="reveal" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: '1.1', marginBottom: '30px', letterSpacing: '-0.03em', textAlign: 'center' }}>
                Bespoke process frameworks, designed to let you focus on what matters.
              </h2>
              <p className="reveal" style={{ fontSize: '1.2rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.85)', fontWeight: '400', transitionDelay: '0.1s' }}>
                Every business operates differently. We work alongside your teams to craft process solutions that fit your reality — connecting people, systems, and strategy into one measurable framework.
              </p>
            </div>
          </section>

          {/* Capabilities Grid */}
          <section className="reveal" style={{ background: 'linear-gradient(180deg, var(--primary-green) 0%, #1a5c1f 100%)', padding: '80px 0 100px', position: 'relative', zIndex: 2 }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <h2 className="reveal" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginBottom: '15px', textAlign: 'center', color: 'white' }}>Our Capabilities</h2>
              <div className="section-divider"></div>
              <div className="capabilities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginTop: '40px' }}>
                {CAPABILITIES.map((cap, i) => (
                  <div key={i} className="reveal" style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '16px',
                    padding: '30px 24px',
                    textAlign: 'center',
                    backdropFilter: 'blur(8px)',
                    transitionDelay: `${0.1 * (i + 1)}s`,
                  }}>
                    <div style={{ marginBottom: '12px' }}><Icon name={cap.iconName} size={28} /></div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px', color: 'white' }}>{cap.title}</h3>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.8)' }}>{cap.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* The CherryStone Difference */}
          <section className="reveal" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)', padding: '100px 0', position: 'relative', zIndex: 2 }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
              <h2 className="reveal" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px', color: 'white' }}>
                The CherryStone Difference
              </h2>
              <div className="section-divider"></div>
              <p className="reveal" style={{ fontSize: '1.15rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.8)', marginBottom: '50px', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto', transitionDelay: '0.1s' }}>
                We don't just consult — we embed ourselves in your operations. Our team works shoulder-to-shoulder with yours
                to build frameworks that outlast our engagement. When we leave, your team owns the clarity.
              </p>

              <div className="difference-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
                {[
                  { iconName: 'target', title: 'Outcome-First Thinking', text: 'We start with where you want to be — then reverse-engineer the processes needed to get there.' },
                  { iconName: 'link', title: 'Connected Frameworks', text: 'People, systems, and data don\'t operate in isolation. Our models connect every layer into one picture.' },
                  { iconName: 'shield', title: 'Built to Last', text: 'We transfer full ownership of every framework, dashboard, and process map we create. It\'s yours.' },
                ].map((item, i) => (
                  <div key={i} className="reveal" style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    padding: '40px 28px',
                    textAlign: 'center',
                    transitionDelay: `${0.15 * (i + 1)}s`,
                  }}>
                    <div style={{ marginBottom: '16px' }}><Icon name={item.iconName} size={32} /></div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '12px', color: 'white' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'rgba(255,255,255,0.7)' }}>{item.text}</p>
                  </div>
                ))}
              </div>

              <p className="reveal" style={{ marginTop: '50px', fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', transitionDelay: '0.5s' }}>
                "The gap between where you are and where you want to be is a process problem — and process problems have structured solutions."
              </p>
            </div>
          </section>
        </main>
      </div>
      <Footer
        footerText={
          <>
            <p>Our services are based on <strong>dimensional modelling</strong>.
              An approach that clearly shows how people, systems and processes relate to the business
              objectives &amp; services.</p>
            <br />
            <Link to="/contact">Get in touch →</Link>
          </>
        }
      />
    </PageWrapper>
  )
}
