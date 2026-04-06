import { useState, useCallback, useRef, useEffect } from "react";
import {
  LineChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer
} from "recharts";
import { supabase } from "../lib/supabase";
import { LogOut, User, Plus, Trash2, Save, Loader2, Mail, Lock, Building, ArrowRight, ShieldCheck } from "lucide-react";


// ============================================================
// DATA — All embedded questions, guidance, and dimensions
// ============================================================

const DIMENSIONS = [
  { num: 1, name: "Process Knowledge", key: "Process Knowledge" },
  { num: 2, name: "Process Ownership", key: "Process Ownership" },
  { num: 3, name: "Process Effectiveness", key: "Process Effectiveness" },
  { num: 4, name: "Performance Metric Alignment", key: "Performance Metric Alignment" },
  { num: 5, name: "Organisation Enablement", key: "Organisation Enablement" },
  { num: 6, name: "Technology Enablement", key: "Technology Enablement" }
];

const UNIVERSAL_QUESTIONS = {
  "1.1": "Are your core business processes formally documented and accessible to all stakeholders?",
  "1.2": "Do employees understand how their individual tasks connect to end-to-end process flows?",
  "1.3": "Is there a centralised repository (e.g., process maps, SOPs) that is regularly maintained?",
  "1.4": "Are process dependencies, handoffs, and escalation paths clearly defined and communicated?",
  "2.1": "Is there a clearly designated owner for each core business process?",
  "2.2": "Do process owners have the authority and accountability to drive changes and improvements?",
  "2.3": "Are RACI matrices or equivalent frameworks used to define roles within processes?",
  "2.4": "Is there a formal governance structure that reviews process performance and ownership regularly?",
  "3.1": "Are your processes delivering the intended outcomes consistently and predictably?",
  "3.2": "Is there a mechanism to identify and eliminate process bottlenecks and waste?",
  "3.3": "Are cycle times, error rates, and rework rates tracked and actively managed?",
  "3.4": "Do your processes adapt quickly when business requirements or external conditions change?",
  "4.1": "Are KPIs and metrics directly linked to strategic business objectives?",
  "4.2": "Do process metrics provide actionable insights that drive decision-making?",
  "4.3": "Are leading indicators used alongside lagging indicators to anticipate process issues?",
  "4.4": "Is there a balanced scorecard or similar framework that aligns metrics across departments?",
  "5.1": "Does the organisational structure support efficient process execution without silos?",
  "5.2": "Is there a culture of continuous improvement (e.g., Kaizen, PDCA) embedded in the organisation?",
  "5.3": "Are employees trained and empowered to identify process issues and suggest improvements?",
  "5.4": "Is change management formally integrated into process improvement initiatives?",
  "6.1": "Are your technology platforms aligned with and supportive of core business processes?",
  "6.2": "Is process automation applied where it can reduce manual effort and human error?",
  "6.3": "Do your systems provide real-time data and analytics to monitor process performance?",
  "6.4": "Is there a technology roadmap that prioritises process improvement investments?"
};

const INDUSTRY_QUESTIONS = {
  "Learning": {
    "Process Knowledge_Q1": "Are instructional design methodologies (e.g., ADDIE, SAM) documented and consistently followed?",
    "Process Knowledge_Q2": "Is there a learning taxonomy (e.g., Bloom's) used to structure curriculum development processes?",
    "Process Knowledge_Q3": "Are learner journey maps created to visualise the end-to-end learning experience?",
    "Process Knowledge_Q4": "Do subject matter experts follow a structured knowledge transfer process for content creation?",
    "Process Ownership_Q1": "Is there a dedicated Learning & Development process owner with cross-functional authority?",
    "Process Ownership_Q2": "Are curriculum review committees established with clear mandates and meeting cadences?",
    "Process Ownership_Q3": "Do facilitators and instructional designers have defined ownership of content lifecycle stages?",
    "Process Ownership_Q4": "Is there a governance model for managing learning technology platform decisions?",
    "Process Effectiveness_Q1": "Are learning outcomes measured using Kirkpatrick's four levels of evaluation?",
    "Process Effectiveness_Q2": "Is the content development-to-deployment cycle time tracked and optimised?",
    "Process Effectiveness_Q3": "Are learner completion rates, assessment pass rates, and feedback scores actively managed?",
    "Process Effectiveness_Q4": "Do you apply rapid prototyping or agile methods to iterate on learning content quickly?",
    "Performance Metric Alignment_Q1": "Are learning metrics tied to business performance outcomes (e.g., productivity, retention)?",
    "Performance Metric Alignment_Q2": "Do you track ROI on learning programmes using standardised measurement frameworks?",
    "Performance Metric Alignment_Q3": "Are skill gap analyses used to align training priorities with workforce planning?",
    "Performance Metric Alignment_Q4": "Is learning data integrated with HR analytics to measure talent development impact?",
    "Organisation Enablement_Q1": "Is a learning culture actively promoted through leadership sponsorship and incentives?",
    "Organisation Enablement_Q2": "Are communities of practice or peer learning networks established across the organisation?",
    "Organisation Enablement_Q3": "Is there a formal mentorship or coaching programme integrated with learning pathways?",
    "Organisation Enablement_Q4": "Are employees given dedicated time and resources for professional development?",
    "Technology Enablement_Q1": "Is your LMS/LXP integrated with HR systems for seamless learner data flow?",
    "Technology Enablement_Q2": "Are adaptive learning technologies used to personalise learning experiences?",
    "Technology Enablement_Q3": "Do you leverage AI or analytics to recommend content and predict learning needs?",
    "Technology Enablement_Q4": "Is there a microlearning or mobile-first strategy for just-in-time knowledge delivery?"
  },
  "Finance": {
    "Process Knowledge_Q1": "Are financial close processes (month-end, quarter-end) mapped with detailed sub-process steps?",
    "Process Knowledge_Q2": "Is there a documented chart of accounts with clear classification guidelines?",
    "Process Knowledge_Q3": "Are regulatory compliance requirements (e.g., IFRS, SOX) embedded into process documentation?",
    "Process Knowledge_Q4": "Do finance teams have documented intercompany reconciliation and elimination procedures?",
    "Process Ownership_Q1": "Is there a designated controller or process owner for each financial reporting cycle?",
    "Process Ownership_Q2": "Are treasury, AP, AR, and GL processes owned by specific individuals with clear mandates?",
    "Process Ownership_Q3": "Is there a finance transformation office that oversees process standardisation?",
    "Process Ownership_Q4": "Do process owners conduct formal post-close reviews to identify improvement opportunities?",
    "Process Effectiveness_Q1": "Is the financial close completed within target timelines (e.g., 5-day close)?",
    "Process Effectiveness_Q2": "Are journal entry error rates and adjustment volumes tracked and reduced over time?",
    "Process Effectiveness_Q3": "Is straight-through processing (STP) measured for AP/AR transaction flows?",
    "Process Effectiveness_Q4": "Are variance analysis and exception handling processes automated and efficient?",
    "Performance Metric Alignment_Q1": "Are finance KPIs aligned with enterprise value drivers (e.g., DSO, DPO, working capital)?",
    "Performance Metric Alignment_Q2": "Is cost-to-serve measured for core finance functions (e.g., cost per invoice, cost per payment)?",
    "Performance Metric Alignment_Q3": "Are financial planning accuracy metrics (forecast vs. actual) tracked and improved?",
    "Performance Metric Alignment_Q4": "Do finance dashboards provide real-time visibility into cash flow and liquidity positions?",
    "Organisation Enablement_Q1": "Is a shared services or centre of excellence model used for transactional finance processes?",
    "Organisation Enablement_Q2": "Are finance business partners embedded in operational teams to drive decision support?",
    "Organisation Enablement_Q3": "Is there a structured finance talent development programme with rotation opportunities?",
    "Organisation Enablement_Q4": "Are three lines of defence (operations, risk, audit) clearly defined and operational?",
    "Technology Enablement_Q1": "Is robotic process automation (RPA) deployed for high-volume, rule-based finance tasks?",
    "Technology Enablement_Q2": "Are ERP systems configured to enforce financial controls and segregation of duties?",
    "Technology Enablement_Q3": "Is advanced analytics or AI used for fraud detection, forecasting, or anomaly identification?",
    "Technology Enablement_Q4": "Is there a finance technology roadmap that includes cloud migration and API integration?"
  },
  "Supply Chain": {
    "Process Knowledge_Q1": "Are end-to-end supply chain processes (Plan, Source, Make, Deliver, Return) mapped using SCOR?",
    "Process Knowledge_Q2": "Is there a documented value stream map identifying waste (Muda) across the supply chain?",
    "Process Knowledge_Q3": "Are supplier qualification and onboarding processes standardised and documented?",
    "Process Knowledge_Q4": "Do logistics and warehousing teams follow documented standard work instructions?",
    "Process Ownership_Q1": "Is there an end-to-end supply chain process owner with cross-functional authority?",
    "Process Ownership_Q2": "Are S&OP (Sales & Operations Planning) meetings chaired by a designated process owner?",
    "Process Ownership_Q3": "Do category managers own supplier relationship and procurement process outcomes?",
    "Process Ownership_Q4": "Is there a formal governance structure for supply chain risk management?",
    "Process Effectiveness_Q1": "Are Lean principles (5S, Kanban, pull systems) actively applied to reduce waste?",
    "Process Effectiveness_Q2": "Is Overall Equipment Effectiveness (OEE) tracked and used to drive manufacturing improvements?",
    "Process Effectiveness_Q3": "Are order-to-delivery cycle times benchmarked against industry standards?",
    "Process Effectiveness_Q4": "Is Six Sigma (DMAIC) methodology used to reduce process variation and defects?",
    "Performance Metric Alignment_Q1": "Are SCOR metrics (Perfect Order, Cash-to-Cash, Supply Chain Cost) used as primary KPIs?",
    "Performance Metric Alignment_Q2": "Is inventory performance measured using turns, GMROI, and days of supply?",
    "Performance Metric Alignment_Q3": "Are supplier scorecards aligned with total cost of ownership (TCO) principles?",
    "Performance Metric Alignment_Q4": "Is demand forecast accuracy measured and used to improve planning processes?",
    "Organisation Enablement_Q1": "Is a continuous improvement (CI) culture embedded with formal Kaizen event programmes?",
    "Organisation Enablement_Q2": "Are cross-functional teams used for supply chain problem-solving (e.g., A3 thinking)?",
    "Organisation Enablement_Q3": "Is there a formal supply chain talent development programme with Lean/Six Sigma certification?",
    "Organisation Enablement_Q4": "Are supplier development programmes in place to build strategic partner capabilities?",
    "Technology Enablement_Q1": "Is an integrated supply chain planning platform (e.g., IBP, APS) deployed and adopted?",
    "Technology Enablement_Q2": "Are IoT sensors and real-time tracking used for inventory and logistics visibility?",
    "Technology Enablement_Q3": "Is predictive analytics applied for demand sensing and supply chain risk mitigation?",
    "Technology Enablement_Q4": "Are digital twin or simulation technologies used for supply chain scenario planning?"
  },
  "Software Development": {
    "Process Knowledge_Q1": "Are SDLC processes (Agile, Scrum, Kanban) documented with clear ceremonies and artifacts?",
    "Process Knowledge_Q2": "Is there a documented Definition of Done (DoD) and Definition of Ready (DoR) for all teams?",
    "Process Knowledge_Q3": "Are CI/CD pipeline processes documented with clear stage gates and quality checks?",
    "Process Knowledge_Q4": "Is the incident management and post-mortem process standardised across all teams?",
    "Process Ownership_Q1": "Are Product Owners empowered with clear accountability for backlog prioritisation and delivery?",
    "Process Ownership_Q2": "Is there a designated Engineering Manager or Tech Lead who owns development process quality?",
    "Process Ownership_Q3": "Are Scrum Masters or Agile Coaches accountable for continuous process improvement?",
    "Process Ownership_Q4": "Is there a platform or DevOps team that owns the toolchain and infrastructure processes?",
    "Process Effectiveness_Q1": "Are sprint velocity, lead time, and cycle time tracked to measure delivery predictability?",
    "Process Effectiveness_Q2": "Is the deployment frequency and change failure rate measured (DORA metrics)?",
    "Process Effectiveness_Q3": "Are code review turnaround times and merge-to-deploy durations actively optimised?",
    "Process Effectiveness_Q4": "Is technical debt quantified and managed through a structured reduction programme?",
    "Performance Metric Alignment_Q1": "Are engineering metrics (DORA, SPACE) aligned with product and business objectives?",
    "Performance Metric Alignment_Q2": "Is customer-facing quality measured through error rates, uptime SLAs, and NPS feedback?",
    "Performance Metric Alignment_Q3": "Are team health and developer experience metrics tracked alongside delivery metrics?",
    "Performance Metric Alignment_Q4": "Is there a balanced metrics framework that avoids optimising for speed at the expense of quality?",
    "Organisation Enablement_Q1": "Is a DevOps culture actively fostered with shared ownership between Dev and Ops teams?",
    "Organisation Enablement_Q2": "Are engineering guilds or chapters used to share knowledge and standardise practices?",
    "Organisation Enablement_Q3": "Is there a structured onboarding programme that accelerates new developer productivity?",
    "Organisation Enablement_Q4": "Are retrospectives consistently conducted and action items tracked to completion?",
    "Technology Enablement_Q1": "Is Infrastructure as Code (IaC) used for environment provisioning and configuration?",
    "Technology Enablement_Q2": "Are automated testing frameworks (unit, integration, E2E) embedded in the CI/CD pipeline?",
    "Technology Enablement_Q3": "Is observability (logging, tracing, metrics) implemented for production systems?",
    "Technology Enablement_Q4": "Are feature flags and progressive delivery mechanisms used for controlled releases?"
  }
};

