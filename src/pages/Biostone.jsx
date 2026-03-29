import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageWrapper from '../components/PageWrapper'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, RefreshCw, BarChart2, Shield, Users, Zap } from 'lucide-react'

const assessmentData = [
  {
    id: 'efficiency',
    title: 'Process Efficiency',
    icon: <Zap size={24} />,
    description: 'How standardized and repeatable are daily operations?',
    questions: [
      { id: 'eff_1', text: 'Standardization', low: 'Processes are "in people\'s heads" and vary by person.', high: 'All processes are documented in a central, accessible SOP library.' },
      { id: 'eff_2', text: 'Bottleneck Awareness', low: 'We only find issues when something breaks or fails.', high: 'We use real-time monitoring to identify and fix bottlenecks.' },
      { id: 'eff_3', text: 'Optimization', low: 'Processes rarely change once they are "set."', high: 'We have a monthly cadence for process review and improvement.' },
    ]
  },
  {
    id: 'tech',
    title: 'Technology Integration',
    icon: <RefreshCw size={24} />,
    description: 'How well do tools talk to each other and reduce manual labor?',
    questions: [
      { id: 'tech_1', text: 'Tool Silos', low: 'Data is manually copied/pasted between different apps.', high: 'All core systems are integrated via API or a central platform.' },
      { id: 'tech_2', text: 'Automation', low: 'Almost all administrative tasks are handled manually.', high: 'All repetitive tasks are automated.' },
      { id: 'tech_3', text: 'Tech Adoption', low: 'Employees struggle with or avoid using the current stack.', high: 'Technology is a competitive advantage and used by all teams.' },
    ]
  },
  {
    id: 'data',
    title: 'Data Governance',
    icon: <Shield size={24} />,
    description: 'Is data an asset or a liability?',
    questions: [
      { id: 'data_1', text: 'Data Quality', low: 'We often find duplicate or incorrect records in our system.', high: 'Data is cleaned, validated, and highly reliable.' },
      { id: 'data_2', text: 'Decision Making', low: 'We make decisions based on "gut feeling" or intuition.', high: 'We use real-time dashboards to drive all major business decisions.' },
      { id: 'data_3', text: 'Security / Compliance', low: 'No formal policy for data access or privacy.', high: 'Robust, audited controls for data access and regulatory compliance.' },
    ]
  },
  {
    id: 'team',
    title: 'Team Scalability',
    icon: <Users size={24} />,
    description: 'Can the business grow without the founder/CEO doing everything?',
    questions: [
      { id: 'team_1', text: 'Role Clarity', low: 'Everyone wears many hats; roles are blurry.', high: 'Every team member has a clear, measurable scorecard (KPIs).' },
      { id: 'team_2', text: 'Knowledge Transfer', low: 'If a key person leaves, the business would stall.', high: 'We have a "plug-and-play" onboarding system for new hires.' },
      { id: 'team_3', text: 'Delegation', low: 'Managers are involved in almost every micro-decision.', high: 'Teams are empowerd to make decisions within their domain.' },
    ]
  }
];

const getStatusLabel = (score) => {
  if (score >= 5.0) return 'Optimizing (Level 5)';
  if (score >= 4.0) return 'Quantitatively Managed (Level 4)';
  if (score >= 3.0) return 'Defined (Level 3)';
  if (score >= 2.0) return 'Managed (Level 2)';
  return 'Initial (Level 1)';
};

