import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageWrapper from '../components/PageWrapper'
import Icon from '../components/Icon'
import useBgCanvas from '../hooks/useBgCanvas'
import useReveal from '../hooks/useReveal'

const VISIBILITY_ITEMS = [
  { label: 'Process Ownership', back: 'Assign clear accountability for every process — so nothing falls through the cracks.' },
  { label: 'Value Chain', back: 'Visualise the end-to-end flow from inputs to customer outcomes.' },
  { label: 'Org Structure', back: 'Align your organisational design with how work actually gets done.' },
  { label: 'Process Dictionary', back: 'A single source of truth that defines every process, its purpose, and its owner.' },
  { label: 'Process Maps', back: 'Step-by-step visual diagrams showing exactly how each process operates.' },
]

const MEASUREMENT_ITEMS = [
  { label: 'Process Measurement', back: 'Quantify how well each process performs against its intended outcome.' },
  { label: 'KPI Catalogue', back: 'A curated set of Key Performance Indicators tied directly to business objectives.' },
  { label: 'Metrics Catalogue', back: 'Granular data points that feed into KPIs and reveal process health.' },
  { label: 'Report Catalogue', back: 'Pre-built reports that surface the right insights to the right stakeholders.' },
  { label: 'System Catalogue', back: 'An inventory of all systems and tools that support your processes.' },
]

const IMPROVEMENT_ITEMS = [
  { label: 'Business Analysis', back: 'Deep-dive analysis to uncover inefficiencies, gaps, and growth opportunities.' },
  { label: 'Continuous Improvement', back: 'Built-in feedback loops that drive ongoing optimisation over time.' },
  { label: 'Process Visibility', back: 'Real-time dashboards that keep leadership informed and teams aligned.' },
  { label: 'Process Monitoring', back: 'Automated alerts when processes deviate from expected performance.' },
  { label: 'Process Automation', back: 'Identify and automate repetitive tasks to free up capacity for higher-value work.' },
]

function FlipCard({ label, back, borderStyle }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className={`vc-box-wrapper${flipped ? ' active-flip' : ''}`}
      onClick={() => setFlipped(f => !f)}
    >
      <div className="vc-box-inner">
        <div className={`vc-box`} style={{ borderRadius: '10px', border: borderStyle || '1px solid rgba(255,255,255,0.15)' }}>
          {label}
        </div>
        <div className="vc-box-back" style={{ borderRadius: '10px' }}>
          {back}
        </div>
      </div>
    </div>
  )
}