const GUIDANCE = {
  "Process Knowledge": {
    1: "Critical gap: No formal process documentation exists. Immediate action: Conduct process discovery workshops with key stakeholders. Map your top 5 core processes using swim-lane diagrams. Engage Cherrystone to facilitate structured process mapping sessions.",
    2: "Developing: Some informal documentation exists but is incomplete. Next step: Prioritise documenting high-impact processes. Create a centralised digital repository (e.g., Confluence, SharePoint). Standardise templates for process maps and SOPs.",
    3: "Defined: Documentation exists but may be outdated or inconsistently used. Next step: Implement a review cycle (quarterly) for all process documents. Assign document owners. Integrate process maps into onboarding and training programmes.",
    4: "Managed: Strong documentation with regular updates. Next step: Enhance with process simulation and scenario modelling. Link process documentation to performance dashboards. Explore process mining to validate documented vs. actual flows.",
    5: "Optimised: World-class process knowledge management. Maintain through continuous process mining, AI-driven documentation updates, and cross-functional knowledge sharing. Benchmark against industry leaders."
  },
  "Process Ownership": {
    1: "Critical gap: No clear process ownership. Immediate action: Identify and appoint process owners for top 5 critical processes. Define RACI matrices. Establish executive sponsorship for process governance.",
    2: "Developing: Informal ownership exists but lacks authority. Next step: Formalise process owner roles with documented responsibilities. Include process KPIs in owner performance reviews. Create escalation paths.",
    3: "Defined: Ownership is assigned but governance is inconsistent. Next step: Implement a Process Governance Board with regular review cadence. Empower owners with budget and decision-making authority. Establish cross-functional process councils.",
    4: "Managed: Strong ownership with active governance. Next step: Introduce process maturity assessments led by owners. Implement peer benchmarking across process domains. Develop succession planning for process owners.",
    5: "Optimised: Exemplary process governance. Maintain through advanced governance frameworks, process owner communities of practice, and continuous leadership development in process management."
  },
  "Process Effectiveness": {
    1: "Critical gap: Processes are ad hoc with unpredictable outcomes. Immediate action: Identify the top 3 processes with highest failure/rework rates. Conduct root cause analysis (5 Whys, Fishbone). Establish baseline performance measurements.",
    2: "Developing: Some processes are managed but bottlenecks persist. Next step: Implement process performance dashboards. Apply Lean waste elimination to reduce non-value-adding steps. Standardise handoff procedures between teams.",
    3: "Defined: Processes are mostly effective but lack consistency. Next step: Introduce statistical process control for critical processes. Implement formal continuous improvement cycles (PDCA). Benchmark against industry standards.",
    4: "Managed: Processes are highly effective with proactive management. Next step: Apply advanced analytics to predict process failures. Implement intelligent automation for complex decision points. Pursue process excellence certifications.",
    5: "Optimised: Best-in-class process effectiveness. Maintain through predictive process analytics, AI-driven optimisation, and regular innovation sprints to reimagine existing processes."
  },
  "Performance Metric Alignment": {
    1: "Critical gap: No meaningful process metrics exist. Immediate action: Define 3-5 KPIs for each core process linked to strategic objectives. Implement basic data collection mechanisms. Create a simple scorecard framework.",
    2: "Developing: Metrics exist but are disconnected from strategy. Next step: Map each metric to specific strategic objectives. Introduce leading indicators alongside lagging measures. Establish regular metric review meetings.",
    3: "Defined: Metrics are aligned but insights are not actionable. Next step: Implement a balanced scorecard framework. Create real-time dashboards with drill-down capability. Train managers on data-driven decision-making.",
    4: "Managed: Strong metric alignment with actionable insights. Next step: Introduce predictive analytics and scenario modelling. Implement automated alerting for metric thresholds. Develop cross-functional metric correlation analysis.",
    5: "Optimised: World-class measurement and analytics. Maintain through AI-powered analytics, real-time predictive dashboards, and continuous refinement of metric frameworks based on business evolution."
  },
  "Organisation Enablement": {
    1: "Critical gap: Organisational structure hinders process execution. Immediate action: Assess current structure against process flows to identify silos. Initiate cross-functional collaboration forums. Begin change readiness assessment.",
    2: "Developing: Some cross-functional awareness but silos remain. Next step: Establish formal cross-functional process teams. Introduce continuous improvement training (Lean basics). Create internal communication channels for process improvement.",
    3: "Defined: Cross-functional collaboration is emerging. Next step: Embed continuous improvement methodologies into the organisational DNA. Develop internal process improvement certification programmes. Establish communities of practice.",
    4: "Managed: Strong organisational enablement with active CI culture. Next step: Implement innovation labs and process hackathons. Develop advanced change management capabilities. Create external benchmarking partnerships.",
    5: "Optimised: Truly process-centric organisation. Maintain through continuous organisational learning, advanced change management, and leadership programmes focused on process thinking and innovation."
  },
  "Technology Enablement": {
    1: "Critical gap: Technology is misaligned or absent for process support. Immediate action: Conduct a technology-process gap analysis. Identify quick-win automation opportunities. Develop a basic technology roadmap aligned with process priorities.",
    2: "Developing: Some technology supports processes but integration is poor. Next step: Prioritise system integration to eliminate data silos. Implement workflow automation for top manual processes. Evaluate cloud-based process management platforms.",
    3: "Defined: Technology supports processes but lacks advanced capabilities. Next step: Implement process mining tools to identify hidden inefficiencies. Deploy RPA for rule-based repetitive tasks. Integrate real-time analytics dashboards.",
    4: "Managed: Strong technology enablement with proactive investment. Next step: Explore AI/ML for predictive process optimisation. Implement digital twin technology for process simulation. Develop API-first architecture for process agility.",
    5: "Optimised: Cutting-edge technology-enabled processes. Maintain through continuous technology innovation, AI-driven process optimisation, and active participation in industry technology consortiums."
  }
};

