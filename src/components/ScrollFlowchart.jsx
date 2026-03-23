import { useState, useEffect, useRef } from 'react'
import Icon from './Icon'
import './ScrollFlowchart.css'

const STEPS = [
  {
    iconName: 'search',
    title: 'Discover',
    desc: 'We start by understanding your business from the inside out — mapping the outcomes you need, the people who drive them, and the systems that support them.',
  },
  {
    iconName: 'map',
    title: 'Map',
    desc: 'Every process is visually documented — from high-level value chains to granular task flows. Nothing stays hidden in tribal knowledge.',
  },
  {
    iconName: 'ruler',
    title: 'Measure',
    desc: 'We establish clear KPIs and metrics for every mapped process, giving you real-time visibility into what\'s working and what isn\'t.',
  },
  {
    iconName: 'clipboard',
    title: 'Document',
    desc: 'Processes, ownership, and measurements are compiled into living frameworks — your single source of operational truth.',
  },
  {
    iconName: 'gear',
    title: 'Manage',
    desc: 'With full visibility and measurement in place, you move from reactive firefighting to proactive, data-driven process management.',
  },
]

export default function ScrollFlowchart() {
  const [activeStep, setActiveStep] = useState(-1)
  const stepRefs = useRef([])

  useEffect(() => {
    const observers = []

    stepRefs.current.forEach((el, i) => {
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveStep(i)
          }
        },
        { threshold: 0.5 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach(obs => obs.disconnect())
  }, [])

  return (
    <div className="scroll-flowchart">
      {STEPS.map((step, i) => (
        <div
          key={i}
          ref={el => stepRefs.current[i] = el}
          className={`flowchart-step ${i === activeStep ? 'in-view' : ''}`}
        >
          <div className="flowchart-step-inner">
            <div className="flowchart-step-num">{i + 1} / {STEPS.length}</div>
            <span className="flowchart-icon"><Icon name={step.iconName} size={36} color="white" /></span>
            <h2 className="flowchart-step-title">{step.title}</h2>
            <p className="flowchart-step-desc">{step.desc}</p>
          </div>
          {i < STEPS.length - 1 && (
            <div className="flowchart-step-connector">
              <span /><span /><span /><span />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