const getActionItems = (scores) => {
  const recommendations = {
    efficiency: {
      1: "Identify the top 3 most repetitive tasks and document them in a simple Word or Notion doc today.",
      2: "Create a central SOP (Standard Operating Procedure) Library. Ensure every team member knows where to find 'how-to' guides.",
      3: "Perform a 'Process Audit.' Identify one step in your core workflow that can be removed or simplified.",
      4: "Implement continuous feedback loops. Ask the people doing the work to suggest one process tweak every month."
    },
    tech: {
      1: "List all your software tools. Highlight any two tools where you are manually typing the same data into both.",
      2: "Research 'Bridge' software (like n8n, Zapier, or Make) to automate the data flow between your CRM and Project Management tools.",
      3: "Audit your current subscriptions. Consolidate 'Siloed' apps into a single platform or ensure they have a two-way API sync.",
      4: "Explore custom middleware or headless solutions to create a seamless, proprietary technology ecosystem."
    },
    data: {
      1: "Pick one key metric (e.g., Lead Conversion Rate) and ensure it is recorded the same way every time.",
      2: "Create a Data Dictionary. Define exactly what 'Active Customer' or 'Successful Project' means to avoid team confusion.",
      3: "Build a Real-Time Dashboard. Stop waiting for 'End of Month' reports; look at your health metrics daily.",
      4: "Implement automated data validation. Use scripts to catch and flag 'dirty data' before it reaches your reports."
    },
    team: {
      1: "Write a 'Stop Doing' list. Identify three tasks the founder/CEO does that could be handled by a junior or a tool.",
      2: "Build a Role-Based Scorecard. Each employee should have 2–3 numbers (KPIs) they are solely responsible for.",
      3: "Create a Decision Matrix. Define which decisions employees can make without asking for permission (e.g., spending up to $100).",
      4: "Implement OKR (Objectives and Key Results) frameworks to align team autonomy with high-level business goals."
    }
  };

  // Find bottom categories, sorting by lowest score
  const sortedScores = [...scores].sort((a, b) => a.score - b.score);
  
  // Give action items from the bottom 2 categories for focus
  const items = [];
  sortedScores.slice(0, 2).forEach((cat) => {
    let level = Math.floor(cat.score);
    if (level < 1) level = 1;
    if (level >= 4) level = 4; // Levels 4 and 5 share the "Optimizing" tier
    
    items.push({
      category: cat.title,
      icon: assessmentData.find(d => d.id === cat.category)?.icon,
      text: recommendations[cat.category][level]
    });
  });
  
  return items;
};