const INDUSTRY_DIM_LABELS = {
  "Learning": [
    "Instructional Design Maturity",
    "Learning Governance",
    "Learning Outcomes & Evaluation",
    "Learning Analytics & ROI",
    "Learning Culture & Capability",
    "Learning Technology & Innovation"
  ],
  "Finance": [
    "Financial Process Maturity",
    "Financial Governance & Control",
    "Financial Operations Excellence",
    "Financial Performance Analytics",
    "Finance Organisation Capability",
    "Finance Technology & Automation"
  ],
  "Supply Chain": [
    "Supply Chain Process Maturity",
    "Supply Chain Governance",
    "Supply Chain Operational Excellence",
    "Supply Chain Performance Analytics",
    "Supply Chain Organisation Capability",
    "Supply Chain Technology & Innovation"
  ],
  "Software Development": [
    "SDLC Process Maturity",
    "Engineering Governance",
    "Delivery Effectiveness",
    "Engineering Analytics & Metrics",
    "Engineering Culture & Capability",
    "DevOps & Toolchain Maturity"
  ]
};

const INDUSTRIES = [
  { name: "Learning", desc: "L&D, EdTech, Training" },
  { name: "Finance", desc: "Financial Services, Accounting, Treasury" },
  { name: "Supply Chain", desc: "Logistics, Manufacturing, Procurement" },
  { name: "Software Development", desc: "Engineering, Product, DevOps" }
];

// ============================================================
// CALCULATION UTILITIES
// ============================================================

const getRating = (score) => {
  if (score === null || score === undefined) return { text: "—", cls: "bg-gray-100 text-gray-600" };
  if (score <= 1.5) return { text: "Not Started", cls: "bg-red-100 text-red-700" };
  if (score <= 2.5) return { text: "Initial", cls: "bg-orange-100 text-orange-700" };
  if (score <= 3.5) return { text: "Defined", cls: "bg-yellow-100 text-yellow-700" };
  if (score <= 4.5) return { text: "Managed", cls: "bg-green-100 text-green-700" };
  return { text: "Optimised", cls: "bg-green-200 text-green-800" };
};

const calcDimScores = (scoreObj) => {
  const universal = {}, industry = {};
  DIMENSIONS.forEach((dim) => {
    const u = [], i = [];
    for (let q = 1; q <= 4; q++) {
      const v = scoreObj[`${dim.num}.${q}`];
      if (v) u.push(v);
    }
    for (let q = 5; q <= 8; q++) {
      const v = scoreObj[`${dim.num}.${q}`];
      if (v) i.push(v);
    }
    universal[dim.key] = u.length > 0 ? parseFloat((u.reduce((a, b) => a + b, 0) / u.length).toFixed(1)) : null;
    industry[dim.key] = i.length > 0 ? parseFloat((i.reduce((a, b) => a + b, 0) / i.length).toFixed(1)) : null;
  });
  return { universal, industry };
};

const avgScores = (arr) => {
  const v = arr.filter((x) => x !== null && x !== undefined);
  return v.length > 0 ? parseFloat((v.reduce((a, b) => a + b, 0) / v.length).toFixed(1)) : null;
};

// ============================================================
// MAIN COMPONENT
// ============================================================

// ============================================================
// SUB-COMPONENTS (Defined Outside to Prevent Re-Render Focus Loss)
// ============================================================