export default function About() {
  const canvasRef = useBgCanvas(false)
  const revealRef = useReveal()

  useEffect(() => {
    document.title = 'Our DNA | CherryStone'
  }, [])

  return (
    <PageWrapper theme="theme-red">
      <div className="page-content">
        <canvas id="bg-canvas" ref={canvasRef}></canvas>
        <Navbar />
        <main ref={revealRef}>
          <section className="container">
            {/* Title */}
            <div className="reveal" style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h1 className="hero-title">OUR DNA</h1>
            </div>

            {/* Text blocks stacked */}
            <div className="reveal" style={{ maxWidth: '700px', margin: '0 auto 40px', textAlign: 'center' }}>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-grey)', lineHeight: '1.7', marginBottom: '16px' }}>
                We help small &amp; medium companies understand &amp; manage their business by <strong>visualising &amp; measuring</strong> their processes.
              </p>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-grey)', lineHeight: '1.7' }}>
                Being outcomes oriented, we reverse-engineer all processes from desired outcomes.
              </p>
            </div>
          </section>

          <section className="container reveal vc-section" style={{ paddingTop: '60px', marginBottom: '100px', position: 'relative' }}>
            <div className="dna-graph-area">
              {/* Graph with axes — Y labels outside, then chart */}
              <div className="dna-graph-row">
                {/* Y-axis labels — outside the graph */}
                <div className="dna-y-labels">
                  <span>MAX</span>
                  <span>MID</span>
                  <span>MIN</span>
                </div>
                {/* Chart area */}
                <div style={{ flex: 1 }}>
                  <svg viewBox="0 0 1000 300" className="graph-line" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
                    {/* Y-axis */}
                    <line x1="0" y1="10" x2="0" y2="280" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                    {/* X-axis */}
                    <line x1="0" y1="280" x2="1000" y2="280" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                    {/* Horizontal grid lines */}
                    <line x1="0" y1="10" x2="1000" y2="10" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    <line x1="0" y1="145" x2="1000" y2="145" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    {/* Data curve */}
                    <path d="M0 270 C 100 270, 200 240, 300 180 S 500 30, 700 45 S 900 60, 1000 20" stroke="white" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              {/* X-axis labels */}
              <div className="dna-x-labels">
                <span>Scattered</span>
                <span>Modelled</span>
                <span>Structured</span>
              </div>

              <div className="dna-vca-banner">
                Value Chain Architecture
              </div>

              {/* Central Flow — The Core Process */}
              <div className="dna-flow-container">
                {[
                  { label: 'Identify Outcomes', desc: 'Define what success looks like', bg: 'linear-gradient(135deg, #4a1e1e, #6b2c2c)', iconName: 'target', light: true },
                  { label: 'Identify Processes', desc: 'Map actions that produce results', bg: 'linear-gradient(135deg, #7c3131, #a04040)', iconName: 'search', light: true },
                  { label: 'Establish Measurements', desc: 'Create data points for tracking', bg: 'linear-gradient(135deg, #c46b6b, #d08a8a)', iconName: 'ruler', light: false },
                  { label: 'Measure Process', desc: 'Collect performance data in real-time', bg: 'linear-gradient(135deg, #e0acac, #edc4c4)', iconName: 'chart', light: false },
                  { label: 'Manage Process', desc: 'Lead with data-driven decisions', bg: 'linear-gradient(135deg, #f5dede, #fdf2f2)', iconName: 'gear', light: false },
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="dna-flow-card" style={{
                      background: step.bg,
                      color: step.light ? 'white' : '#4a1e1e',
                    }}>
                      <div style={{ marginBottom: '8px' }}><Icon name={step.iconName} size={28} color={step.light ? 'white' : '#4a1e1e'} /></div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>{step.label}</div>
                      <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{step.desc}</div>
                    </div>
                    {i < 4 && (
                      <div className="dna-flow-connector"></div>
                    )}
                  </div>
                ))}

                <div className="dna-flow-result">
                  <div style={{ marginBottom: '8px' }}><Icon name="user" size={32} color="var(--primary-red)" /></div>
                  Quantified Process
                </div>
              </div>

              {/* Supporting Capabilities — 3 Category Grid with Flip Cards */}
              <div className="dna-capabilities-grid">
                {/* Visibility */}
                <div className="dna-capability-card">
                  <div style={{ textAlign: 'center', marginBottom: '6px' }}><Icon name="eye" size={28} /></div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, textAlign: 'center', marginBottom: '20px', color: 'white' }}>Visibility</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {VISIBILITY_ITEMS.map((item, i) => (
                      <FlipCard key={i} label={item.label} back={item.back} borderStyle="1px solid rgba(255,255,255,0.15)" />
                    ))}
                  </div>
                </div>

                {/* Measurement */}
                <div className="dna-capability-card">
                  <div style={{ textAlign: 'center', marginBottom: '6px' }}><Icon name="straightedge" size={28} /></div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, textAlign: 'center', marginBottom: '20px', color: 'white' }}>Measurement</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {MEASUREMENT_ITEMS.map((item, i) => (
                      <FlipCard key={i} label={item.label} back={item.back} borderStyle="1px dashed rgba(255,255,255,0.2)" />
                    ))}
                  </div>
                </div>

                {/* Improvement */}
                <div className="dna-capability-card">
                  <div style={{ textAlign: 'center', marginBottom: '6px' }}><Icon name="loop" size={28} /></div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, textAlign: 'center', marginBottom: '20px', color: 'white' }}>Improvement</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {IMPROVEMENT_ITEMS.map((item, i) => (
                      <FlipCard key={i} label={item.label} back={item.back} borderStyle="1px solid rgba(255,255,255,0.15)" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why It Matters Section */}
          <section className="container reveal" style={{ paddingTop: '80px', paddingBottom: '100px', position: 'relative' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
              <h2 className="reveal" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px', color: 'white' }}>
                Why It Matters
              </h2>
              <div className="section-divider"></div>
              <p className="reveal" style={{ fontSize: '1.15rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.85)', marginBottom: '30px', transitionDelay: '0.1s' }}>
                Most organisations operate with processes that have evolved organically — shaped by habit rather than design. 
                When growth accelerates, these invisible structures become bottlenecks. Teams duplicate effort, knowledge stays 
                locked in individual heads, and leadership loses sight of what's actually happening on the ground.
              </p>
              <p className="reveal" style={{ fontSize: '1.15rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.85)', marginBottom: '30px', transitionDelay: '0.2s' }}>
                Our Value Chain Architecture changes this dynamic. By making every process visible, measurable, and owned, 
                we give you the operating system your business needs to scale with confidence. You stop reacting to problems 
                and start predicting them.
              </p>

              <div className="dna-why-grid">
                {[
                  { iconName: 'microscope', title: 'Diagnose', text: 'We identify where tribal knowledge and undocumented processes are limiting growth.' },
                  { iconName: 'map', title: 'Map', text: 'Every critical process is visually mapped, measured, and assigned ownership.' },
                  { iconName: 'trending', title: 'Scale', text: 'With clarity comes control — enabling confident decisions that drive measurable growth.' },
                ].map((item, i) => (
                  <div key={i} className="reveal dna-why-card" style={{
                    transitionDelay: `${0.1 * (i + 3)}s`,
                  }}>
                    <div style={{ marginBottom: '12px' }}><Icon name={item.iconName} size={30} /></div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: 'white' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.75)' }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </PageWrapper>
  )
}