export default function Biostone() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Load from local storage
  useEffect(() => {
    document.title = 'Biostone Beta | CherryStone';
    const saved = localStorage.getItem('biostone_answers');
    if (saved) {
      setAnswers(JSON.parse(saved));
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem('biostone_answers', JSON.stringify(answers));
    }
  }, [answers]);

  const handleSelect = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const currentCategory = assessmentData[currentStep];
  
  // Check if current category is fully answered
  const isCurrentStepComplete = currentCategory?.questions.every(q => answers[q.id] !== undefined);

  const handleNext = () => {
    if (currentStep < assessmentData.length - 1) {
      setCurrentStep(curr => curr + 1);
      window.scrollTo(0, 0);
    } else {
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
      window.scrollTo(0, 0);
    }
  };

  const calculateMaturity = () => {
    const report = assessmentData.map(cat => {
      const catScores = cat.questions.map(q => answers[q.id] || 1);
      const average = catScores.reduce((a, b) => a + b, 0) / catScores.length;
      return {
        category: cat.id,
        title: cat.title,
        score: parseFloat(average.toFixed(1)),
        status: getStatusLabel(average),
        fullValue: 5
      };
    });
    return report;
  };

  const resetAssessment = () => {
    if(window.confirm("Are you sure you want to reset your progress?")) {
      setAnswers({});
      setIsSubmitted(false);
      setCurrentStep(0);
      localStorage.removeItem('biostone_answers');
    }
  };

  const reportData = isSubmitted ? calculateMaturity() : [];
  const actionItems = isSubmitted ? getActionItems(reportData) : [];
  
  // Calculate aggregate score
  const overallMaturity = isSubmitted 
    ? (reportData.reduce((acc, curr) => acc + curr.score, 0) / reportData.length).toFixed(1)
    : 0;

  return (
    <PageWrapper>
      <div className="page-content theme-red" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        
        <main className="biostone-main" style={{ flex: 1, paddingTop: '140px', paddingBottom: '80px' }}>
          <div className="container" style={{ maxWidth: '800px', textAlign: 'left' }}>
            
            <div className="biostone-header" style={{ marginBottom: '40px', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <span style={{ color: '#fff' }}>BIOSTONE</span>
                <span style={{ color: '#fff', opacity: 0.6 }}>|</span>
                <span style={{ color: '#fff' }}>BETA</span>
              </div>
              <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '15px' }}>Business Maturity Assessment</h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                Answer a few quick questions to visualize where your business stands on the Capability Maturity Model, and get actionable insights to level up.
              </p>
            </div>

            {!isSubmitted ? (
              <div className="biostone-card" style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '40px', position: 'relative' }}>
                
                {/* Stepper Progress */}
                <div className="stepper-indicator" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '15px', left: '0', width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }}></div>
                  <div style={{ position: 'absolute', top: '15px', left: '0', width: `${(currentStep / (assessmentData.length - 1)) * 100}%`, height: '2px', background: '#fff', zIndex: 0, transition: 'width 0.4s ease' }}></div>
                  
                  {assessmentData.map((step, idx) => (
                    <div key={idx} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <div style={{ 
                        width: '32px', height: '32px', borderRadius: '50%', 
                        background: idx <= currentStep ? '#fff' : '#1a1a1a',
                        color: idx <= currentStep ? '#D32F2F' : '#666',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '700', fontSize: '0.9rem',
                        border: `2px solid ${idx <= currentStep ? '#fff' : 'rgba(255,255,255,0.2)'}`,
                        transition: 'all 0.3s ease'
                      }}>
                        {idx < currentStep ? <CheckCircle2 size={16} /> : idx + 1}
                      </div>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: idx <= currentStep ? '#fff' : 'rgba(255,255,255,0.4)', display: 'none' }}>
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="step-content reveal active">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <div style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {currentCategory.icon}
                    </div>
                    <h2 style={{ fontSize: '1.8rem', color: '#fff', margin: 0 }}>{currentCategory.title}</h2>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '40px', fontSize: '1.05rem' }}>{currentCategory.description}</p>

                  <div className="questions-list" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    {currentCategory.questions.map((q, qIdx) => (
                      <div key={q.id} className="question-item">
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#fff', fontWeight: '600' }}>
                          <span style={{ opacity: 0.5, marginRight: '10px' }}>{qIdx + 1}.</span> 
                          {q.text}
                        </h3>
                        
                        <div className="likert-scale" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          <div className="likert-labels" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', padding: '0 10px' }}>
                            <span style={{ maxWidth: '40%' }}>1 - {q.low}</span>
                            <span style={{ maxWidth: '40%', textAlign: 'right' }}>5 - {q.high}</span>
                          </div>
                          
                          <div className="likert-options">
                            {[1, 2, 3, 4, 5].map(val => (
                              <button
                                key={val}
                                onClick={() => handleSelect(q.id, val)}
                                className={`likert-btn ${answers[q.id] === val ? 'selected' : ''}`}
                                style={{
                                  flex: 1,
                                  padding: '15px 0',
                                  background: answers[q.id] === val ? '#fff' : 'rgba(255,255,255,0.05)',
                                  color: answers[q.id] === val ? '#D32F2F' : '#fff',
                                  border: `1px solid ${answers[q.id] === val ? '#fff' : 'rgba(255,255,255,0.2)'}`,
                                  borderRadius: '6px',
                                  fontWeight: '700',
                                  fontSize: '1.1rem',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="step-actions" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <button 
                    onClick={handlePrev} 
                    style={{ visibility: currentStep === 0 ? 'hidden' : 'visible', background: 'transparent', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', cursor: 'pointer', opacity: 0.7 }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                  >
                    <ArrowLeft size={18} /> Previous
                  </button>
                  
                  <button 
                    onClick={handleNext}
                    disabled={!isCurrentStepComplete}
                    className="primary-btn"
                    style={{ 
                      background: isCurrentStepComplete ? '#fff' : 'rgba(255,255,255,0.1)', 
                      color: isCurrentStepComplete ? '#D32F2F' : 'rgba(255,255,255,0.3)', 
                      border: 'none', padding: '12px 30px', borderRadius: '4px', 
                      display: 'flex', alignItems: 'center', gap: '8px', 
                      fontSize: '1rem', fontWeight: '700', cursor: isCurrentStepComplete ? 'pointer' : 'not-allowed',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {currentStep === assessmentData.length - 1 ? 'Generate Report' : 'Next Category'} {currentStep !== assessmentData.length - 1 && <ArrowRight size={18} />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="report-dashboard reveal active" style={{ animation: 'reveal 0.6s ease forwards' }}>
                <div style={{ background: '#fff', color: '#080808', borderRadius: '12px', padding: '40px', marginBottom: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '40px', paddingBottom: '40px', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                      <BarChart2 size={36} color="#D32F2F" />
                      <h2 style={{ fontSize: '2.5rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.02em', color: '#D32F2F', textShadow: 'none' }}>Maturity Report</h2>
                    </div>
                    
                    <div style={{ fontSize: '4rem', fontWeight: '800', lineHeight: 1, marginBottom: '10px' }}>{overallMaturity}<span style={{ fontSize: '1.5rem', color: '#666', opacity: 0.5 }}>/5</span></div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#D32F2F' }}>
                      {getStatusLabel(overallMaturity)}
                    </div>
                  </div>

                  <div className="report-grid">
                    <div className="radar-chart-container" style={{ height: '350px', width: '100%', marginLeft: '-20px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={reportData}>
                          <PolarGrid stroke="rgba(0,0,0,0.1)" />
                          <PolarAngleAxis dataKey="title" tick={{ fill: '#333', fontSize: 13, fontWeight: 600 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#999', fontSize: 11 }} />
                          <Radar name="Score" dataKey="score" stroke="#D32F2F" strokeWidth={3} fill="#D32F2F" fillOpacity={0.4} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="score-breakdown">
                      <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', fontWeight: '800' }}>Score Breakdown</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {reportData.map(cat => (
                          <div key={cat.category} className="score-item">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <span style={{ fontWeight: '600', fontSize: '1rem' }}>{cat.title}</span>
                              <span style={{ fontWeight: '800', color: '#D32F2F' }}>{cat.score} <span style={{fontSize:'0.8rem', color:'#999'}}>{cat.status.split('(')[1].replace(')','')}</span></span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ width: `${(cat.score / 5) * 100}%`, height: '100%', background: '#D32F2F', borderRadius: '4px' }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="action-items-section" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '40px' }}>
                  <h3 style={{ fontSize: '1.8rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle2 color="#4CAF50" /> Suggested Action Items
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '30px' }}>Based on your lowest scoring categories, here are three things you can do this week to improve your operational maturity.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {actionItems.map((item, idx) => (
                      <div key={idx} className="action-item">
                        <div style={{ color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.1)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {item.icon}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1.1rem', marginBottom: '8px', color: '#D32F2F', fontWeight: '700' }}>{item.category} priority</h4>
                          <p style={{ fontSize: '1.05rem', lineHeight: 1.5 }}>{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ marginTop: '50px', textAlign: 'center', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button onClick={resetAssessment} style={{ background: 'transparent', color: 'rgba(255,255,255,0.6)', border: 'none', borderBottom: '1px dashed rgba(255,255,255,0.3)', padding: '0 0 5px 0', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.3s ease' }} onMouseEnter={(e) => {e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#fff'}} onMouseLeave={(e) => {e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}}>
                      Retake Assessment
                    </button>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </main>
      </div>
      <Footer />
    </PageWrapper>
  )
}