const AuthView = ({ authMode, setAuthMode, email, setEmail, password, setPassword, fullName, setFullName, organisation, setOrganisation, authError, handleAuth, loading }) => (
  <div className="bg-white rounded-[2rem] shadow-2xl p-6 sm:p-12 w-full max-w-[480px] mx-auto border border-gray-100 my-8 sm:my-16 relative overflow-hidden flex flex-col transition-all duration-500 auth-view">
    <div className="absolute top-0 left-0 w-full h-1.5 bg-red-900 shrink-0"></div>
    
    <div className="flex justify-center mb-6 sm:mb-10 shrink-0">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-red-50 text-red-900 flex items-center justify-center shadow-lg shadow-red-900/5 transform hover:scale-110 hover:rotate-3 transition-all duration-500 border border-red-100">
        <Lock size={28} className="sm:w-8 sm:h-8" />
      </div>
    </div>
    
    <div className="text-center mb-8 sm:mb-12 shrink-0 auth-view-header">
      <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-2 sm:mb-3 tracking-tight">
        {authMode === "login" ? "Secure Portal" : "Intelligence Portal"}
      </h2>
      <p className="text-gray-400 text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.4em]">
        {authMode === "login" 
          ? "BIO-Stone Corporate Access" 
          : "Professional Excellence Framework"}
      </p>
    </div>

    <form onSubmit={handleAuth} className="space-y-5 flex-1 flex flex-col items-stretch">
      {authMode === "signup" && (
        <>
          <div className="relative group w-full">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-900 transition-colors pointer-events-none">
              <User size={18} />
            </div>
            <input
              type="text"
              placeholder="Primary Contact Full Name"
              className="w-full h-14 sm:h-16 pr-6 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-900/20 transition-all text-gray-900 placeholder-gray-400 font-medium text-sm"
              style={{ paddingLeft: '3.5rem' }}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>
          <div className="relative group w-full">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-900 transition-colors pointer-events-none">
              <Building size={18} />
            </div>
            <input
              type="text"
              placeholder="Corporate Organisation"
              className="w-full h-14 sm:h-16 pr-6 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-900/20 transition-all text-gray-900 placeholder-gray-400 font-medium text-sm"
              style={{ paddingLeft: '3.5rem' }}
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
              required
              autoComplete="organization"
            />
          </div>
        </>
      )}
      
      <div className="relative group w-full">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-900 transition-colors pointer-events-none">
          <Mail size={18} />
        </div>
        <input
          type="email"
          placeholder="Corporate Email Address"
          className="w-full h-14 sm:h-16 pr-6 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-900/20 transition-all text-gray-900 placeholder-gray-400 font-medium text-sm"
          style={{ paddingLeft: '3.5rem' }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      <div className="relative group w-full">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-900 transition-colors pointer-events-none">
          <ShieldCheck size={18} />
        </div>
        <input
          type="password"
          placeholder="Intelligence Vault Password"
          className="w-full h-14 sm:h-16 pr-6 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-900/20 transition-all text-gray-900 placeholder-gray-400 font-medium text-sm"
          style={{ paddingLeft: '3.5rem' }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete={authMode === "login" ? "current-password" : "new-password"}
        />
      </div>

      {authError && (
        <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-center border animate-in fade-in slide-in-from-top-2 duration-300 ${authError.toLowerCase().includes("check your email") ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-red-50 text-red-700 border-red-100"}`}>
          {authError}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-14 sm:h-16 bg-red-900 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[9px] sm:text-[10px] hover:bg-red-950 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-red-900/20 mt-2 sm:mt-4 group shrink-0"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : (
          <>
            <span>{authMode === "login" ? "Access Vault" : "Initialize Account"}</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>

    <div className="mt-12 pt-8 border-t border-gray-100 text-center shrink-0">
      <button
        onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
        className="text-[10px] font-black text-gray-400 hover:text-red-900 transition-colors uppercase tracking-[0.4em]"
      >
        {authMode === "login" ? "Request Access Privileges" : "Return to Main Portal"}
      </button>
    </div>
  </div>
);





const Header = ({ user, saving, selectedIndustry, saveToCloud, handleLogout }) => (
  <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm w-full flex justify-center">
    <div className="w-full max-w-[2000px] px-4 sm:px-6 md:px-12 h-16 sm:h-20 flex justify-between items-center">
      <div className="flex items-center gap-3 sm:gap-4">
        <a href="/" className="shrink-0 outline-none flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
          <img src="/images/icon-whitebg.png" className="w-6 h-6 sm:w-8 sm:h-8 object-contain" alt="CherryStone" />
          <span className="text-gray-900 font-bold text-lg sm:text-xl tracking-tight hidden xs:block">CherryStone</span>
        </a>
        <div className="h-4 w-px bg-gray-200 hidden md:block mx-1"></div>
        <div className="hidden md:block">
          <p className="text-[10px] text-red-900 font-black uppercase tracking-[0.3em] whitespace-nowrap">BIO-Stone Maturity Assessment</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {user ? (
          <>
            <div className="flex flex-col items-end mr-1 sm:mr-2">
              <span className="text-[10px] sm:text-xs font-bold text-gray-900 tracking-tight truncate max-w-[100px] sm:max-w-none">{user.user_metadata?.full_name || user.email}</span>
              <span className="text-[8px] sm:text-[9px] text-red-900 font-bold uppercase tracking-widest truncate max-w-[100px] sm:max-w-none">{user.user_metadata?.organisation || "Cherrystone Client"}</span>
            </div>
            <button
              onClick={saveToCloud}
              disabled={saving || !selectedIndustry}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-900 hover:text-white transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center border border-gray-200"
              title="Save Progress"
            >
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            </button>
            <div className="h-5 sm:h-6 w-px bg-gray-200"></div>
            <button
              onClick={handleLogout}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl text-gray-400 hover:text-white hover:bg-red-900 transition-all flex items-center justify-center border border-transparent"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <div className="text-[8px] sm:text-[9px] uppercase font-black text-gray-400 tracking-[0.2em] sm:tracking-[0.3em] px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-200 rounded-full bg-gray-50 outline-none">
            Digital Operations Ecosystem
          </div>
        )}
      </div>
    </div>
  </div>
);

const WelcomeTab = ({ user, authProps, navigateToTab }) => {
  if (!user) return (
    <div className="w-full flex items-center justify-center min-h-[60vh] px-6">
      <AuthView {...authProps} />
    </div>
  );

  return (
    <div className="w-full flex justify-center py-20 px-6">
      <div className="max-w-2xl w-full mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-red-50 text-red-900 rounded-full text-[11px] font-black tracking-widest uppercase mb-10 border border-red-100">
          ✓ Logged In
        </div>
        <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight leading-tight">
          Master Your <span className="font-black text-red-900">Process Maturity.</span>
        </h2>
        <p className="text-lg text-gray-500 mb-14 font-normal leading-relaxed max-w-xl mx-auto">
          Follow our structured methodology to transition from chaos to professional digital excellence.
        </p>

        <div className="flex flex-wrap gap-5 justify-center items-center">
          <button
            onClick={() => navigateToTab("my-assessments")}
            className="rounded-2xl bg-white text-gray-900 font-bold uppercase tracking-widest text-[11px] transition-all duration-200 hover:bg-gray-50 hover:shadow-md border-2 border-gray-200 shrink-0"
            style={{ padding: '16px 40px', minWidth: 'max-content' }}
          >
            View History
          </button>
          <button
            onClick={() => navigateToTab("industry")}
            className="rounded-2xl bg-red-900 text-white font-bold uppercase tracking-widest text-[11px] transition-all duration-200 hover:bg-red-950 active:scale-95 shadow-xl shadow-red-900/10 flex items-center gap-3 shrink-0"
            style={{ padding: '16px 40px', minWidth: 'max-content' }}
          >
            Begin Now <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Extracted to top-level
const MyAssessmentsTab = ({ assessments, startNew, loadAssessment, deleteAssessment }) => (
  <div className="w-full max-w-5xl mx-auto px-6 py-10">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 w-full">
      <div className="flex-1 min-w-0">
        <h2 className="text-3xl font-light text-gray-900 mb-1 tracking-tight">Your Assessments</h2>
        <p className="text-gray-500 text-sm">Select an existing assessment to continue, or start a new one.</p>
      </div>
      <button
        onClick={startNew}
        className="flex items-center gap-3 rounded-2xl bg-red-900 text-white font-bold uppercase tracking-widest text-[11px] hover:bg-red-950 shadow-lg shadow-red-900/10 transition-all active:scale-95 shrink-0"
        style={{ padding: '14px 28px', minWidth: 'max-content' }}
      >
        <Plus size={15} /> New Assessment
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assessments.map((a) => (
        <div
          key={a.id}
          onClick={() => loadAssessment(a)}
          className="group relative bg-white border border-gray-200 rounded-3xl p-6 cursor-pointer hover:border-red-900 hover:shadow-xl hover:shadow-red-900/5 transition-all duration-300"
        >
          <button
            onClick={(e) => deleteAssessment(a.id, e)}
            className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={16} />
          </button>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{a.name}</h3>
          <p className="text-sm text-gray-500 mb-4">{a.industry}</p>
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md tracking-wider ${
              a.status === 'post_complete' ? 'bg-green-100 text-green-700' : 
              a.status === 'pre_complete' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {a.status.replace('_', ' ')}
            </span>
            <span className="text-[10px] text-gray-400 font-medium italic">
              {new Date(a.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}

      {assessments.length === 0 && (
        <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 mb-4">No assessments found.</p>
          <button
            onClick={startNew}
            className="text-red-900 font-medium hover:underline flex items-center justify-center gap-1 mx-auto"
          >
            Start your first assessment <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  </div>
);



  // ============================================================
  // INDUSTRY TAB
  // ============================================================

// Extracted to top-level
const IndustryTab = ({ selectedIndustry, setSelectedIndustry, navigateToTab }) => (
  <div className="w-full max-w-4xl mx-auto px-8 py-12">
    <h2 className="text-3xl font-light text-gray-900 mb-2 tracking-tight">Select Your Industry</h2>
    <p className="text-gray-500 mb-8 font-normal text-base">
      Choose your industry to unlock tailored assessment questions for your sector.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
      {INDUSTRIES.map((ind) => (
        <div
          key={ind.name}
          onClick={() => setSelectedIndustry(ind.name)}
          className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 ${
            selectedIndustry === ind.name
              ? "border-2 border-red-900 bg-red-50 shadow-lg shadow-red-900/10"
              : "border-2 border-gray-200 bg-white hover:border-red-200 hover:shadow-md"
          }`}
          style={{ padding: '28px 28px' }}
        >
          {selectedIndustry === ind.name && (
            <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-red-900 text-white flex items-center justify-center text-xs font-black">
              ✓
            </div>
          )}
          <h3 className="text-red-900 font-bold text-base mb-1 pr-8">{ind.name}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{ind.desc}</p>
        </div>
      ))}
    </div>

    <div className="flex flex-wrap gap-6 justify-center w-full mt-8">
      <button
        onClick={() => navigateToTab("welcome")}
        className="rounded-2xl bg-gray-50 text-gray-900 font-bold uppercase tracking-widest text-[11px] transition-all duration-200 hover:bg-gray-100 shadow-sm border border-gray-200 shrink-0"
        style={{ padding: '16px 32px', minWidth: 'max-content' }}
      >
        Back
      </button>
      <button
        onClick={() => selectedIndustry && navigateToTab("pre-assessment")}
        disabled={!selectedIndustry}
        className={`rounded-2xl font-bold uppercase tracking-widest text-[11px] transition-all duration-200 shadow-xl shrink-0 ${
          selectedIndustry
            ? "bg-red-900 text-white hover:bg-red-950 active:scale-95 shadow-red-900/10"
            : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
        }`}
        style={{ padding: '16px 32px', minWidth: 'max-content' }}
      >
        Continue to Assessment
      </button>
    </div>
  </div>
);


  // ============================================================
  // ASSESSMENT TAB (Pre/Post)
  // ============================================================

// Extracted to top-level
const AssessmentTab = ({ isPost = false, scores, updateScore, progress, guidanceVisible, selectedIndustry, navigateToTab }) => {
  const progressVal = progress(isPost);
  const title = isPost ? "Post-Engagement Assessment" : "Pre-Engagement Performance Baseline";
  const subtitle = isPost ? "Compare your current operational state against initial baseline. Progress saves automatically." : "Score each question 1-5 to calibrate your baseline. Progress saves automatically.";

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10">
      {/* Title card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-gray-100">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl font-light text-gray-900 mb-1 tracking-tight">{title}</h2>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <span className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] mb-2">{progressVal}/48 Quantified</span>
          <div className="w-40 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-900 to-red-700 transition-all duration-500" style={{ width: `${(progressVal / 48) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Question dimensions */}
      {DIMENSIONS.map((dim) => (
        <div key={dim.num} className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6 border border-gray-100">

          {/* Dimension header — overflow-hidden ensures text stays inside */}
          <div className="bg-red-900 px-6 py-4 overflow-hidden">
            <span className="text-white font-black text-[11px] uppercase tracking-[0.25em] block truncate">
              Dimension {dim.num}: {dim.name}
            </span>
          </div>

          {/* Universal questions */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Universal Operational Standards</span>
          </div>

          {[1, 2, 3, 4].map((q) => {
            const qid = `${dim.num}.${q}`;
            const isActive = guidanceVisible === `${isPost ? 'post' : 'pre'}-${qid}`;
            return (
              <div key={qid} className="border-b border-gray-50 last:border-0">
                <div className="px-6 sm:px-10 py-5 sm:py-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-red-900 font-black text-[10px] sm:text-xs w-6 sm:w-8 shrink-0">{qid}</span>
                      <p className="flex-1 sm:hidden text-gray-800 text-sm font-medium leading-relaxed">{UNIVERSAL_QUESTIONS[qid]}</p>
                    </div>
                    <p className="hidden sm:block flex-1 min-w-0 text-gray-800 text-sm leading-relaxed">{UNIVERSAL_QUESTIONS[qid]}</p>
                    <div className="flex gap-1.5 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateScore(qid, s, isPost)}
                          className={`flex-1 sm:flex-none w-auto sm:w-9 h-9 rounded-lg border-2 font-black text-xs transition-all outline-none ${
                            scores[qid] === s
                              ? 'bg-red-900 border-red-900 text-white shadow-md scale-105'
                              : 'bg-white border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-900'
                          }`}
                          style={{ padding: 0 }}
                        >{s}</button>
                      ))}
                    </div>
                  </div>
                </div>
                {isActive && GUIDANCE[dim.key]?.[scores[qid]] && (
                  <div className="mx-6 mb-4 px-5 py-4 bg-red-50 border-l-4 border-red-900 rounded-r-xl text-sm">
                    <div className="text-[10px] uppercase font-black text-red-900 tracking-widest mb-1">CherryStone Guidance — Score {scores[qid]}</div>
                    <p className="text-gray-700 font-medium text-sm leading-relaxed">{GUIDANCE[dim.key][scores[qid]]}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Sector dynamic header */}
          <div className="px-6 py-3 bg-gray-50 border-t border-b border-gray-100">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sector Dynamic: {selectedIndustry}</span>
          </div>

          {[1, 2, 3, 4].map((q) => {
            const qid = `${dim.num}.${q + 4}`;
            const indQ = INDUSTRY_QUESTIONS[selectedIndustry]?.[`${dim.key}_Q${q}`];
            if (!indQ) return null;
            const isActive = guidanceVisible === `${isPost ? 'post' : 'pre'}-${qid}`;
            return (
              <div key={qid} className="border-b border-gray-50 last:border-0">
                <div className="px-6 sm:px-10 py-5 sm:py-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-red-900 font-black text-[10px] sm:text-xs w-6 sm:w-8 shrink-0">{qid}</span>
                      <p className="flex-1 sm:hidden text-gray-800 text-sm font-medium leading-relaxed">{indQ}</p>
                    </div>
                    <p className="hidden sm:block flex-1 min-w-0 text-gray-700 text-sm leading-relaxed">{indQ}</p>
                    <div className="flex gap-1.5 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateScore(qid, s, isPost)}
                          className={`flex-1 sm:flex-none w-auto sm:w-9 h-9 rounded-lg border-2 font-black text-xs transition-all outline-none ${
                            scores[qid] === s
                              ? 'bg-red-900 border-red-900 text-white shadow-md scale-105'
                              : 'bg-white border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-900'
                          }`}
                          style={{ padding: 0 }}
                        >{s}</button>
                      ))}
                    </div>
                  </div>
                </div>
                {isActive && GUIDANCE[dim.key]?.[scores[qid]] && (
                  <div className="mx-6 mb-4 px-5 py-4 bg-red-50 border-l-4 border-red-900 rounded-r-xl text-sm">
                    <div className="text-[10px] uppercase font-black text-red-900 tracking-widest mb-1">Industry Alignment — Score {scores[qid]}</div>
                    <p className="text-gray-700 font-medium text-sm leading-relaxed">{GUIDANCE[dim.key][scores[qid]]}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      <div className="flex flex-wrap gap-5 justify-center mt-8 pb-16">
        <button
          onClick={() => navigateToTab(isPost ? 'results' : 'industry')}
          className="rounded-2xl bg-white text-gray-900 font-bold uppercase tracking-widest text-[11px] transition-all hover:bg-gray-50 border-2 border-gray-200 shrink-0"
          style={{ padding: '14px 32px', minWidth: 'max-content' }}
        >Back</button>
        <button
          onClick={() => navigateToTab(isPost ? 'comparison' : 'results')}
          className="rounded-2xl bg-red-900 text-white font-bold uppercase tracking-widest text-[11px] transition-all hover:bg-red-950 active:scale-95 shadow-xl shadow-red-900/10 shrink-0"
          style={{ padding: '14px 32px', minWidth: 'max-content' }}
        >{isPost ? 'Analyze Impact' : 'Generate Intelligence'}</button>
      </div>
    </div>
  );
};


  // ============================================================
  // RESULTS TAB
  // ============================================================

// Extracted to top-level
const ResultsTab = ({ preScores, selectedIndustry, navigateToTab }) => {
  const { universal, industry } = calcDimScores(preScores);
  const overallUniversal = avgScores(DIMENSIONS.map((d) => universal[d.key]));
  const overallIndustry = avgScores(DIMENSIONS.map((d) => industry[d.key]));

  const allChartData = DIMENSIONS.map((d) => ({
    name: d.name.split(" ")[0],
    universal: universal[d.key] || 0,
    industry: industry[d.key] || 0
  }));

  const radarData = DIMENSIONS.map((d) => ({
    dimension: d.name,
    value: universal[d.key] || 0
  }));

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">Performance Calibration Results</h2>
        <p className="text-gray-500 font-normal text-base max-w-2xl mx-auto">
          Comprehensive breakdown of operational maturity across universal and sector-specific dimensions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Universal Calibration */}
        <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">Universal Maturity Baseline</h3>
          
          <div className="block sm:hidden space-y-4">
            {DIMENSIONS.map((d) => {
              const score = universal[d.key];
              const rating = getRating(score);
              return (
                <div key={d.key} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-gray-900 font-bold text-sm">{d.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${rating.cls}`}>
                      {rating.text}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    <span>Performance Score</span>
                    <span className="text-gray-900 text-lg">{score !== null ? score : "—"}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left pb-4 text-[10px] uppercase font-black text-gray-400 tracking-widest">Dimension</th>
                  <th className="text-left pb-4 text-[10px] uppercase font-black text-gray-400 tracking-widest">Score</th>
                  <th className="text-right pb-4 text-[10px] uppercase font-black text-gray-400 tracking-widest">Rating</th>
                </tr>
              </thead>
              <tbody>
                {DIMENSIONS.map((d) => {
                  const score = universal[d.key];
                   const rating = getRating(score);
                  return (
                    <tr key={d.key} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 text-gray-900 font-medium">{d.name}</td>
                      <td className="py-4 text-gray-900 font-black">{score !== null ? score : "—"}</td>
                      <td className="py-4 text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${rating.cls}`}>
                           {rating.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-center bg-gray-50 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-6 sm:p-8 rounded-b-3xl">
            <div className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Universal Efficiency Metric</div>
            <div className="text-3xl sm:text-4xl font-light text-red-900">{overallUniversal !== null ? overallUniversal : "—"}</div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 border border-gray-100 flex flex-col items-center justify-center min-h-[350px] sm:min-h-[400px]">
          <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider self-start">Operational Fingerprint</h3>
          <div className="w-full h-full min-h-[300px] sm:min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart 
                cx="50%" 
                cy="48%" 
                outerRadius={window.innerWidth < 640 ? "55%" : "70%"} 
                data={radarData}
                margin={{ top: 10, right: 30, bottom: 20, left: 30 }}
              >
                <PolarGrid stroke="#f3f4f6" />
                <PolarAngleAxis 
                  dataKey="dimension" 
                  tick={(props) => {
                    const { payload, x, y, textAnchor, index } = props;
                    const isBottom = y > 180;
                    return (
                      <g transform={`translate(${x}, ${y})`}>
                        <text
                          x={0}
                          y={isBottom ? 12 : -12}
                          textAnchor={textAnchor}
                          fill="#9ca3af"
                          fontSize={window.innerWidth < 640 ? 7 : 9}
                          fontWeight={800}
                          style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        >
                          {payload.value.split(" ").map((word, i) => (
                            <tspan x={0} dy={i === 0 ? 0 : 10} key={i}>{word}</tspan>
                          ))}
                        </text>
                      </g>
                    );
                  }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: '#9ca3af', fontSize: 8 }} stroke="#e5e7eb"/>
                <Radar name="Score" dataKey="value" stroke="#8B1A1A" fill="#8B1A1A" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 justify-center pb-20 w-full px-4">
        <button
          onClick={() => navigateToTab("pre-assessment")}
          className="rounded-2xl bg-gray-50 text-gray-900 font-bold uppercase tracking-widest text-[11px] transition-all duration-200 hover:bg-gray-100 shadow-sm border border-gray-200 shrink-0"
          style={{ padding: '16px 32px', minWidth: 'max-content' }}
        >
          Back to Assessment
        </button>
        <button
          onClick={() => navigateToTab("action-plan")}
          className="rounded-2xl border-2 border-red-900 text-red-900 font-bold uppercase tracking-widest text-[11px] transition-all duration-200 hover:bg-red-50 active:scale-95 shrink-0"
          style={{ padding: '16px 32px', minWidth: 'max-content' }}
        >
          View Strategic Roadmap
        </button>
        <button
          onClick={() => navigateToTab("post-assessment")}
          className="rounded-2xl bg-red-900 text-white font-bold uppercase tracking-widest text-[11px] transition-all duration-200 hover:bg-red-950 active:scale-95 shadow-xl shadow-red-900/10 shrink-0"
          style={{ padding: '16px 32px', minWidth: 'max-content' }}
        >
          Start Optimization Assessment
        </button>
      </div>
    </div>
  );
};


  // ============================================================
  // COMPARISON TAB
  // ============================================================

// Extracted to top-level
const ComparisonTab = ({ preScores, postScores, selectedIndustry, navigateToTab, exportReport }) => {
  const pre = calcDimScores(preScores);
  const post = calcDimScores(postScores);

  const getComparisonData = (name, preVal, postVal) => {
    const change = preVal !== null && postVal !== null ? parseFloat((postVal - preVal).toFixed(1)) : null;
    const pct = preVal !== null && postVal !== null && preVal > 0
      ? parseFloat(((postVal - preVal) / preVal * 100).toFixed(1))
      : null;

    let status = "", statusClass = "";
    if (pct !== null) {
      if (pct >= 20) { status = "Velocity"; statusClass = "bg-green-100 text-green-800"; }
      else if (pct >= 10) { status = "Momentum"; statusClass = "bg-blue-100 text-blue-800"; }
      else if (pct >= 0) { status = "Baseline"; statusClass = "bg-gray-100 text-gray-800"; }
      else { status = "Correction"; statusClass = "bg-red-100 text-red-800"; }
    }
    return { change, pct, status, statusClass };
  };

  const radarData = DIMENSIONS.map((d) => ({
    dimension: d.name,
    pre: pre.universal[d.key] || 0,
    post: post.universal[d.key] || 0
  }));

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">Impact Analytics</h2>
        <p className="text-gray-500 font-normal text-base max-w-2xl mx-auto">
          Measuring the delta between baseline perception and current operational excellence.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm p-4 sm:p-8 border border-gray-100 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">Universal Transformation Delta</h3>
        
        {/* Mobile/Tablet View (Cards) */}
        <div className="block lg:hidden space-y-4">
          {DIMENSIONS.map((d) => {
            const comp = getComparisonData(d.name, pre.universal[d.key], post.universal[d.key]);
            return (
              <div key={d.key} className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-gray-900 font-bold text-sm">{d.name}</span>
                  {comp.status && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${comp.statusClass}`}>
                      {comp.status}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-black text-gray-400 tracking-widest mb-1">Baseline</span>
                    <span className="text-gray-500 font-bold">{pre.universal[d.key] ?? "—"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-black text-gray-400 tracking-widest mb-1">Current</span>
                    <span className="text-gray-900 font-black">{post.universal[d.key] ?? "—"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-black text-gray-400 tracking-widest mb-1">Change</span>
                    <span className={`font-black ${comp.change > 0 ? "text-green-600" : comp.change < 0 ? "text-red-600" : "text-gray-400"}`}>
                      {comp.change !== null ? (comp.change > 0 ? "+" : "") + comp.change : "—"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-black text-gray-400 tracking-widest mb-1">% Lift</span>
                    <span className="text-gray-900 font-black">{comp.pct !== null ? comp.pct + "%" : "—"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left pb-4 text-[10px] uppercase font-black text-gray-400 tracking-widest">Dimension</th>
                <th className="text-left pb-4 text-[10px] uppercase font-black text-gray-400 tracking-widest">Baseline</th>
                <th className="text-left pb-4 text-[10px] uppercase font-black text-gray-400 tracking-widest">Current</th>
                <th className="text-left pb-4 text-[10px] uppercase font-black text-gray-400 tracking-widest">Change</th>
                <th className="text-left pb-4 text-[10px] uppercase font-black text-gray-400 tracking-widest">% Lift</th>
                <th className="text-right pb-4 text-[10px] uppercase font-black text-gray-400 tracking-widest">Velocity</th>
              </tr>
            </thead>
            <tbody>
              {DIMENSIONS.map((d) => {
                const comp = getComparisonData(d.name, pre.universal[d.key], post.universal[d.key]);
                return (
                  <tr key={d.key} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 text-gray-900 font-medium">{d.name}</td>
                    <td className="py-4 text-gray-400 font-medium">{pre.universal[d.key] ?? "—"}</td>
                    <td className="py-4 text-gray-900 font-black">{post.universal[d.key] ?? "—"}</td>
                    <td className={`py-4 font-black ${comp.change > 0 ? "text-green-600" : comp.change < 0 ? "text-red-600" : "text-gray-400"}`}>
                      {comp.change !== null ? (comp.change > 0 ? "+" : "") + comp.change : "—"}
                    </td>
                    <td className="py-4 font-black text-gray-900">{comp.pct !== null ? comp.pct + "%" : "—"}</td>
                    <td className="py-4 text-right">
                      {comp.status && (
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${comp.statusClass}`}>
                          {comp.status}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-3xl shadow-sm p-4 sm:p-8 border border-gray-100 min-h-[400px] sm:min-h-[450px]">
          <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">Comparative Overlay</h3>
          <div className="w-full h-full min-h-[300px] sm:min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart 
                cx="50%" 
                cy="48%" 
                outerRadius={window.innerWidth < 640 ? "55%" : "70%"} 
                data={radarData}
                margin={{ top: 10, right: 30, bottom: 40, left: 30 }}
              >
                <PolarGrid stroke="#f3f4f6" />
                <PolarAngleAxis 
                  dataKey="dimension" 
                  tick={(props) => {
                    const { payload, x, y, textAnchor, index } = props;
                    const isBottom = y > 180;
                    return (
                      <g transform={`translate(${x}, ${y})`}>
                        <text
                          x={0}
                          y={isBottom ? 12 : -12}
                          textAnchor={textAnchor}
                          fill="#9ca3af"
                          fontSize={window.innerWidth < 640 ? 7 : 9}
                          fontWeight={800}
                          style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        >
                          {payload.value.split(" ").map((word, i) => (
                            <tspan x={0} dy={i === 0 ? 0 : 10} key={i}>{word}</tspan>
                          ))}
                        </text>
                      </g>
                    );
                  }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: '#9ca3af', fontSize: 8 }} stroke="#e5e7eb"/>
                <Radar name="Baseline" dataKey="pre" stroke="#8B1A1A" fill="#8B1A1A" fillOpacity={0.15} strokeWidth={2}/>
                <Radar name="Current" dataKey="post" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.15} strokeWidth={2}/>
                <Legend 
                  iconType="circle" 
                  verticalAlign="bottom"
                  wrapperStyle={{ 
                    paddingTop: '35px', 
                    fontSize: '9px', 
                    textTransform: 'uppercase', 
                    fontWeight: 900, 
                    letterSpacing: '0.1em' 
                  }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 border border-gray-100">
           <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">Sector Transformation: {selectedIndustry}</h3>
           
           {/* Mobile View */}
           <div className="block sm:hidden space-y-4">
             {DIMENSIONS.map((d, i) => {
               const comp = getComparisonData(d.name, pre.industry[d.key], post.industry[d.key]);
               const rating = getRating(post.industry[d.key]);
               return (
                 <div key={d.key} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                   <div className="flex justify-between items-start mb-3">
                     <span className="text-gray-900 font-bold text-sm leading-tight pr-4">{INDUSTRY_DIM_LABELS[selectedIndustry]?.[i] || d.name}</span>
                     <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0 ${rating.cls}`}>
                       {rating.text}
                     </span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-[9px] uppercase font-black text-gray-400 tracking-widest">Performance Shift</span>
                     <span className={`font-black text-sm ${comp.change > 0 ? "text-green-600" : comp.change < 0 ? "text-red-600" : "text-gray-400"}`}>
                       {comp.change !== null ? (comp.change > 0 ? "+" : "") + comp.change : "—"}
                     </span>
                   </div>
                 </div>
               );
             })}
           </div>

           {/* Desktop View */}
           <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left pb-4 text-[10px] uppercase font-black text-gray-400 tracking-widest">Dimension</th>
                  <th className="text-left pb-4 text-[10px] uppercase font-black text-gray-400 tracking-widest">Change</th>
                  <th className="text-right pb-4 text-[10px] uppercase font-black text-gray-400 tracking-widest">Current Rating</th>
                </tr>
              </thead>
              <tbody>
                {DIMENSIONS.map((d, i) => {
                  const comp = getComparisonData(d.name, pre.industry[d.key], post.industry[d.key]);
                  const rating = getRating(post.industry[d.key]);
                  return (
                    <tr key={d.key} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 text-gray-900 font-medium">{INDUSTRY_DIM_LABELS[selectedIndustry]?.[i] || d.name}</td>
                      <td className={`py-4 font-black ${comp.change > 0 ? "text-green-600" : comp.change < 0 ? "text-red-600" : "text-gray-400"}`}>
                        {comp.change !== null ? (comp.change > 0 ? "+" : "") + comp.change : "—"}
                      </td>
                      <td className="py-4 text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${rating.cls}`}>
                          {rating.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 justify-center pb-20 w-full px-4 pt-8">
        <button
          onClick={() => navigateToTab("post-assessment")}
          className="rounded-2xl bg-gray-50 text-gray-900 font-bold uppercase tracking-widest text-[11px] transition-all duration-200 hover:bg-gray-100 border border-gray-200 shrink-0"
          style={{ padding: '16px 32px', minWidth: 'max-content' }}
        >
          Back
        </button>
        <button
          onClick={() => exportReport(pre, post)}
          className="rounded-2xl bg-red-900 text-white font-bold uppercase tracking-widest text-[11px] transition-all duration-200 hover:bg-red-950 active:scale-95 shadow-xl shadow-red-900/10 flex items-center justify-center gap-2 shrink-0"
          style={{ padding: '16px 32px', minWidth: 'max-content' }}
        >
          <Save size={16} /> Export Intelligence Report
        </button>
      </div>
    </div>
  );
};


  // ============================================================
  // ACTION PLAN TAB
  // ============================================================

// Extracted to top-level
const ActionPlanTab = ({ preScores, navigateToTab, exportReport, postScores }) => {
  const { universal } = calcDimScores(preScores);
  const sorted = DIMENSIONS
    .map((d) => ({ name: d.name, key: d.key, score: universal[d.key] }))
    .filter((d) => d.score !== null)
    .sort((a, b) => a.score - b.score);

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-16 flex-1 min-w-0">
        <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-tight break-words whitespace-normal">Strategic Excellence Roadmap</h2>
        <p className="text-gray-500 font-normal text-base max-w-2xl mx-auto break-words whitespace-normal">
          Prioritized operational optimizations based on your baseline process maturity fingerprint.
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm p-12 text-center text-gray-400 border-2 border-dashed border-gray-100 font-medium">
          Quantify your baseline in the Pre-Assessment to architect your roadmap.
        </div>
      ) : (
        <div className="space-y-6">
          {sorted.map((d) => {
            let priority, priorityTag, priorityBorder;
            if (d.score <= 2) { priority = "Critical Gap"; priorityTag = "bg-red-100 text-red-700"; priorityBorder = "border-l-4 border-red-600"; }
            else if (d.score <= 3) { priority = "High Priority"; priorityTag = "bg-orange-100 text-orange-700"; priorityBorder = "border-l-4 border-orange-600"; }
            else if (d.score <= 4) { priority = "Strategic Optimization"; priorityTag = "bg-green-100 text-green-700"; priorityBorder = "border-l-4 border-green-600"; }
            else { priority = "Sustain & Innovate"; priorityTag = "bg-blue-100 text-blue-700"; priorityBorder = "border-l-4 border-blue-600"; }

            return (
              <div key={d.key} className={`bg-white rounded-3xl shadow-sm p-8 border border-gray-100 ${priorityBorder} transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{d.name}</h4>
                    <span className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em]">Baseline Efficiency: {d.score}/5.0</span>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider ${priorityTag}`}>
                    {priority}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <p className="text-gray-700 text-sm leading-relaxed font-medium">
                    {GUIDANCE[d.key]?.[Math.round(d.score)] || "Analysis pending detailed review."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap gap-6 justify-center mt-12 pb-20 w-full px-4">
        <button
          onClick={() => navigateToTab("results")}
          className="rounded-2xl bg-gray-50 text-gray-900 font-bold uppercase tracking-widest text-[11px] transition-all duration-200 hover:bg-gray-100 border border-gray-200 shrink-0"
          style={{ padding: '16px 32px', minWidth: 'max-content' }}
        >
          Back to Analysis
        </button>
        <button
          onClick={() => exportReport(calcDimScores(preScores), calcDimScores(postScores || {}))}
          className="rounded-2xl bg-red-900 text-white font-bold uppercase tracking-widest text-[11px] transition-all duration-200 hover:bg-red-950 active:scale-95 shadow-xl shadow-red-900/10 flex items-center justify-center gap-2 shrink-0"
          style={{ padding: '16px 32px', minWidth: 'max-content' }}
        >
          <Save size={16} /> Export Intelligence Report
        </button>
      </div>
    </div>
  );
};


export default function ProcessMaturityApp() {
  const [currentTab, setCurrentTab] = useState("welcome");
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [preScores, setPreScores] = useState({});
  const [postScores, setPostScores] = useState({});
  const [guidanceVisible, setGuidanceVisible] = useState(null);
  
  // Supabase State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [currentAssessmentId, setCurrentAssessmentId] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // login, signup
  const [authError, setAuthError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    // Check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchAssessments();
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchAssessments();
      else setAssessments([]);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign out automatically when the user navigates away from this page
  useEffect(() => {
    return () => {
      supabase.auth.signOut();
    };
  }, []);

  const fetchAssessments = async () => {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (!error && data) setAssessments(data);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);

    try {
      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, organisation: organisation }
          }
        });
        if (error) throw error;
        setAuthError("Account created! Please check your email to confirm.");
      }
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentAssessmentId(null);
    setPreScores({});
    setPostScores({});
    setSelectedIndustry(null);
    setEmail("");
    setPassword("");
    setCurrentTab("welcome");
  };

  const saveToCloud = async () => {
    if (!user) return;
    setSaving(true);
    
    const status = progress(true) >= 48 ? 'post_complete' : progress(false) >= 48 ? 'pre_complete' : 'in_progress';
    const payload = {
      industry: selectedIndustry,
      pre_scores: preScores,
      post_scores: postScores,
      status,
      updated_at: new Date().toISOString()
    };

    try {
      if (currentAssessmentId) {
        await supabase.from('assessments').update(payload).eq('id', currentAssessmentId);
      } else {
        const { data, error } = await supabase.from('assessments').insert({
          ...payload,
          user_id: user.id,
          name: `${selectedIndustry} Assessment`
        }).select().single();
        if (error) throw error;
        if (data) setCurrentAssessmentId(data.id);
      }
      fetchAssessments();
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const loadAssessment = (assessment) => {
    setCurrentAssessmentId(assessment.id);
    setSelectedIndustry(assessment.industry);
    setPreScores(assessment.pre_scores || {});
    setPostScores(assessment.post_scores || {});
    
    if (assessment.status === 'post_complete') setCurrentTab("comparison");
    else if (assessment.status === 'pre_complete') setCurrentTab("results");
    else setCurrentTab("pre-assessment");
  };

  const deleteAssessment = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this assessment? This cannot be undone.")) return;
    
    await supabase.from('assessments').delete().eq('id', id);
    if (currentAssessmentId === id) {
      setCurrentAssessmentId(null);
      setPreScores({});
      setPostScores({});
    }
    fetchAssessments();
  };

  const startNew = () => {
    setCurrentAssessmentId(null);
    setPreScores({});
    setPostScores({});
    setSelectedIndustry(null);
    setCurrentTab("industry");
  };

  const updateScore = (questionId, score, isPost = false) => {
    const scores = isPost ? postScores : preScores;
    const newScores = { ...scores, [questionId]: score };
    isPost ? setPostScores(newScores) : setPreScores(newScores);
    setGuidanceVisible(`${isPost ? "post" : "pre"}-${questionId}`);
    
    // Auto-save debounced would be better but let's keep it simple for now or trigger manually
  };

  const progress = isPost => {
    const scores = isPost ? postScores : preScores;
    return Object.keys(scores).length;
  };

  const navigateToTab = (tab) => {
    setCurrentTab(tab);
    window.scrollTo(0, 0);
  };

  // ============================================================
  // EXPORT FUNCTION
  // ============================================================

  const exportReport = (pre, post) => {
    const hasPost = Object.keys(postScores).length > 0;
    const indL = INDUSTRY_DIM_LABELS[selectedIndustry];
    const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

    let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Cherrystone Process Maturity Report</title><style>body{font-family:Arial,sans-serif;color:#2D2D2D;max-width:800px;margin:0 auto;padding:40px;font-size:13px;line-height:1.6;}h1{color:#8B1A1A;font-size:24px;border-bottom:3px solid #8B1A1A;padding-bottom:10px;}h2{color:#8B1A1A;font-size:18px;margin-top:30px;border-bottom:1px solid #ddd;padding-bottom:6px;}table{width:100%;border-collapse:collapse;margin:12px 0;font-size:12px;}th{background:#8B1A1A;color:white;padding:8px 10px;text-align:left;}td{padding:8px 10px;border-bottom:1px solid #eee;}.score-high{color:#2E7D32;font-weight:bold;}.score-mid{color:#F57F17;font-weight:bold;}.score-low{color:#C62828;font-weight:bold;}.action{padding:12px;margin:8px 0;border-left:4px solid #8B1A1A;background:#f9f9f9;}.footer{text-align:center;color:#888;font-size:11px;margin-top:40px;border-top:1px solid #ddd;padding-top:12px;}@media print{body{padding:20px;}}</style></head><body>`;

    html += `<h1>CHERRYSTONE — Process Maturity Report</h1><p><strong>Industry:</strong> ${selectedIndustry} | <strong>Date:</strong> ${date}</p>`;
    html += `<h2>Universal Dimension Scores</h2><table><tr><th>Dimension</th><th>Pre</th>${hasPost ? "<th>Post</th><th>Change</th>" : ""}<th>Rating</th></tr>`;

    DIMENSIONS.forEach((d) => {
      const pS = pre.universal[d.key];
      const poS = post.universal[d.key];
      const r = getRating(hasPost && poS !== null ? poS : pS);
      const cls = pS >= 3.5 ? "score-high" : pS >= 2.5 ? "score-mid" : "score-low";
      html += `<tr><td>${d.name}</td><td class="${cls}">${pS !== null ? pS : "—"}</td>`;
      if (hasPost) {
        const ch = pS !== null && poS !== null ? parseFloat((poS - pS).toFixed(1)) : null;
        html += `<td>${poS !== null ? poS : "—"}</td><td>${ch !== null ? (ch > 0 ? "+" : "") + ch : "—"}</td>`;
      }
      html += `<td>${r.text}</td></tr>`;
    });

    html += `</table><h2>Industry-Specific (${selectedIndustry})</h2><table><tr><th>Dimension</th><th>Pre</th>${hasPost ? "<th>Post</th><th>Change</th>" : ""}<th>Rating</th></tr>`;

    DIMENSIONS.forEach((d, i) => {
      const pS = pre.industry[d.key];
      const poS = post.industry[d.key];
      const r = getRating(hasPost && poS !== null ? poS : pS);
      html += `<tr><td>${indL[i]}</td><td>${pS !== null ? pS : "—"}</td>`;
      if (hasPost) {
        const ch = pS !== null && poS !== null ? parseFloat((poS - pS).toFixed(1)) : null;
        html += `<td>${poS !== null ? poS : "—"}</td><td>${ch !== null ? (ch > 0 ? "+" : "") + ch : "—"}</td>`;
      }
      html += `<td>${r.text}</td></tr>`;
    });

    html += `</table><h2>Action Plan</h2>`;

    DIMENSIONS
      .map((d) => ({ name: d.name, key: d.key, score: pre.universal[d.key] }))
      .filter((d) => d.score !== null)
      .sort((a, b) => a.score - b.score)
      .forEach((d) => {
        let p = "MAINTAIN";
        if (d.score <= 2) p = "CRITICAL";
        else if (d.score <= 3) p = "HIGH";
        else if (d.score <= 4) p = "MEDIUM";
        html += `<div class="action"><strong>${d.name}</strong> (${d.score}) — ${p}<br>${GUIDANCE[d.key]?.[Math.round(d.score)] || ""}</div>`;
      });

    html += `<div class="footer">© Cherrystone — Empowering Process Excellence</div></body></html>`;

    const w = window.open('', '_blank');
    if (w) {
      w.document.open();
      w.document.write(html);
      w.document.close();
      setTimeout(() => {
        w.print();
      }, 500);
    } else {
      // Fallback if popup blocked
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Cherrystone_Report.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }
  };

  // ============================================================
  // RENDER TABS
  // ============================================================

  const authProps = { authMode, setAuthMode, email, setEmail, password, setPassword, fullName, setFullName, organisation, setOrganisation, authError, handleAuth, loading };

  const tabs = [
    { id: "welcome", label: "Dashboard", enabled: true },
    { id: "my-assessments", label: "My History", enabled: !!user },
    { id: "industry", label: "Industry", enabled: !!user },
    { id: "pre-assessment", label: "Baseline", enabled: selectedIndustry !== null },
    { id: "results", label: "Intelligence", enabled: progress(false) > 0 },
    { id: "post-assessment", label: "Optimization", enabled: progress(false) > 0 },
    { id: "comparison", label: "Impact", enabled: progress(true) > 0 },
    { id: "action-plan", label: "Roadmap", enabled: progress(false) > 0 }
  ];

  const renderActiveTab = () => {
    switch (currentTab) {
      case "welcome":
        return <WelcomeTab user={user} authProps={authProps} navigateToTab={navigateToTab} />;
      case "my-assessments":
        return <MyAssessmentsTab assessments={assessments} startNew={startNew} loadAssessment={loadAssessment} deleteAssessment={deleteAssessment} />;
      case "industry":
        return <IndustryTab selectedIndustry={selectedIndustry} setSelectedIndustry={setSelectedIndustry} navigateToTab={navigateToTab} />;
      case "pre-assessment":
        return <AssessmentTab isPost={false} scores={preScores} updateScore={updateScore} progress={progress} guidanceVisible={guidanceVisible} selectedIndustry={selectedIndustry} navigateToTab={navigateToTab} />;
      case "results":
        return <ResultsTab preScores={preScores} selectedIndustry={selectedIndustry} navigateToTab={navigateToTab} />;
      case "post-assessment":
        return <AssessmentTab isPost={true} scores={postScores} updateScore={updateScore} progress={progress} guidanceVisible={guidanceVisible} selectedIndustry={selectedIndustry} navigateToTab={navigateToTab} />;
      case "comparison":
        return <ComparisonTab preScores={preScores} postScores={postScores} selectedIndustry={selectedIndustry} navigateToTab={navigateToTab} exportReport={exportReport} />;
      case "action-plan":
        return <ActionPlanTab preScores={preScores} navigateToTab={navigateToTab} exportReport={exportReport} postScores={postScores} />;
      default:
        return <WelcomeTab user={user} authProps={authProps} navigateToTab={navigateToTab} />;
    }
  };

  return (
    <div className="maturity-app flex flex-col min-h-[100dvh] bg-[#FDFDFD] text-[#080808] font-sans w-full overflow-x-hidden relative">
      <style>{`
        /*
         * CORE FIX: index.css has * { padding: 0; margin: 0 } as unlayered author CSS.
         * Tailwind v4 puts utilities in @layer utilities which loses to unlayered styles.
         * Using revert-layer on .maturity-app * (higher specificity than *) makes the
         * browser skip the global reset and apply Tailwind utility layer values instead.
         */
        .maturity-app * {
          padding: revert-layer;
          margin: revert-layer;
          box-sizing: border-box;
        }

        /* Typography fixes — override global h2 uppercase + text-shadow */
        .maturity-app h1, .maturity-app h2, .maturity-app h3, .maturity-app h4 {
          text-transform: none !important;
          text-shadow: none !important;
          /* No color: inherit here as it breaks the dark auth view */
        }
        .maturity-app h2 {
          font-weight: 300 !important;
          letter-spacing: -0.01em !important;
          color: #080808; /* Default text color for the light theme */
        }
        .maturity-app h3 { font-weight: 700 !important; }
        .maturity-app h4 { font-weight: 700 !important; }

        /* Scoped override for the AuthView to ensure visibility even with light theme defaults */
        .maturity-app .auth-view-header h2 {
          color: white !important;
        }
        .maturity-app .auth-view-header p {
          color: #9ca3af !important; /* text-gray-400 */
        }

        /* Ensure dark text on light background throughout */
        .maturity-app { color: #111827; background: #f9fafb; font-family: 'Inter', system-ui, -apple-system, sans-serif; }

        /* Scoped override for the AuthView */
        .maturity-app .auth-view h2 {
          color: #111827 !important;
        }
        .maturity-app .auth-view p {
          color: #6b7280 !important;
        }

        /* User-select fix — global CSS disables it, re-enable for inputs */
        .maturity-app input, .maturity-app textarea {
          user-select: text !important;
          -webkit-user-select: text !important;
          color: inherit;
        }

        /* Custom scrollbar for nav */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <Header 
        user={user} 
        saving={saving} 
        selectedIndustry={selectedIndustry} 
        saveToCloud={saveToCloud} 
        handleLogout={handleLogout} 
      />

      {user && (
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-16 sm:top-20 z-40 w-full flex justify-center">
          {/* Desktop Navigation */}
          <div className="hidden sm:flex px-6 h-16 items-end justify-center gap-8 w-full max-w-[2000px] mx-auto overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigateToTab(tab.id)}
                disabled={!tab.enabled}
                className={`pb-4 px-2 text-sm font-semibold transition-all border-b-2 whitespace-nowrap shrink-0 group ${
                  currentTab === tab.id
                    ? "border-red-900 text-red-900"
                    : tab.enabled
                    ? "border-transparent text-gray-400 hover:text-red-900 hover:border-red-200"
                    : "border-transparent text-gray-200 opacity-60 cursor-not-allowed"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mobile Navigation Dropdown */}
          <div className="flex sm:hidden w-full px-6 py-3 relative">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="w-full h-12 bg-gray-50 border border-gray-200 rounded-2xl px-6 flex items-center justify-between group active:scale-[0.98] transition-all shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-900" />
                <span className="text-[11px] font-black uppercase tracking-widest text-gray-900">
                  {tabs.find(t => t.id === currentTab)?.label || "Menu"}
                </span>
              </div>
              <div className={`transition-transform duration-300 ${mobileNavOpen ? 'rotate-180' : ''}`}>
                <Plus size={16} className="text-gray-400 group-hover:text-red-900" />
              </div>
            </button>

            {mobileNavOpen && (
              <div className="absolute top-full left-0 w-full px-6 mt-1 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden py-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      disabled={!tab.enabled}
                      onClick={() => {
                        navigateToTab(tab.id);
                        setMobileNavOpen(false);
                      }}
                      className={`w-full px-5 py-3 text-left flex items-center justify-between transition-colors ${
                        currentTab === tab.id
                          ? "bg-red-50 text-red-900 font-bold"
                          : tab.enabled
                          ? "text-gray-600 hover:bg-gray-50"
                          : "text-gray-300 opacity-60 cursor-not-allowed"
                      }`}
                    >
                      <span className="text-[10px] uppercase font-black tracking-widest">{tab.label}</span>
                      {currentTab === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-red-900" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      {/* Main Content Area */}
      <div className="w-full flex-1 flex justify-center relative bg-gray-50/30">
        <div className="w-full max-w-[2000px] px-8 sm:px-12 mx-auto py-8 relative flex flex-col items-center">
          {renderActiveTab()}
        </div>
      </div>

      {/* Clean Small Footer */}
      <footer className="w-full flex justify-center items-center py-6 border-t border-gray-200 mt-auto bg-gray-50">
        <span className="text-xs text-gray-500 font-medium tracking-wide">
          © {new Date().getFullYear()} CherryStone Business Services. All rights reserved. ™
        </span>
      </footer>
    </div>
  );
}
