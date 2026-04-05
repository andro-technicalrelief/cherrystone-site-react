import React, { useState, useEffect, useCallback, useMemo, useReducer, useRef, memo } from "react";
import {
  Play, Square, Diamond, Circle, ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  Plus, Trash2, Copy, Edit3, FileText, BarChart3, GitBranch, Network,
  Upload, Zap, AlertTriangle, CheckCircle, Clock, Users, Target, Shield,
  TrendingUp, DollarSign, Download, Eye, Search, Filter, ArrowRight,
  Layers, Activity, Award, ClipboardList, X, Check, RefreshCw, Workflow,
  Info, Cpu, Sparkles, SlidersHorizontal
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RPieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, ScatterChart, Scatter, ZAxis
} from "recharts";
import * as d3 from "d3";
import _ from "lodash";

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   BRAND â€” Maturity Tool Light Palette
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const C = {
  cherryDark: "#8B1A1A", cherryMid: "#B22222", cherryLight: "#D4443A",
  charcoal: "#2D2D2D", grey50: "#FAFAFA", grey100: "#F7F7F7", grey200: "#EEEEEE",
  grey300: "#DDDDDD", grey400: "#BBBBBB", grey500: "#888888", grey600: "#666666",
  white: "#FFFFFF",
  green: "#4CAF50", greenDark: "#2E7D32", greenLight: "#C8E6C9", greenMid: "#A5D6A7",
  amber: "#FF9800", amberDark: "#E65100", amberLight: "#FFE0B2",
  redLight: "#FFCDD2", yellowLight: "#FFF9C4",
  blue: "#1565C0", blueLight: "#E3F2FD",
};
const FONT = "'Inter', system-ui, -apple-system, sans-serif";
const RISK_COLORS = { low: C.green, medium: C.amber, high: C.cherryMid, critical: C.cherryDark };
const RISK_BG = { low: C.greenLight, medium: C.amberLight, high: C.redLight, critical: "#FFCDD2" };
const DURATION_UNITS = ["minutes", "hours", "days", "weeks"];
const CURRENCIES = [
  {code:"USD",symbol:"$",name:"US Dollar"},{code:"EUR",symbol:"â‚¬",name:"Euro"},{code:"GBP",symbol:"Â£",name:"British Pound"},
  {code:"ZAR",symbol:"R",name:"South African Rand"},{code:"AUD",symbol:"A$",name:"Australian Dollar"},
  {code:"CAD",symbol:"C$",name:"Canadian Dollar"},{code:"CHF",symbol:"CHF",name:"Swiss Franc"},
  {code:"JPY",symbol:"Â¥",name:"Japanese Yen"},{code:"INR",symbol:"â‚¹",name:"Indian Rupee"},
];
const CATEGORIES = ["approval","data-entry","communication","review","transformation","handoff","verification","notification"];

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   TEMPLATES
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const TEMPLATES = {
  onboarding: { name: "Employee Onboarding", description: `HR initiates the onboarding process by creating an employee record in the HR system with the new hire's personal details, start date, and assigned department. The hiring manager then prepares the role-specific onboarding plan, outlining required training modules, initial assignments, and mentorship pairings. IT provisions the employee's workstation, email account, VPN access, and necessary software licenses within 2 days. If the role requires elevated system access, the security team must review and approve the access request before IT can proceed. Meanwhile, the facilities team simultaneously prepares the physical workspace, including desk assignment, access badge, and parking permit. The HR coordinator schedules orientation sessions covering company policies, benefits enrollment, and compliance training, which takes approximately 3 hours. The new employee completes all required compliance training modules within the first week. The assigned mentor conducts an introductory session to walk through team norms, project workflows, and communication channels. The hiring manager reviews and approves the completed onboarding checklist. If any items are incomplete, the HR coordinator follows up with the responsible parties to resolve gaps. Finally, HR sends a 30-day check-in survey to the new employee and their manager to assess the onboarding experience.` },
  invoice: { name: "Invoice Processing", description: `The accounts payable clerk receives the vendor invoice via email or postal mail and logs it into the invoice tracking system within 24 hours. The clerk verifies the invoice against the corresponding purchase order and delivery receipt to confirm quantities, pricing, and terms match. If there are discrepancies, the clerk contacts the vendor for clarification and flags the invoice for review. For invoices under $5,000, the department manager reviews and approves the payment. For invoices between $5,000 and $25,000, the finance director must approve. Invoices exceeding $25,000 require VP of Finance approval and a secondary review by the controller. Once approved, the payment team schedules the payment according to the vendor's payment terms, typically net-30 or net-60. The system generates a payment batch which the treasury analyst reviews before execution. After payment is processed, the accounts payable clerk reconciles the payment against the general ledger and updates the vendor account. If payment fails or is rejected by the bank, the treasury analyst investigates the cause and resubmits within 2 business days. Monthly, the AP manager generates an aging report and reviews outstanding invoices for escalation.` },
  support: { name: "Customer Support Escalation", description: `The customer submits a support ticket through the self-service portal, email, or phone channel. The Tier 1 support agent reviews the ticket, categorizes it by severity and product area, and attempts initial resolution using the knowledge base within 1 hour of receipt. If the agent resolves the issue, they document the solution and close the ticket. If the issue cannot be resolved at Tier 1, the agent escalates to Tier 2 specialist support with detailed notes on troubleshooting steps already attempted. The Tier 2 specialist diagnoses the issue within 4 hours, which may involve reviewing system logs, replicating the issue in a test environment, or consulting with the engineering team. If the issue is a confirmed software defect, the specialist creates a bug report and escalates to the engineering team. Meanwhile, the customer success manager is notified and proactively contacts the customer to provide status updates. The engineering team triages the bug, assigns it a priority level, and provides an estimated fix timeline. If the fix requires a hotfix release, the release manager coordinates an expedited deployment. Once resolved, the Tier 2 specialist verifies the fix, notifies the customer, and requests confirmation of resolution. If the customer confirms, the ticket is closed with a satisfaction survey sent within 24 hours.` },
  changeRequest: { name: "Product Change Request", description: `The product owner submits a change request documenting the proposed modification, business justification, affected components, and expected impact on existing functionality. The technical lead conducts an initial feasibility assessment within 2 days, evaluating architecture implications, dependency impacts, and estimated development effort. Simultaneously, the QA lead assesses testing requirements and identifies regression risk areas. The change advisory board reviews the request in the weekly review meeting. If the change is approved, the technical lead creates detailed technical specifications and breaks the work into development tasks. If rejected, the product owner receives written feedback with suggestions for alternative approaches. The development team implements the changes according to the technical specification. After implementation, the developer performs unit testing and submits a pull request for code review. The senior developer conducts the code review within 1 day. Once code review passes, the QA team executes the test plan including functional, regression, and performance testing over 3 days. If testing reveals defects, the development team fixes them and QA retests. Upon successful testing, the release manager schedules the deployment and notifies all stakeholders. Post-deployment, the operations team monitors system health for 48 hours.` },
  vendorRisk: { name: "Vendor Risk Assessment", description: `The procurement specialist initiates the vendor risk assessment by collecting the vendor's business documentation, including financial statements, insurance certificates, and compliance certifications. The compliance officer reviews the vendor's regulatory standing, checking for sanctions, litigation history, and industry-specific compliance requirements within 3 days. If the vendor operates in a high-risk jurisdiction, an enhanced due diligence review is triggered, requiring additional documentation and a background investigation. The information security team evaluates the vendor's cybersecurity posture, reviewing their SOC 2 report, penetration test results, and data handling procedures within 5 days. Meanwhile, the finance team assesses the vendor's financial stability using credit reports and financial ratio analysis. The legal team reviews the proposed contract terms, focusing on liability clauses, data protection obligations, indemnification, and termination rights. If any risk area scores above the acceptable threshold, the risk committee convenes to determine whether to proceed with additional controls, request remediation, or reject the vendor. The risk committee issues a formal risk rating and recommendation. Once all assessments are complete, the vendor management office compiles the comprehensive risk report and presents it to the approval authority. Depending on the contract value, approval may require sign-off from the CPO, CFO, or the board of directors.` },
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   NL PARSER â€” Clause-aware, Bulletproof
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const ROLE_KEYWORDS = [
  "accounts payable clerk","HR coordinator","hiring manager","department manager",
  "finance director","VP of Finance","treasury analyst","AP manager","payment team",
  "Tier 1 support agent","Tier 2 specialist","customer success manager",
  "engineering team","release manager","product owner","technical lead",
  "QA lead","change advisory board","development team","senior developer",
  "QA team","operations team","procurement specialist","compliance officer",
  "information security team","finance team","legal team","risk committee",
  "vendor management office","approval authority","security team","facilities team",
  "warehouse supervisor","procurement analyst","quality assurance inspector",
  "supplier relations manager","supply chain director","finance controller",
  "logistics coordinator","continuous improvement specialist","project coordinator",
  "new employee","new hire",
  "HR","IT","controller","clerk","mentor","employee","customer","agent",
  "specialist","developer","manager","director","analyst","coordinator",
  "supervisor","architect","senior architect","team lead","auditor","system",
].sort((a, b) => b.length - a.length);

const HIGH_RISK_VERBS = ["delete","cancel","terminate","remove","revoke","override","disable"];
const MED_RISK_VERBS = ["approve","reject","escalate","assess","evaluate","authorize","sign-off"];
const LOW_RISK_VERBS = ["notify","log","record","document","send","email","update","schedule","create"];
const PARALLEL_SIGNALS = ["simultaneously","at the same time","in parallel","meanwhile","concurrently"];
const AUTO_VERBS = ["log","record","send","email","notify","schedule","generate","update","track","monitor","calculate","compute","assign","route"];

const CLAUSE_STARTERS = [
  { regex: /^If\s+/i, type: "conditional" },
  { regex: /^Once\s+/i, type: "temporal" },
  { regex: /^After\s+/i, type: "temporal" },
  { regex: /^Upon\s+/i, type: "temporal" },
  { regex: /^When\s+/i, type: "temporal" },
  { regex: /^For\s+/i, type: "scope" },
  { regex: /^Depending\s+on\s+/i, type: "conditional" },
  { regex: /^(?:Monthly|Weekly|Daily|Annually|Quarterly)\b/i, type: "frequency" },
  { regex: /^(?:Meanwhile|Simultaneously|Concurrently)/i, type: "parallel" },
  { regex: /^(?:Finally|Subsequently|Then|Next|Lastly|Additionally)\b/i, type: "sequence" },
  { regex: /^(?:Post-deployment|Pre-deployment)\b/i, type: "temporal" },
];

function decomposeClause(sentence) {
  let matched = null;
  for (const s of CLAUSE_STARTERS) { if (s.regex.test(sentence)) { matched = s; break; } }
  if (!matched) return { mainClause: sentence, leadingClause: "", clauseType: "none" };
  if (["frequency","parallel","sequence"].includes(matched.type) || (matched.type === "temporal" && /^(?:Post|Pre)-/i.test(sentence))) {
    const ci = sentence.indexOf(",");
    if (ci !== -1 && ci < 30) return { leadingClause: sentence.substring(0, ci + 1).trim(), mainClause: sentence.substring(ci + 1).trim(), clauseType: matched.type };
  }
  const splitRe = /,\s+(?=the\s+|a\s+|an\s+|[A-Z][a-z])/g;
  let best = -1, m;
  while ((m = splitRe.exec(sentence)) !== null) { if (m.index >= 10) { best = m.index; break; } }
  if (best > 0) return { leadingClause: sentence.substring(0, best + 1).trim(), mainClause: sentence.substring(best + 1).trim().replace(/^\s+/, ""), clauseType: matched.type };
  return { mainClause: sentence, leadingClause: "", clauseType: matched.type };
}

function extractRole(sentence) {
  const { mainClause } = decomposeClause(sentence);
  const lower = mainClause.toLowerCase();
  for (const role of ROLE_KEYWORDS) {
    const rl = role.toLowerCase();
    const ps = [new RegExp(`^the\\s+${rl.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}(?:\\s|,|$)`,"i"), new RegExp(`^${rl.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}(?:\\s|,|$)`,"i")];
    for (const p of ps) { if (p.test(mainClause.trim())) return titleCase(role); }
  }
  for (const role of ROLE_KEYWORDS) {
    const rl = role.toLowerCase();
    const esc = rl.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const wbRe = new RegExp(`(?:^|\\b)${esc}(?:\\b|$)`, "i");
    const wbMatch = wbRe.exec(lower);
    if (wbMatch && wbMatch.index < lower.length * 0.5) {
      const before = lower.substring(0, wbMatch.index).trim();
      if (before === "" || /\bthe\b/.test(before) || before.endsWith(",")) return titleCase(role);
    }
  }
  // Passive voice detection: "X is triggered/processed/initiated" â†’ System
  if (/\b(?:is|are|was|were)\s+(?:triggered|processed|initiated|generated|required|closed|sent)\b/i.test(mainClause)) return "System";
  // "approval may require" / generic policy statements â†’ Approval Authority
  if (/\bapproval\s+(?:may|must|should|will|is)\b/i.test(mainClause)) return "Approval Authority";
  const sm = mainClause.match(/^(?:the\s+)?([A-Z][a-z]+(?:\s+[a-z]+){0,3}?)(?:\s+(?:then|will|must|shall|should|can|has|have|is|are|reviews?|creates?|sends?|submits?|prepares?|conducts?|performs?|generates?|initiates?|receives?|completes?|assigns?|checks?|approves?|rejects?|verifies?|schedules?|identifies?|logs?|contacts?|evaluates?|determines?|develops?|presents?|reconciles?|investigates?|updates?|fixes?|closes?|documents?|categorizes?|diagnoses?|triages?|coordinates?|implements?|executes?|monitors?|assesses?|compiles?|convenes?|issues?|collects?|quarantines?))/);
  if (sm) { const c = sm[1].trim(); if (c.length > 1 && !["The","A","An","This","That","It","They","All","Any","Each"].includes(c)) return c; }
  return null;
}

function titleCase(s) { return s.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "); }

const VERB_MAP = {
  initiates:"Initiate",creates:"Create",prepares:"Prepare",provisions:"Provision",reviews:"Review",
  schedules:"Schedule",completes:"Complete",conducts:"Conduct",sends:"Send",receives:"Receive",
  verifies:"Verify",approves:"Approve",contacts:"Contact",generates:"Generate",logs:"Log",
  submits:"Submit",identifies:"Identify",classifies:"Classify",evaluates:"Evaluate",
  determines:"Determine",updates:"Update",adjusts:"Adjust",arranges:"Arrange",develops:"Develop",
  presents:"Present",assigns:"Assign",documents:"Document",diagnoses:"Diagnose",
  triages:"Triage",coordinates:"Coordinate",implements:"Implement",performs:"Perform",
  executes:"Execute",monitors:"Monitor",assesses:"Assess",compiles:"Compile",convenes:"Convene",
  issues:"Issue",collects:"Collect",checks:"Check",investigates:"Investigate",resubmits:"Resubmit",
  reconciles:"Reconcile",notifies:"Notify",requests:"Request",escalates:"Escalate",
  resolves:"Resolve",closes:"Close",flags:"Flag",categorizes:"Categorize",quarantines:"Quarantine",
  fixes:"Fix",retests:"Retest",
};

function extractVerbFirstName(sentence) {
  const { mainClause } = decomposeClause(sentence);
  const roleStr = extractRole(sentence);
  let afterRole = mainClause;
  if (roleStr) {
    const ri = afterRole.toLowerCase().indexOf(roleStr.toLowerCase());
    if (ri !== -1) afterRole = afterRole.substring(ri + roleStr.length).trim();
    afterRole = afterRole.replace(/^(?:then|will|must|shall|should|can)\s+/i, "").trim();
  }
  const vm = afterRole.match(/^(\w+(?:es|ies|s)?)\s+([\w\s,$'"-]{2,55}?)(?:\.|,\s+(?:which|including|using|evaluating|reviewing|checking|covering|outlining|documenting|focusing|requiring)|;|$|\s+within\s|\s+using\s|\s+through\s|\s+via\s|\s+by\s|\s+to\s+(?:confirm|ensure|determine|walk|assess)|(?:\s+and\s+))/i);
  if (vm) {
    const verb = vm[1].toLowerCase();
    let imp = VERB_MAP[verb] || verb.charAt(0).toUpperCase() + verb.slice(1).replace(/ies$/, "y").replace(/es$/, "e").replace(/s$/, "");
    if (imp.length < 3) imp = verb.charAt(0).toUpperCase() + verb.slice(1);
    const obj = vm[2].trim().replace(/,\s*$/, "");
    const name = imp + " " + obj;
    return name.length > 55 ? name.substring(0, 52) + "..." : name;
  }
  const { clauseType, leadingClause } = decomposeClause(sentence);
  if (clauseType === "conditional" && leadingClause) {
    const condText = leadingClause.replace(/^If\s+/i, "").replace(/,$/, "").trim();
    return "Evaluate " + (condText.length > 45 ? condText.substring(0, 42) + "..." : condText);
  }
  return mainClause.split(/\s+/).slice(0, 6).join(" ");
}

function inferRisk(sentence, stepType) {
  const l = sentence.toLowerCase();
  if (HIGH_RISK_VERBS.some(v => l.includes(v))) return { level: "critical", rationale: "Contains destructive or irreversible action" };
  if (stepType === "decision") return { level: "medium", rationale: "Decision point introduces branching risk" };
  if (MED_RISK_VERBS.some(v => l.includes(v))) return { level: "medium", rationale: "Involves approval or evaluation requiring judgment" };
  if (l.match(/compliance|security|audit/)) return { level: "high", rationale: "Compliance or security-sensitive activity" };
  if (l.match(/financial|payment|budget/)) return { level: "medium", rationale: "Financial activity requiring accuracy" };
  if (LOW_RISK_VERBS.some(v => l.includes(v))) return { level: "low", rationale: "Administrative or notification activity" };
  return { level: "low", rationale: "Standard process activity" };
}

function inferDuration(s) {
  const ps = [
    [/within\s+(\d+)\s+minute/i,"minutes"],[/(\d+)\s+minutes?\b/i,"minutes"],
    [/within\s+(\d+)\s+hour/i,"hours"],[/within\s+(\d+)\s+day/i,"days"],[/within\s+(\d+)\s+week/i,"weeks"],    [/within\s+(\d+)\s+month/i,"weeks",null,4],[/(\d+)\s+months?\b/i,"weeks",null,4],
    [/(\d+)\s+business\s+day/i,"days"],[/takes?\s+(?:about|approximately)?\s*(\d+)\s+hour/i,"hours"],
    [/takes?\s+(?:about|approximately)?\s*(\d+)\s+day/i,"days"],[/over\s+(\d+)\s+day/i,"days"],
    [/(\d+)\s+hours?\b/i,"hours"],[/(\d+)\s+days?\b/i,"days"],[/(\d+)\s+weeks?\b/i,"weeks"],
    [/24-hour/i,"hours",24],[/48\s*hours?/i,"hours",48],[/net-?30/i,"days",30],[/net-?60/i,"days",60],
  ];
  for (const [re,u,v] of ps) { const m = s.match(re); if (m) return { duration: v || parseInt(m[1],10), unit: u }; }
  const l = s.toLowerCase();
  if (l.match(/quick|immediate/)) return {duration:1,unit:"hours"};
  if (l.match(/review|assess|evaluat/)) return {duration:4,unit:"hours"};
  if (l.match(/deploy|implement/)) return {duration:2,unit:"days"};
  return {duration:2,unit:"hours"};
}

function detectType(sentence) {
  const { clauseType } = decomposeClause(sentence);
  if (clauseType === "conditional") return "decision";
  const l = sentence.toLowerCase();
  if (l.includes("whether ") || l.includes("depending on")) return "decision";
  if (clauseType === "scope" && l.match(/approv|require/)) return "decision";
  return "action";
}

function extractIO(s) {
  const ins = [], outs = [];
  const im = s.match(/(?:receives?|collects?|reviews?|checks?)\s+(?:the\s+)?(.{5,40}?)(?:\.|,|;|and|$)/i);
  if (im) ins.push(im[1].trim()); else if (s.toLowerCase().match(/review|check/)) ins.push("Prior step output");
  const om = s.match(/(?:creates?|generates?|produces?|sends?|submits?|issues?|compiles?)\s+(?:the\s+|a\s+|an\s+)?(.{5,40}?)(?:\.|,|;|and|$)/i);
  if (om) outs.push(om[1].trim());
  else if (s.toLowerCase().includes("report")) outs.push("Report");
  else if (s.toLowerCase().includes("approv")) outs.push("Approval decision");
  else if (s.toLowerCase().includes("notif")) outs.push("Notification");
  else outs.push("Updated process state");
  return { inputs: ins, outputs: outs };
}

function inferCategory(s) {
  const l = s.toLowerCase();
  if (l.match(/approv|sign.?off|authorize/)) return "approval";
  if (l.match(/enter|input|fill|record|log|create.*record/)) return "data-entry";
  if (l.match(/notify|email|send|contact|inform/)) return "communication";
  if (l.match(/review|assess|evaluat|check|inspect|audit/)) return "review";
  if (l.match(/convert|transform|generat|compil|calculat/)) return "transformation";
  if (l.match(/escalat|transfer|handoff|forward|assign|route/)) return "handoff";
  if (l.match(/verify|confirm|validat|test/)) return "verification";
  return "review";
}

function genId(i) { return `step_${String(i+1).padStart(3,"0")}`; }

function parseNaturalLanguage(text) {
  if (!text || !text.trim()) return [];
  const raw = text.replace(/(\d+)\.\s+/g,"|||$1. ").replace(/([a-z)]+)\)\s+/g,"|||$1) ").replace(/^[-â€¢]\s+/gm,"|||").replace(/\n/g," ||| ").split(/(?<=[.;])\s+|\|\|\|/).map(s=>s.trim()).filter(s=>s.length>15);
  const merged = [];
  for (const s of raw) { if (merged.length>0 && s.length<30 && !s.match(/^[A-Z]/)) merged[merged.length-1]+=" "+s; else merged.push(s); }

  const steps = [];
  let prevRole = null;
  for (let i=0;i<merged.length;i++) {
    const sentence = merged[i].replace(/^\d+[\.)]\s*/,"").trim();
    if (sentence.length<10) continue;
    const role = extractRole(sentence);
    if (role) prevRole = role;
    const usedRole = role || prevRole || "Unassigned";
    const stepType = detectType(sentence);
    const parallel = PARALLEL_SIGNALS.some(s=>sentence.toLowerCase().includes(s));
    const { duration, unit } = inferDuration(sentence);
    const risk = inferRisk(sentence, stepType);
    const { inputs, outputs } = extractIO(sentence);
    const category = inferCategory(sentence);
    const automatable = AUTO_VERBS.some(v=>sentence.toLowerCase().includes(v));
    const name = extractVerbFirstName(sentence);
    steps.push({
      id: genId(steps.length), name, role: usedRole, action: name, description: sentence,
      type: stepType, duration, durationUnit: unit, risk: risk.level, riskRationale: risk.rationale,
      inputs, outputs, dependencies: steps.length>0 && !parallel ? [steps[steps.length-1].id] : [],
      parallel, outcomes: stepType==="decision" ? extractOutcomes(sentence) : [],
      automatable, category,
    });
  }
  if (steps.length>0) {
    steps.unshift({ id:"step_start",name:"Initiate Process",role:"System",action:"Initiate",description:"Process begins",type:"start",duration:0,durationUnit:"hours",risk:"low",riskRationale:"Start",inputs:["Trigger"],outputs:["Process initiated"],dependencies:[],parallel:false,outcomes:[],automatable:true,category:"notification" });
    for (let i=2;i<steps.length;i++) { if (steps[i].dependencies.length===0&&!steps[i].parallel) steps[i].dependencies=[steps[i-1].id]; }
    if (steps.length>1&&steps[1].dependencies.length===0) steps[1].dependencies=["step_start"];
    steps.push({ id:"step_end",name:"Complete Process",role:"System",action:"Complete",description:"Process concludes",type:"end",duration:0,durationUnit:"hours",risk:"low",riskRationale:"End",inputs:["All completed"],outputs:["Process record"],dependencies:[steps[steps.length-1].id],parallel:false,outcomes:[],automatable:true,category:"notification" });
  }
  return steps;
}

function extractOutcomes(s) {
  const l=s.toLowerCase();
  if (l.includes("approved")&&l.includes("rejected")) return ["Approved","Rejected"];
  if (l.includes("approve")&&l.includes("decline")) return ["Approved","Declined"];
  if (l.includes("pass")&&l.includes("fail")) return ["Pass","Fail"];
  if (l.includes("approve")) return ["Approved","Not Approved"];
  if (l.includes("resolve")) return ["Resolved","Unresolved"];
  if (l.includes("exceed")||l.includes("above")||l.includes("threshold")) return ["Above Threshold","Within Threshold"];
  if (l.includes("proceed")||l.includes("continue")) return ["Proceed","Do Not Proceed"];
  if (l.includes("compli")||l.includes("conform")) return ["Compliant","Non-Compliant"];
  if (l.includes("accept")) return ["Accepted","Rejected"];
  if (l.includes("escalat")) return ["Escalate","Handle Internally"];
  if (l.includes("between")&&l.includes("and")) return ["Tier 1","Tier 2","Tier 3"];
  if (l.includes("either")||l.includes(" or ")) {
    const orMatch=s.match(/either\s+(.{3,40}?)\s+or\s+(.{3,40?})(?:\.|,|$)/i);
    if (orMatch) return [orMatch[1].trim(),orMatch[2].trim()];
  }
  return ["Yes","No"];
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   STATE
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const PAGES = [
  { id: "input", label: "Step Builder", icon: Edit3 },
  { id: "visualization", label: "Process Map", icon: Network },
  { id: "analysis", label: "Intelligence", icon: BarChart3 },
  { id: "brd", label: "Documentation", icon: FileText }
];

const initialState = {
  process:{name:"Untitled Process",description:"",version:"1.0",author:"Cherrystone Consulting",status:"Draft",createdDate:new Date().toISOString().split("T")[0]},
  steps:[],
  ui:{activePage:"input",inputMode:"natural",selectedStepId:null,showDetailPanel:false,toast:null,vizMode:"flowchart",nodeSlice:"risk",sidebarOpen:true},
  analysis:{costRates:{},currency:"USD"},
};

function reducer(state,action) {
  switch(action.type) {
    case "SET_PROCESS": return {...state,process:{...state.process,...action.payload}};
    case "SET_STEPS": return {...state,steps:action.payload};
    case "ADD_STEP": { const ns={id:genId(state.steps.length),name:"Define New Activity",role:"Unassigned",action:"",description:"",type:"action",duration:1,durationUnit:"hours",risk:"low",riskRationale:"Default",inputs:[],outputs:[],dependencies:state.steps.length>0?[state.steps[state.steps.length-1].id]:[],parallel:false,outcomes:[],automatable:false,category:"review",...action.payload}; return {...state,steps:[...state.steps,ns]}; }
    case "UPDATE_STEP": return {...state,steps:state.steps.map(s=>s.id===action.payload.id?{...s,...action.payload.changes}:s)};
    case "DELETE_STEP": return {...state,steps:state.steps.filter(s=>s.id!==action.payload),ui:{...state.ui,selectedStepId:state.ui.selectedStepId===action.payload?null:state.ui.selectedStepId}};
    case "DUPLICATE_STEP": { const o=state.steps.find(s=>s.id===action.payload); if(!o)return state; const d={...o,id:genId(state.steps.length),name:o.name+" (copy)"}; const idx=state.steps.findIndex(s=>s.id===action.payload); const ns=[...state.steps]; ns.splice(idx+1,0,d); return {...state,steps:ns}; }
    case "REORDER_STEPS": { const {fromIndex,toIndex}=action.payload; const a=[...state.steps]; const [m]=a.splice(fromIndex,1); a.splice(toIndex,0,m); return {...state,steps:a}; }
    case "SET_UI": return {...state,ui:{...state.ui,...action.payload}};
    case "SET_COST_RATE": return {...state,analysis:{...state.analysis,costRates:{...state.analysis.costRates,[action.payload.role]:action.payload.rate}}};
    case "SET_CURRENCY": return {...state,analysis:{...state.analysis,currency:action.payload}};
    case "SHOW_TOAST": return {...state,ui:{...state.ui,toast:action.payload}};
    case "CLEAR_TOAST": return {...state,ui:{...state.ui,toast:null}};
    default: return state;
  }
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   ANALYSIS FUNCTIONS
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function toHours(d,u){return u==="minutes"?d/60:u==="days"?d*8:u==="weeks"?d*40:d;}
function computeMetrics(steps){const ps=steps.filter(s=>s.type!=="start"&&s.type!=="end");const t=ps.length;const roles=_.uniq(ps.map(s=>s.role));const dec=ps.filter(s=>s.type==="decision").length;let ho=0;for(let i=1;i<ps.length;i++){if(ps[i].role!==ps[i-1].role)ho++;}const pg=ps.filter(s=>s.parallel).length;const td=ps.reduce((s,p)=>s+toHours(p.duration,p.durationUnit),0);const cp=computeCriticalPath(steps);const cpd=cp.reduce((s,p)=>s+toHours(p.duration,p.durationUnit),0);const raw=(t*1)+(dec*2.5)+(roles.length*1.5)+(ho*2)+(pg*1.5);const ci=Math.min(10,Math.max(1,raw/5));const ac=ps.filter(s=>s.automatable).length;const ap=t>0?(ac/t)*100:0;const durs=ps.map(s=>toHours(s.duration,s.durationUnit));const md=_.mean(durs)||0;const sd=durs.length>1?Math.sqrt(_.sumBy(durs,d=>Math.pow(d-md,2))/durs.length):0;return{totalSteps:t,roles,decisions:dec,handoffs:ho,parallelGates:pg,totalDurationHours:td,criticalPath:cp,criticalPathDuration:cpd,complexityIndex:Math.round(ci*10)/10,automationPotential:Math.round(ap),automatableCount:ac,bottleneckSteps:ps.filter(s=>toHours(s.duration,s.durationUnit)>md+sd),meanDuration:md,stdDuration:sd,roleWorkload:_.countBy(ps,"role")};}
function computeCriticalPath(steps){if(!steps.length)return[];const im={};steps.forEach(s=>{im[s.id]=s;});const dist={},prev={};steps.forEach(s=>{dist[s.id]=0;prev[s.id]=null;});const sorted=topoSort(steps);for(const s of sorted){for(const dep of s.dependencies){if(im[dep]&&dist[dep]+toHours(im[dep].duration,im[dep].durationUnit)>dist[s.id]){dist[s.id]=dist[dep]+toHours(im[dep].duration,im[dep].durationUnit);prev[s.id]=dep;}}}let mx=null,md=-1;for(const[id,d]of Object.entries(dist)){if(d>md){md=d;mx=id;}}const p=[];let c=mx;while(c){if(im[c])p.unshift(im[c]);c=prev[c];}return p;}
function topoSort(steps){const ids=new Set(steps.map(s=>s.id));const inD={},adj={};steps.forEach(s=>{inD[s.id]=0;adj[s.id]=[];});steps.forEach(s=>{for(const d of s.dependencies){if(ids.has(d)){adj[d].push(s.id);inD[s.id]++;}}});const q=steps.filter(s=>inD[s.id]===0).map(s=>s.id),r=[],im={};steps.forEach(s=>{im[s.id]=s;});while(q.length){const id=q.shift();r.push(im[id]);for(const n of adj[id]){inD[n]--;if(inD[n]===0)q.push(n);}}return r.length<steps.length?[...r,...steps.filter(s=>!r.find(x=>x.id===s.id))]:r;}
function computeRACI(steps){const ps=steps.filter(s=>s.type!=="start"&&s.type!=="end");const roles=_.uniq(ps.map(s=>s.role)).filter(r=>r!=="System");const matrix=[];for(const step of ps){const row={step,assignments:{}};roles.forEach(r=>{row.assignments[r]="";});row.assignments[step.role]="R";const na=ps.find(s=>s.type==="decision"&&ps.indexOf(s)>ps.indexOf(step)&&s.role!==step.role);if(na&&row.assignments[na.role]!=="R")row.assignments[na.role]="A";const desc=step.description.toLowerCase();for(const r of roles){if(r===step.role||row.assignments[r]==="A")continue;if(desc.includes(r.toLowerCase()))row.assignments[r]="C";}const si=ps.indexOf(step);const ar=[];if(si>0)ar.push(ps[si-1].role);if(si<ps.length-1)ar.push(ps[si+1].role);for(const a of ar){if(a!==step.role&&!row.assignments[a])row.assignments[a]="I";}matrix.push(row);}return{roles,matrix};}
function computeHealth(steps,metrics){const ps=steps.filter(s=>s.type!=="start"&&s.type!=="end");if(!ps.length)return{efficiency:0,clarity:0,riskExposure:0,roleBalance:0,automationReadiness:0,decisionDensity:0,overall:0};const ad=metrics.totalDurationHours/Math.max(metrics.totalSteps,1);const eff=Math.max(0,Math.min(100,100-(ad-2)*10));const cla=(ps.filter(s=>s.description&&s.description.length>20).length/ps.length)*100;const hr=ps.filter(s=>s.risk==="high"||s.risk==="critical").length;const re=Math.max(0,100-(hr/ps.length)*200);const wl=Object.values(metrics.roleWorkload);const ws=wl.length>1?Math.sqrt(_.sumBy(wl,w=>Math.pow(w-_.mean(wl),2))/wl.length):0;const rb=Math.max(0,100-ws*15);const ar=metrics.automationPotential;const dr=metrics.decisions/Math.max(metrics.totalSteps,1);const dd=dr>0.4?100-(dr-0.4)*200:dr<0.05?dr*1000:80+(0.2-Math.abs(dr-0.2))*100;const ov=(eff*0.2+cla*0.15+re*0.2+rb*0.15+ar*0.15+Math.max(0,Math.min(100,dd))*0.15);return{efficiency:Math.round(Math.max(0,Math.min(100,eff))),clarity:Math.round(Math.max(0,Math.min(100,cla))),riskExposure:Math.round(Math.max(0,Math.min(100,re))),roleBalance:Math.round(Math.max(0,Math.min(100,rb))),automationReadiness:Math.round(Math.max(0,Math.min(100,ar))),decisionDensity:Math.round(Math.max(0,Math.min(100,dd))),overall:Math.round(Math.max(0,Math.min(100,ov)))};}
function genMitigation(s){const m=[];if(s.risk==="critical"||s.risk==="high"){m.push(`Add secondary review gate before "${s.name}"`);if(s.type==="decision")m.push("Implement decision audit trail with mandatory rationale");if(s.category==="approval")m.push("Enforce dual-approval with segregation of duties");if(s.duration>4)m.push(`Introduce SLA monitoring with ${Math.ceil(s.duration*0.75)} ${s.durationUnit} escalation trigger`);}if(s.risk==="medium"){if(s.type==="decision")m.push("Create standardized decision criteria checklist");m.push("Implement automated status notifications");if(s.category==="handoff")m.push("Add structured handoff template");}if(s.automatable)m.push("Evaluate RPA or workflow automation");if(!m.length)m.push("Monitor step performance against baseline KPIs");return m;}
function getDefaultRate(r){const l=r.toLowerCase();if(l.match(/vp|director|cfo|cpo/))return 175;if(l.match(/manager|lead|senior|architect/))return 125;if(l.match(/analyst|specialist|coordinator/))return 95;if(l.match(/clerk|agent/))return 65;if(l==="system")return 0;return 85;}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   UI HELPERS
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const Toast = memo(function Toast({toast,onDismiss}){if(!toast)return null;const bg=toast.type==="success"?C.green:toast.type==="error"?C.cherryMid:C.amber;return(<div style={{position:"fixed",top:20,right:20,zIndex:9999,background:bg,color:"#fff",padding:"12px 20px",borderRadius:10,fontFamily:FONT,fontSize:13,fontWeight:500,boxShadow:`0 4px 24px ${bg}44`,display:"flex",alignItems:"center",gap:8,animation:"slideIn 0.3s ease"}}>{toast.type==="success"?<CheckCircle size={16}/>:toast.type==="error"?<AlertTriangle size={16}/>:<Info size={16}/>}{toast.message}<button onClick={onDismiss} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",marginLeft:8}}><X size={14}/></button></div>);});
const Badge = memo(function Badge({label,color,bg,small}){return(<span style={{display:"inline-block",padding:small?"1px 8px":"3px 10px",borderRadius:12,fontSize:small?10:11,fontWeight:600,background:bg||color+"18",color,letterSpacing:"0.3px"}}>{label}</span>);});

const Card = memo(function Card({children,style,elevated}){return(<div style={{background:C.white,borderRadius:12,padding:20,boxShadow:elevated?"0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)":"0 2px 8px rgba(0,0,0,0.06)",border:`1px solid ${C.grey200}`,...style}}>{children}</div>);});

const MetricCard = memo(function MetricCard({icon:Icon,label,value,sub,accent}){const ac=accent||C.cherryDark;return(<Card elevated style={{flex:1,minWidth:150,borderTop:`3px solid ${ac}`}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><div style={{width:32,height:32,borderRadius:8,background:ac+"12",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon size={16} style={{color:ac}}/></div><span style={{color:C.grey500,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px"}}>{label}</span></div><div style={{color:C.charcoal,fontSize:28,fontWeight:800}}>{value}</div>{sub&&<div style={{color:C.grey500,fontSize:11,marginTop:4}}>{sub}</div>}</Card>);});

const EmptyState = memo(function EmptyState({icon:Icon,title,description,actionLabel,onAction}){return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:60,textAlign:"center"}}><div style={{width:80,height:80,borderRadius:"50%",background:C.cherryDark+"0A",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}><Icon size={32} style={{color:C.cherryDark}}/></div><h3 style={{color:C.charcoal,fontSize:18,fontWeight:700,marginBottom:8,fontFamily:FONT}}>{title}</h3><p style={{color:C.grey500,fontSize:13,maxWidth:400,lineHeight:1.6,fontFamily:FONT}}>{description}</p>{actionLabel&&<button onClick={onAction} style={{marginTop:20,padding:"10px 28px",background:`linear-gradient(135deg,${C.cherryDark},${C.cherryMid})`,color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:FONT}}>{actionLabel}</button>}</div>);});

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SIDEBAR
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const Sidebar = memo(function Sidebar({state,dispatch}){
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isOpen = isMobile ? state.ui.sidebarOpen : true;

  return(
    <div style={{
      width: isMobile ? (isOpen ? "100%" : "0") : 260,
      minWidth: isMobile ? 0 : 260,
      height: "100vh",
      background: `linear-gradient(180deg, ${C.cherryDark}, ${C.cherryMid})`,
      display: "flex",
      flexDirection: "column",
      fontFamily: FONT,
      boxShadow: "2px 0 12px rgba(0,0,0,0.1)",
      position: isMobile ? "fixed" : "relative",
      left: 0,
      top: 0,
      zIndex: 1000,
      transition: "all 0.3s ease-in-out",
      overflow: "hidden",
      opacity: isMobile && !isOpen ? 0 : 1,
      pointerEvents: isMobile && !isOpen ? "none" : "auto"
    }}>
      <div style={{padding:"20px 18px 16px",borderBottom:"1px solid rgba(255,255,255,0.15)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <div style={{width:38,height:38,borderRadius:10,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Workflow size={20} style={{color:"#fff"}}/></div>
          <div><div style={{color:"#fff",fontSize:16,fontWeight:800}}>BIO-stone</div><div style={{color:"rgba(255,255,255,0.6)",fontSize:9,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase"}}>V3 - Cherrystone</div></div>
        </div>
        <input value={state.process.name} onChange={e=>dispatch({type:"SET_PROCESS",payload:{name:e.target.value}})} style={{width:"100%",padding:"9px 12px",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:8,color:"#fff",fontSize:13,fontFamily:FONT,outline:"none"}} placeholder="Process name..."/>
      </div>
      <div style={{padding:"12px 10px",flex:1}}>
        {PAGES.map(p=>{const active=state.ui.activePage===p.id;const Ic=p.icon;return(
          <button key={p.id} onClick={()=>{dispatch({type:"SET_UI",payload:{activePage:p.id, sidebarOpen: !isMobile}});}} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"11px 14px",marginBottom:4,borderRadius:10,background:active?"rgba(255,255,255,0.15)":"transparent",border:"none",color:active?"#fff":"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:13,fontWeight:active?600:400,fontFamily:FONT,transition:"all 0.2s"}}><Ic size={18} style={{color:active?"#fff":"rgba(255,255,255,0.5)"}}/>{p.label}</button>
        );})}
      </div>
      {isMobile && isOpen && (
        <button 
          onClick={() => dispatch({type:"SET_UI",payload:{sidebarOpen: false}})}
          style={{position:"absolute", top:10, right:10, background:"rgba(255,255,255,0.1)", border:"none", borderRadius:8, padding:8, color:"white", cursor:"pointer"}}
        >
          <X size={20}/>
        </button>
      )}
      <div style={{padding:"14px 18px",borderTop:"1px solid rgba(255,255,255,0.15)"}}>
        {[["Steps",state.steps.filter(s=>s.type!=="start"&&s.type!=="end").length],["Version",state.process.version],["Status",state.process.status]].map(([l,v])=>(<div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{color:"rgba(255,255,255,0.5)",fontSize:11}}>{l}</span><span style={{color:"#fff",fontSize:11,fontWeight:600}}>{v}</span></div>))}
      </div>
    </div>
  );
});

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   NL INPUT
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const NLInput = memo(function NLInput({state,dispatch}){
  const [text,setText]=useState("");
  const [parsing,setParsing]=useState(false);
  const [stage,setStage]=useState("");
  const [progress,setProgress]=useState(0);
  const handleParse=useCallback(()=>{
    if(!text.trim()){dispatch({type:"SHOW_TOAST",payload:{type:"error",message:"Please enter a process description."}});return;}
    setParsing(true);setProgress(0);
    const stages=[{msg:"Decomposing clauses...",pct:14},{msg:"Extracting roles from main clauses...",pct:30},{msg:"Normalizing verb-first activity names...",pct:48},{msg:"Classifying decisions vs. actions...",pct:62},{msg:"Mapping dependencies and parallelism...",pct:78},{msg:"Computing risk and automation profiles...",pct:92},{msg:"Building process model...",pct:100}];
    let i=0;
    const iv=setInterval(()=>{if(i<stages.length){setStage(stages[i].msg);setProgress(stages[i].pct);i++;}else{clearInterval(iv);const steps=parseNaturalLanguage(text);dispatch({type:"SET_STEPS",payload:steps});setParsing(false);setStage("");setProgress(0);if(steps.length>0){dispatch({type:"SHOW_TOAST",payload:{type:"success",message:`Parsed ${steps.length-2} process steps.`}});dispatch({type:"SET_UI",payload:{activePage:"visualization"}});}else dispatch({type:"SHOW_TOAST",payload:{type:"error",message:"No steps found. Try a more detailed description."}});}},300);
  },[text,dispatch]);
  return(
    <div style={{padding:28,maxWidth:920}}>
      <h2 style={{color:C.charcoal,fontSize:24,fontWeight:800,marginBottom:6,fontFamily:FONT}}>Natural Language Input</h2>
      <p style={{color:C.grey500,fontSize:13,marginBottom:20,fontFamily:FONT}}>Describe your business process. Activities are auto-named with verb-first conventions; roles are extracted from clause subjects.</p>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {Object.entries(TEMPLATES).map(([k,t])=>(<button key={k} onClick={()=>{setText(t.description);dispatch({type:"SET_PROCESS",payload:{name:t.name}});}} style={{padding:"7px 16px",borderRadius:8,background:C.grey100,border:`1px solid ${C.grey300}`,color:C.grey600,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:FONT,transition:"all 0.2s"}}>{t.name}</button>))}
      </div>
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="e.g., The hiring manager submits a job requisition to HR..." style={{width:"100%",minHeight:220,padding:16,background:C.white,border:`1px solid ${C.grey300}`,borderRadius:12,color:C.charcoal,fontSize:13,fontFamily:FONT,lineHeight:1.7,resize:"vertical",outline:"none"}}/>
      <div style={{display:"flex",alignItems:"center",gap:12,marginTop:14}}>
        <button onClick={handleParse} disabled={parsing} style={{display:"flex",alignItems:"center",gap:8,padding:"11px 30px",borderRadius:10,background:parsing?C.grey400:`linear-gradient(135deg,${C.cherryDark},${C.cherryMid})`,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:parsing?"wait":"pointer",fontFamily:FONT,boxShadow:parsing?"none":`0 4px 16px ${C.cherryDark}33`}}>
          {parsing?<RefreshCw size={16} style={{animation:"spin 1s linear infinite"}}/>:<Zap size={16}/>}{parsing?"Parsing...":"Parse Process"}
        </button>
        <span style={{color:C.grey500,fontSize:12}}>{text.length} chars</span>
      </div>
      {parsing&&(<div style={{marginTop:20}}><div style={{height:5,background:C.grey200,borderRadius:3,overflow:"hidden",marginBottom:10}}><div style={{height:"100%",width:`${progress}%`,background:`linear-gradient(90deg,${C.cherryDark},${C.cherryLight})`,borderRadius:3,transition:"width 0.3s ease"}}/></div><div style={{display:"flex",alignItems:"center",gap:8}}><Cpu size={14} style={{color:C.cherryMid,animation:"spin 2s linear infinite"}}/><p style={{color:C.grey600,fontSize:12,fontFamily:FONT}}>{stage}</p></div></div>)}
    </div>
  );
});

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   STEP BUILDER + DETAIL PANEL + IMPORT
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const StepBuilder = memo(function StepBuilder({state,dispatch}){
  const ps=useMemo(()=>state.steps.filter(s=>s.type!=="start"&&s.type!=="end"),[state.steps]);
  if(!ps.length)return <div style={{padding:28}}><EmptyState icon={ClipboardList} title="No Steps" description="Add steps manually." actionLabel="Add First Step" onAction={()=>dispatch({type:"ADD_STEP"})}/></div>;
  return(
    <div style={{padding:28,maxWidth:1000}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <h2 style={{color:C.charcoal,fontSize:22,fontWeight:800,fontFamily:FONT}}>Step Builder</h2>
        <button onClick={()=>dispatch({type:"ADD_STEP"})} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 18px",background:`linear-gradient(135deg,${C.cherryDark},${C.cherryMid})`,border:"none",borderRadius:8,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:FONT}}><Plus size={16}/>Add Step</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {ps.map((step,idx)=>{
          const isRowMobile = window.innerWidth < 640;
          return (
            <div key={step.id} onClick={()=>dispatch({type:"SET_UI",payload:{selectedStepId:step.id,showDetailPanel:true}})} style={{
              display:"flex",
              flexDirection: isRowMobile ? "column" : "row",
              alignItems: isRowMobile ? "flex-start" : "center",
              gap: isRowMobile ? 8 : 10,
              padding: isRowMobile ? "12px 16px" : "10px 14px",
              background:state.ui.selectedStepId===step.id?C.cherryDark+"08":C.white,
              border:`1px solid ${state.ui.selectedStepId===step.id?C.cherryMid+"44":C.grey300}`,
              borderRadius:12,
              cursor:"pointer",
              transition:"all 0.2s"
            }}>
              <div style={{display:"flex", alignItems:"center", gap:10, width:"100%"}}>
                <span style={{color:C.grey500,fontSize:11,fontWeight:700,minWidth:28}}>#{idx+1}</span>
                <input 
                  value={step.name} 
                  onChange={e=>{e.stopPropagation();dispatch({type:"UPDATE_STEP",payload:{id:step.id,changes:{name:e.target.value}}});}} 
                  onClick={e=>e.stopPropagation()} 
                  style={{flex:1,background:"transparent",border:"none",color:C.charcoal,fontSize:13,fontWeight:600,fontFamily:FONT,outline:"none"}}
                />
                {!isRowMobile && (
                  <div style={{display:"flex", gap:2}} onClick={e=>e.stopPropagation()}>
                    <button onClick={()=>{const fi=state.steps.findIndex(s=>s.id===step.id);if(fi>0)dispatch({type:"REORDER_STEPS",payload:{fromIndex:fi,toIndex:fi-1}});}} style={{background:"none",border:"none",color:C.grey400,cursor:"pointer",padding:2}}><ChevronUp size={14}/></button>
                    <button onClick={()=>{const fi=state.steps.findIndex(s=>s.id===step.id);if(fi<state.steps.length-1)dispatch({type:"REORDER_STEPS",payload:{fromIndex:fi,toIndex:fi+1}});}} style={{background:"none",border:"none",color:C.grey400,cursor:"pointer",padding:2}}><ChevronDown size={14}/></button>
                  </div>
                )}
              </div>
              
              <div style={{display:"flex", flexWrap:"wrap", alignItems:"center", gap:8, width:"100%", justifyContent: "space-between"}}>
                <div style={{display:"flex", gap:8, alignItems:"center"}}>
                  <span style={{color:C.grey600,fontSize:11, fontWeight: 500}}>{step.role}</span>
                  <Badge label={step.type} color={C.cherryMid} small/>
                  <Badge label={step.risk} color={RISK_COLORS[step.risk]} bg={RISK_BG[step.risk]} small/>
                  <span style={{color:C.grey500,fontSize:10}}>{step.duration}{step.durationUnit.charAt(0)}</span>
                </div>
                
                <div style={{display:"flex",gap:4}} onClick={e=>e.stopPropagation()}>
                  {isRowMobile && (
                    <>
                      <button onClick={()=>{const fi=state.steps.findIndex(s=>s.id===step.id);if(fi>0)dispatch({type:"REORDER_STEPS",payload:{fromIndex:fi,toIndex:fi-1}});}} style={{background:C.grey100, border:`1px solid ${C.grey200}`, color:C.grey600, borderRadius:6, padding:4}}><ChevronUp size={14}/></button>
                      <button onClick={()=>{const fi=state.steps.findIndex(s=>s.id===step.id);if(fi<state.steps.length-1)dispatch({type:"REORDER_STEPS",payload:{fromIndex:fi,toIndex:fi+1}});}} style={{background:C.grey100, border:`1px solid ${C.grey200}`, color:C.grey600, borderRadius:6, padding:4}}><ChevronDown size={14}/></button>
                    </>
                  )}
                  <button onClick={()=>dispatch({type:"DUPLICATE_STEP",payload:step.id})} style={{background:C.grey100, border:`1px solid ${C.grey200}`, color:C.grey600, borderRadius:6, padding:4}}><Copy size={14}/></button>
                  <button onClick={()=>dispatch({type:"DELETE_STEP",payload:step.id})} style={{background:C.redLight, border:`1px solid ${C.cherryMid}33`, color:C.cherryMid, borderRadius:6, padding:4}}><Trash2 size={14}/></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

const StepDetail = memo(function StepDetail({step,dispatch,onClose}){
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if(!step)return null;

  const fs={width:"100%",padding:"8px 12px",background:C.grey50,border:`1px solid ${C.grey300}`,borderRadius:8,color:C.charcoal,fontSize:12,fontFamily:FONT,outline:"none"};
  const ls={color:C.grey500,fontSize:10,fontWeight:700,marginBottom:4,display:"block",textTransform:"uppercase",letterSpacing:"0.8px"};
  const ch=(f,v)=>dispatch({type:"UPDATE_STEP",payload:{id:step.id,changes:{[f]:v}}});
  return(
    <div style={{
      width: isMobile ? "100%" : 320,
      minWidth: isMobile ? 0 : 320,
      height: isMobile ? "90vh" : "100vh",
      background: C.white,
      borderLeft: isMobile ? "none" : `1px solid ${C.grey300}`,
      borderTop: isMobile ? `1px solid ${C.grey300}` : "none",
      padding: "18px 16px",
      overflow: "auto",
      fontFamily: FONT,
      boxShadow: isMobile ? "0 -8px 48px rgba(0,0,0,0.15)" : "-4px 0 16px rgba(0,0,0,0.06)",
      position: isMobile ? "fixed" : "relative",
      bottom: 0,
      right: 0,
      zIndex: 1100,
      borderRadius: isMobile ? "32px 32px 0 0" : 0
    }}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><h3 style={{color:C.charcoal,fontSize:15,fontWeight:700}}>Step Details</h3><button onClick={onClose} style={{background:"none",border:"none",color:C.grey400,cursor:"pointer"}}><X size={18}/></button></div>
      {[{l:"Name (verb-first)",f:"name"},{l:"Role",f:"role"},{l:"Action",f:"action"}].map(x=>(<div key={x.f} style={{marginBottom:12}}><label style={ls}>{x.l}</label><input value={step[x.f]||""} onChange={e=>ch(x.f,e.target.value)} style={fs}/></div>))}
      <div style={{marginBottom:12}}><label style={ls}>Description</label><textarea value={step.description||""} onChange={e=>ch("description",e.target.value)} style={{...fs,minHeight:70,resize:"vertical"}}/></div>
      <div style={{display:"flex",gap:8,marginBottom:12}}><div style={{flex:1}}><label style={ls}>Type</label><select value={step.type} onChange={e=>ch("type",e.target.value)} style={fs}>{["action","decision","start","end","parallel-gateway"].map(t=><option key={t} value={t}>{t}</option>)}</select></div><div style={{flex:1}}><label style={ls}>Risk</label><select value={step.risk} onChange={e=>ch("risk",e.target.value)} style={fs}>{["low","medium","high","critical"].map(r=><option key={r} value={r}>{r}</option>)}</select></div></div>
      <div style={{display:"flex",gap:8,marginBottom:12}}><div style={{flex:1}}><label style={ls}>Duration</label><input type="number" value={step.duration} onChange={e=>ch("duration",parseInt(e.target.value)||0)} style={fs}/></div><div style={{flex:1}}><label style={ls}>Unit</label><select value={step.durationUnit} onChange={e=>ch("durationUnit",e.target.value)} style={fs}>{DURATION_UNITS.map(u=><option key={u} value={u}>{u}</option>)}</select></div></div>
      <div style={{marginBottom:12}}><label style={ls}>Risk Rationale</label><textarea value={step.riskRationale||""} onChange={e=>ch("riskRationale",e.target.value)} style={{...fs,minHeight:50,resize:"vertical"}}/></div>
      <div style={{display:"flex",gap:16}}><label style={{...ls,display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}><input type="checkbox" checked={step.parallel} onChange={e=>ch("parallel",e.target.checked)}/>Parallel</label><label style={{...ls,display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}><input type="checkbox" checked={step.automatable} onChange={e=>ch("automatable",e.target.checked)}/>Automatable</label></div>
    </div>
  );
});

const DocImport = memo(function DocImport({dispatch}){
  const [text,setText]=useState("");
  const [preview,setPreview]=useState(null);
  return(
    <div style={{padding:28,maxWidth:900}}>
      <h2 style={{color:C.charcoal,fontSize:22,fontWeight:800,marginBottom:6,fontFamily:FONT}}>Document Import</h2>
      <p style={{color:C.grey500,fontSize:13,marginBottom:20,fontFamily:FONT}}>Paste CSV or plain text.</p>
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Name,Role,Description,Duration,Risk" style={{width:"100%",minHeight:180,padding:16,background:C.white,border:`1px solid ${C.grey300}`,borderRadius:12,color:C.charcoal,fontSize:13,fontFamily:"monospace",lineHeight:1.5,resize:"vertical",outline:"none"}}/>
      <div style={{display:"flex",gap:10,marginTop:14}}>
        <button onClick={()=>{if(!text.trim())return;const lines=text.split("\n").filter(l=>l.trim());if(lines[0]&&lines[0].includes(",")){const h=lines[0].split(",").map(x=>x.trim());const rows=lines.slice(1).map(l=>{const c=l.split(",").map(x=>x.trim());const r={};h.forEach((x,i)=>{r[x]=c[i]||"";});return r;});setPreview({type:"csv",headers:h,rows});}else setPreview({type:"text",steps:parseNaturalLanguage(text)});}} style={{padding:"8px 20px",background:C.grey100,border:`1px solid ${C.grey300}`,borderRadius:8,color:C.charcoal,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:FONT}}><Eye size={14} style={{marginRight:6}}/>Preview</button>
        {preview&&<button onClick={()=>{if(preview.type==="text")dispatch({type:"SET_STEPS",payload:preview.steps});else{const steps=preview.rows.map((r,i)=>({id:genId(i),name:r.Name||r.Step||`Step ${i+1}`,role:r.Role||"Unassigned",action:"",description:r.Description||"",type:"action",duration:parseInt(r.Duration)||2,durationUnit:"hours",risk:r.Risk||"low",riskRationale:"Imported",inputs:[],outputs:[],dependencies:i>0?[genId(i-1)]:[],parallel:false,outcomes:[],automatable:false,category:"review"}));dispatch({type:"SET_STEPS",payload:steps});}dispatch({type:"SHOW_TOAST",payload:{type:"success",message:"Imported."}});dispatch({type:"SET_UI",payload:{activePage:"visualization"}});}} style={{padding:"8px 20px",background:`linear-gradient(135deg,${C.cherryDark},${C.cherryMid})`,border:"none",borderRadius:8,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:FONT}}><Check size={14} style={{marginRight:6}}/>Import</button>}
      </div>
    </div>
  );
});

const InputPage = memo(function InputPage({state,dispatch}){
  const tabs=[{id:"natural",label:"Natural Language",icon:Zap},{id:"builder",label:"Step Builder",icon:ClipboardList},{id:"import",label:"Import",icon:Upload}];
  return(
    <div>
      <div style={{display:"flex",gap:2,padding:"16px 28px 0",borderBottom:`1px solid ${C.grey200}`}}>
        {tabs.map(t=>{const active=state.ui.inputMode===t.id;const Ic=t.icon;return(<button key={t.id} onClick={()=>dispatch({type:"SET_UI",payload:{inputMode:t.id}})} style={{display:"flex",alignItems:"center",gap:6,padding:"10px 18px",background:active?C.white:"transparent",borderBottom:active?`2px solid ${C.cherryDark}`:"2px solid transparent",border:"none",borderRadius:"8px 8px 0 0",color:active?C.charcoal:C.grey500,cursor:"pointer",fontSize:13,fontWeight:active?600:400,fontFamily:FONT}}><Ic size={15}/>{t.label}</button>);})}
      </div>
      {state.ui.inputMode==="natural"&&<NLInput state={state} dispatch={dispatch}/>}
      {state.ui.inputMode==="builder"&&<StepBuilder state={state} dispatch={dispatch}/>}
      {state.ui.inputMode==="import"&&<DocImport dispatch={dispatch}/>}
    </div>
  );
});

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   FLOWCHART â€” Clean 2D with proper Bezier curves
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const FlowchartView = memo(function FlowchartView({steps,onSelect}){
  const roles = useMemo(()=>_.uniq(steps.map(s=>s.role)),[steps]);
  const layout = useMemo(()=>{
    const laneH=110;const nodeW=170;const nodeH=52;const xGap=200;const yPad=60;const labelW=140;
    const roleLaneY={};roles.forEach((r,i)=>{roleLaneY[r]=yPad+i*laneH;});
    const nodes=[];let xPos=labelW+40;
    for(const step of steps){
      const w=step.type==="start"||step.type==="end"?52:step.type==="decision"?80:nodeW;
      const h=step.type==="start"||step.type==="end"?52:step.type==="decision"?52:nodeH;
      nodes.push({...step,x:xPos,y:(roleLaneY[step.role]||yPad)+laneH/2-h/2,w,h});
      xPos+=step.type==="start"||step.type==="end"?100:xGap;
    }
    const totalW=xPos+60;const totalH=roles.length*laneH+yPad*2;
    const idMap={};nodes.forEach(n=>{idMap[n.id]=n;});
    const edges=[];
    for(const node of nodes){for(const depId of node.dependencies){const src=idMap[depId];if(!src)continue;
      const sx=src.x+src.w;const sy=src.y+src.h/2;const tx=node.x;const ty=node.y+node.h/2;
      edges.push({sx,sy,tx,ty,isDec:node.type==="decision",isPar:node.parallel});
    }}
    return{nodes,edges,roleLaneY,laneH,totalW,totalH,labelW,yPad};
  },[steps,roles]);

  if(!steps.length)return <EmptyState icon={GitBranch} title="No Process Data" description="Parse or build a process first."/>;

  return(
    <div style={{overflow:"auto",width:"100%",height:"calc(100vh - 130px)",background:C.grey50}}>
      <svg width={layout.totalW} height={layout.totalH} style={{fontFamily:FONT}}>
        <defs>
          <marker id="arrN" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill={C.grey500}/></marker>
          <marker id="arrD" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill={C.cherryMid}/></marker>
          <marker id="arrP" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill={C.green}/></marker>
        </defs>
        {/* Swimlanes */}
        {roles.map((role,i)=>{const ly=layout.roleLaneY[role];return(<g key={role}>
          <rect x={0} y={ly} width={layout.totalW} height={layout.laneH} fill={i%2===0?C.grey50:C.grey100} stroke={C.grey200} strokeWidth={0.5}/>
          <rect x={8} y={ly+layout.laneH/2-14} width={layout.labelW-16} height={28} rx={6} fill={C.cherryDark}/>
          <text x={layout.labelW/2} y={ly+layout.laneH/2+1} fill="#fff" fontSize={10} fontWeight={700} textAnchor="middle" dominantBaseline="middle">{role.length>20?role.substring(0,18)+"...":role}</text>
        </g>);})}
        {/* Bezier arrows */}
        {layout.edges.map((e,i)=>{const dx=e.tx-e.sx;const cp=Math.max(40,Math.abs(dx)*0.35);return(
          <path key={`e${i}`} d={`M ${e.sx},${e.sy} C ${e.sx+cp},${e.sy} ${e.tx-cp},${e.ty} ${e.tx},${e.ty}`} fill="none" stroke={e.isDec?C.cherryMid+"88":e.isPar?C.green+"88":C.grey400} strokeWidth={1.5} strokeDasharray={e.isDec?"8,4":e.isPar?"4,4":"none"} markerEnd={e.isDec?"url(#arrD)":e.isPar?"url(#arrP)":"url(#arrN)"}/>
        );})}
        {/* Nodes */}
        {layout.nodes.map(node=>{const rc=RISK_COLORS[node.risk]||C.grey400;
          if(node.type==="start"||node.type==="end"){return(<g key={node.id} style={{cursor:"pointer"}} onClick={()=>onSelect&&onSelect(node.id)}>
            <circle cx={node.x+node.w/2} cy={node.y+node.h/2} r={node.w/2-2} fill={node.type==="start"?C.greenLight:C.redLight} stroke={node.type==="start"?C.green:C.cherryMid} strokeWidth={2.5}/>
            <text x={node.x+node.w/2} y={node.y+node.h/2+1} fill={node.type==="start"?C.greenDark:C.cherryDark} fontSize={10} fontWeight={700} textAnchor="middle" dominantBaseline="middle">{node.type==="start"?"START":"END"}</text>
          </g>);}
          if(node.type==="decision"){const cx=node.x+node.w/2,cy=node.y+node.h/2,s=node.w/2;return(<g key={node.id} style={{cursor:"pointer"}} onClick={()=>onSelect&&onSelect(node.id)}>
            <polygon points={`${cx},${cy-s} ${cx+s},${cy} ${cx},${cy+s} ${cx-s},${cy}`} fill={C.amberLight} stroke={C.amber} strokeWidth={2}/>
            <text x={cx} y={cy-4} fill={C.amberDark} fontSize={9} fontWeight={700} textAnchor="middle" dominantBaseline="middle">{node.name.length>14?node.name.substring(0,12)+"...":node.name}</text>
            <text x={cx} y={cy+8} fill={C.grey500} fontSize={8} textAnchor="middle" dominantBaseline="middle">{node.role.length>14?node.role.substring(0,12)+"...":node.role}</text>
          </g>);}
          return(<g key={node.id} style={{cursor:"pointer"}} onClick={()=>onSelect&&onSelect(node.id)}>
            <rect x={node.x} y={node.y} width={node.w} height={node.h} rx={10} fill={C.white} stroke={rc} strokeWidth={2} style={{filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.08))"}}/>
            <line x1={node.x+8} y1={node.y} x2={node.x+8} y2={node.y+node.h} stroke={rc} strokeWidth={3} strokeLinecap="round"/>
            <text x={node.x+18} y={node.y+node.h/2-7} fill={C.charcoal} fontSize={10} fontWeight={600} dominantBaseline="middle">{node.name.length>24?node.name.substring(0,22)+"...":node.name}</text>
            <text x={node.x+18} y={node.y+node.h/2+7} fill={C.grey500} fontSize={9} dominantBaseline="middle">{node.role.length>24?node.role.substring(0,22)+"...":node.role}</text>
          </g>);
        })}
      </svg>
    </div>
  );
});

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   NODE GRAPH â€” Sequenced, with slicers
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const NodeGraphView = memo(function NodeGraphView({steps,slicer,onSlicerChange}){
  const svgRef=useRef(null);
  const ps=useMemo(()=>steps.filter(s=>s.type!=="start"&&s.type!=="end"),[steps]);
  const roles=useMemo(()=>_.uniq(ps.map(s=>s.role)),[ps]);
  const roleColors=useMemo(()=>{const cols=[C.cherryDark,C.cherryMid,C.green,C.amber,C.blue,C.greenDark];const sc={};roles.forEach((r,i)=>{sc[r]=cols[i%cols.length];});return sc;},[roles]);
  const costRates=useMemo(()=>{const r={};roles.forEach(rl=>{r[rl]=getDefaultRate(rl);});return r;},[roles]);

  useEffect(()=>{
    if(!svgRef.current||!ps.length)return;
    const svg=d3.select(svgRef.current);svg.selectAll("*").remove();
    const container=svgRef.current.parentElement;
    const width=container?container.clientWidth-20:800;
    const height=Math.max(500,container?container.clientHeight-20:600);

    const sizeScale = (step) => {
      if (slicer === "risk") return ({low:18,medium:24,high:30,critical:36})[step.risk] || 20;
      if (slicer === "effort") return Math.max(16, Math.min(40, toHours(step.duration, step.durationUnit) * 3 + 10));
      if (slicer === "cost") return Math.max(16, Math.min(40, (toHours(step.duration, step.durationUnit) * (costRates[step.role]||85)) / 80 + 10));
      return 22;
    };

    const nodes=ps.map((s,i)=>({id:s.id,name:s.name,role:s.role,risk:s.risk,type:s.type,duration:toHours(s.duration,s.durationUnit),idx:i,r:sizeScale(s),...s}));
    const idSet=new Set(nodes.map(n=>n.id));
    const links=[];ps.forEach(s=>{s.dependencies.forEach(d=>{if(idSet.has(d))links.push({source:d,target:s.id});});});

    const g=svg.append("g");
    svg.call(d3.zoom().scaleExtent([0.3,3]).on("zoom",ev=>{g.attr("transform",ev.transform);}));

    // Horizontal force to maintain sequence
    const sim=d3.forceSimulation(nodes)
      .force("link",d3.forceLink(links).id(d=>d.id).distance(100).strength(0.8))
      .force("charge",d3.forceManyBody().strength(-200))
      .force("x",d3.forceX(d=>80+d.idx*(width-160)/Math.max(nodes.length-1,1)).strength(0.4))
      .force("y",d3.forceY(height/2).strength(0.1))
      .force("collision",d3.forceCollide().radius(d=>d.r+8));

    const defs=svg.append("defs");
    defs.append("marker").attr("id","gArr").attr("viewBox","0 0 12 8").attr("refX",20).attr("refY",4).attr("markerWidth",10).attr("markerHeight",7).attr("orient","auto").append("path").attr("d","M 0 0 L 12 4 L 0 8 L 3 4 Z").attr("fill",C.grey400);

    const link=g.append("g").selectAll("path").data(links).join("path").attr("fill","none").attr("stroke",C.grey400+"66").attr("stroke-width",1.5).attr("marker-end","url(#gArr)");

    const node=g.append("g").selectAll("g").data(nodes).join("g").style("cursor","grab");
    // Outer ring
    node.append("circle").attr("r",d=>d.r+4).attr("fill","none").attr("stroke",d=>roleColors[d.role]+"44").attr("stroke-width",2).attr("stroke-dasharray","3,3");
    // Main circle
    node.append("circle").attr("r",d=>d.r).attr("fill",d=>roleColors[d.role]+"18").attr("stroke",d=>RISK_COLORS[d.risk]).attr("stroke-width",2);
    // Sequence number
    node.append("text").text(d=>d.idx+1).attr("text-anchor","middle").attr("dy",4).attr("fill",d=>RISK_COLORS[d.risk]).attr("font-size",d=>Math.max(9,d.r*0.55)).attr("font-weight",800).attr("font-family",FONT);
    // Label
    node.append("text").text(d=>d.name.length>20?d.name.substring(0,18)+"...":d.name).attr("text-anchor","middle").attr("dy",d=>-(d.r+10)).attr("fill",C.charcoal).attr("font-size",10).attr("font-weight",600).attr("font-family",FONT);

    const drag=d3.drag().on("start",(ev,d)=>{if(!ev.active)sim.alphaTarget(0.3).restart();d.fx=d.x;d.fy=d.y;}).on("drag",(ev,d)=>{d.fx=ev.x;d.fy=ev.y;}).on("end",(ev,d)=>{if(!ev.active)sim.alphaTarget(0);d.fx=null;d.fy=null;});
    node.call(drag);

    sim.on("tick",()=>{
      link.attr("d",d=>{const dx=d.target.x-d.source.x,dy=d.target.y-d.source.y;const dr=Math.sqrt(dx*dx+dy*dy)*1.5;return`M ${d.source.x},${d.source.y} A ${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;});
      node.attr("transform",d=>`translate(${d.x},${d.y})`);
    });
    return()=>{sim.stop();};
  },[ps,roleColors,slicer,costRates]);

  const [showOverlays, setShowOverlays] = useState(window.innerWidth > 768);
  const isMobile = window.innerWidth <= 768;

  return(
    <div style={{width:"100%",height:"calc(100vh - 130px)",position:"relative",background:C.grey50}}>
      <svg ref={svgRef} width="100%" height="100%"/>
      
      {isMobile && (
        <button 
          onClick={() => setShowOverlays(!showOverlays)}
          style={{position:"absolute", top:16, right:16, zIndex:10, background:C.white, border:`1px solid ${C.grey200}`, borderRadius:8, padding:8, boxShadow:"0 2px 8px rgba(0,0,0,0.1)"}}
        >
          <SlidersHorizontal size={20} color={C.cherryDark}/>
        </button>
      )}

      {showOverlays && (
        <>
          {/* Slicer controls */}
          <div style={{
            position:"absolute",
            top: isMobile ? 60 : 16,
            right: 16,
            padding: 14,
            background: C.white+"EE",
            borderRadius: 10,
            border: `1px solid ${C.grey200}`,
            backdropFilter: "blur(8px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            zIndex: 20
          }}>
            <div style={{color:C.grey500,fontSize:9,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:8,fontFamily:FONT,display:"flex",alignItems:"center",gap:4}}><SlidersHorizontal size={12}/>NODE SIZE</div>
            <div style={{display:"flex", flexDirection: isMobile ? "row" : "column", gap: 4}}>
              {["risk","effort","cost"].map(s=>(<button key={s} onClick={()=>onSlicerChange(s)} style={{display:"block",padding:"6px 12px",borderRadius:6,background:slicer===s?C.cherryDark+"12":"transparent",border:`1px solid ${slicer===s?C.cherryDark+"33":"transparent"}`,color:slicer===s?C.cherryDark:C.grey500,fontSize:11,fontWeight:slicer===s?600:400,cursor:"pointer",fontFamily:FONT,textAlign:"left",textTransform:"capitalize"}}>{s}</button>))}
            </div>
          </div>
          {/* Legend */}
          <div style={{
            position:"absolute",
            bottom: 16,
            left: 16,
            padding: 14,
            background: C.white+"EE",
            borderRadius: 10,
            border: `1px solid ${C.grey200}`,
            backdropFilter: "blur(8px)",
            maxWidth: isMobile ? "calc(100% - 32px)" : 240,
            zIndex: 20
          }}>
            <div style={{color:C.grey500,fontSize:9,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:8,fontFamily:FONT}}>ROLES</div>
            <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
              {roles.map(r=>(<div key={r} style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:"50%",background:roleColors[r]}}/><span style={{color:C.grey600,fontSize:9,fontFamily:FONT}}>{r}</span></div>))}
            </div>
          </div>
        </>
      )}
    </div>
  );
});

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   VISUALIZATION PAGE
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const VizPage = memo(function VizPage({state,dispatch}){
  const handleSelect=useCallback(id=>{dispatch({type:"SET_UI",payload:{selectedStepId:id,showDetailPanel:true}});},[dispatch]);
  const handleSlicer=useCallback(s=>{dispatch({type:"SET_UI",payload:{nodeSlice:s}});},[dispatch]);
  return(
    <div style={{height:"100%"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 28px",borderBottom:`1px solid ${C.grey200}`,background:C.white}}>
        <h2 style={{color:C.charcoal,fontSize:18,fontWeight:800,fontFamily:FONT,marginRight:16}}>Visualization</h2>
        {[{id:"flowchart",label:"Flowchart",icon:GitBranch},{id:"nodeGraph",label:"Node Graph",icon:Network}].map(m=>(<button key={m.id} onClick={()=>dispatch({type:"SET_UI",payload:{vizMode:m.id}})} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 16px",borderRadius:8,background:state.ui.vizMode===m.id?C.cherryDark+"0D":"transparent",border:`1px solid ${state.ui.vizMode===m.id?C.cherryDark+"33":C.grey300}`,color:state.ui.vizMode===m.id?C.cherryDark:C.grey500,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:FONT}}><m.icon size={14}/>{m.label}</button>))}
      </div>
      {state.ui.vizMode==="flowchart"?<FlowchartView steps={state.steps} onSelect={handleSelect}/>:<NodeGraphView steps={state.steps} slicer={state.ui.nodeSlice} onSlicerChange={handleSlicer}/>}
    </div>
  );
});

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   ANALYSIS DASHBOARD
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const AnalysisDash = memo(function AnalysisDash({state,dispatch}){
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const metrics=useMemo(()=>computeMetrics(state.steps),[state.steps]);
  const raci=useMemo(()=>computeRACI(state.steps),[state.steps]);
  const health=useMemo(()=>computeHealth(state.steps,metrics),[state.steps,metrics]);
  const ps=useMemo(()=>state.steps.filter(s=>s.type!=="start"&&s.type!=="end"),[state.steps]);
  const [tab,setTab]=useState("overview");
  const costRates=useMemo(()=>{const r={...state.analysis.costRates};metrics.roles.forEach(rl=>{if(!r[rl])r[rl]=getDefaultRate(rl);});return r;},[metrics.roles,state.analysis.costRates]);
  const costData=useMemo(()=>{const sc=ps.map(s=>({name:s.name,cost:toHours(s.duration,s.durationUnit)*(costRates[s.role]||85),role:s.role}));const rc={};sc.forEach(s=>{rc[s.role]=(rc[s.role]||0)+s.cost;});return{stepCosts:sc,roleCosts:rc,totalCost:_.sumBy(sc,"cost")};},[ps,costRates]);
  if(!ps.length)return<div style={{padding:28}}><EmptyState icon={BarChart3} title="No Data" description="Parse or build a process first."/></div>;
  const tabs=[{id:"overview",label:"Overview",icon:Activity},{id:"raci",label:"RACI",icon:Users},{id:"risk",label:"Risk",icon:Shield},{id:"bottleneck",label:"Bottleneck",icon:AlertTriangle},{id:"health",label:"Health",icon:Award},{id:"cost",label:"Cost",icon:DollarSign}];
  const raciCol={R:C.cherryDark,A:C.cherryMid,C:C.green,I:C.grey500};const raciBg={R:C.redLight,A:C.amberLight,C:C.greenLight,I:C.grey200};
  const thS={padding:"10px 12px",background:`linear-gradient(135deg,${C.cherryDark},${C.cherryMid})`,color:"#fff",textAlign:"left",fontWeight:600,fontSize:11};
  const tdS={padding:"8px 12px",borderBottom:`1px solid ${C.grey200}`,color:C.grey600,fontSize:12};
  const COLORS=[C.cherryDark,C.cherryMid,C.green,C.amber,C.blue,C.greenDark];
  const bnData=ps.map(s=>({name:s.name.length>18?s.name.substring(0,16)+"...":s.name,fullName:s.name,duration:toHours(s.duration,s.durationUnit),fill:toHours(s.duration,s.durationUnit)>metrics.meanDuration+metrics.stdDuration?C.cherryMid:RISK_COLORS[s.risk]}));
  const rwData=Object.entries(metrics.roleWorkload).map(([r,c])=>({name:r.length>15?r.substring(0,13)+"...":r,fullName:r,value:c}));
  const curObj=CURRENCIES.find(c=>c.code===state.analysis.currency)||CURRENCIES[0];
  const hRadar=[
    {subject:"Efficiency",value:health.efficiency,desc:"Avg step duration vs ideal (2h). Lower durations score higher."},
    {subject:"Clarity",value:health.clarity,desc:"% of steps with descriptions over 20 characters."},
    {subject:"Risk Exposure",value:health.riskExposure,desc:"Inverse ratio of high/critical risk steps to total."},
    {subject:"Role Balance",value:health.roleBalance,desc:"Std deviation of workload across roles. Even distribution scores higher."},
    {subject:"Automation",value:health.automationReadiness,desc:"% of steps flagged as automatable based on verb analysis."},
    {subject:"Decisions",value:health.decisionDensity,desc:"Decision-to-step ratio. Optimal range is 5-40%."},
  ];
  const rcChart=Object.entries(costData.roleCosts).map(([r,c])=>({name:r.length>15?r.substring(0,13)+"...":r,value:Math.round(c)}));

  return(
    <div style={{padding: isMobile ? 16 : 28, overflow:"auto", height:"calc(100vh - 60px)", scrollPadding: 20}}>
      <h2 style={{color:C.charcoal,fontSize: isMobile ? 20 : 24,fontWeight:800,marginBottom:18,fontFamily:FONT}}>Analysis Dashboard</h2>
      <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>{tabs.map(t=>{const active=tab===t.id;const Ic=t.icon;return(<button key={t.id} onClick={()=>setTab(t.id)} style={{display:"flex",alignItems:"center",gap:5,padding: isMobile ? "7px 12px" : "8px 16px",borderRadius:8,background:active?C.cherryDark+"09":"transparent",border:`1px solid ${active?C.cherryDark+"33":C.grey300}`,color:active?C.cherryDark:C.grey500,fontSize: isMobile ? 11 : 12,fontWeight:500,cursor:"pointer",fontFamily:FONT, transition: "all 0.2s"}}><Ic size={14}/>{!isMobile && t.label}</button>);})}</div>

      {tab==="overview"&&<div style={{display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(200px, 1fr))", gap:12, marginBottom:16}}>
        <MetricCard icon={Layers} label="Total Steps" value={metrics.totalSteps}/>
        <MetricCard icon={Users} label="Roles" value={metrics.roles.length} accent={C.green}/>
        <MetricCard icon={Diamond} label="Decisions" value={metrics.decisions} accent={C.amber}/>
        <MetricCard icon={Clock} label="Critical Path" value={`${Math.round(metrics.criticalPathDuration)}h`} accent={C.cherryLight}/>
      </div>}

      {tab==="raci"&&<Card elevated><div style={{overflow:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:12,fontFamily:FONT}}><thead><tr><th style={{...thS,position:"sticky",left:0,zIndex:1}}>Step</th>{raci.roles.map(r=><th key={r} style={thS}>{r.length>14?r.substring(0,12)+"...":r}</th>)}</tr></thead><tbody>{raci.matrix.map(row=>(<tr key={row.step.id}><td style={{...tdS,fontWeight:500,color:C.charcoal,background:C.white,position:"sticky",left:0}}>{row.step.name}</td>{raci.roles.map(r=>{const v=row.assignments[r];return(<td key={r} style={{...tdS,textAlign:"center",fontWeight:700,fontSize:13,color:v?raciCol[v]:"transparent",background:v?raciBg[v]+"55":"transparent"}}>{v||"â€“"}</td>);})}</tr>))}<tr><td style={{...tdS,fontWeight:700,color:C.charcoal,background:C.grey100,position:"sticky",left:0}}>Workload (R+A)</td>{raci.roles.map(r=>{const ct=raci.matrix.reduce((s,row)=>s+(row.assignments[r]==="R"||row.assignments[r]==="A"?1:0),0);return<td key={r} style={{...tdS,textAlign:"center",color:C.charcoal,fontWeight:700,fontSize:14,background:C.grey100}}>{ct}</td>;})}</tr></tbody></table></div></Card>}

      {tab==="risk"&&<div><Card elevated style={{marginBottom:20}}><h3 style={{color:C.charcoal,fontSize:15,fontWeight:700,marginBottom:14,fontFamily:FONT}}>Risk Scatter Plot</h3><ResponsiveContainer width="100%" height={300}><ScatterChart margin={{top:10,right:20,bottom:30,left:20}}><CartesianGrid strokeDasharray="3 3" stroke={C.grey200}/><XAxis type="number" dataKey="likelihood" domain={[0,5.5]} tick={{fill:C.grey500,fontSize:11}} label={{value:"Likelihood",fill:C.grey500,fontSize:12,position:"bottom"}}/><YAxis type="number" dataKey="impact" domain={[0,5.5]} tick={{fill:C.grey500,fontSize:11}} label={{value:"Impact",fill:C.grey500,fontSize:12,angle:-90,position:"insideLeft"}}/><ZAxis type="number" dataKey="duration" range={[40,200]}/><Tooltip content={({payload})=>{if(!payload?.[0])return null;const d=payload[0].payload;return<div style={{background:C.white,border:`1px solid ${C.grey300}`,padding:10,borderRadius:8,fontFamily:FONT,boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}}><div style={{color:C.charcoal,fontSize:12,fontWeight:600}}>{d.name}</div><div style={{color:C.grey500,fontSize:11}}>Risk: {d.risk} | {d.duration}h</div></div>;}}/><Scatter data={ps.map(s=>{const l=s.risk==="critical"?5:s.risk==="high"?4:s.risk==="medium"?3:1.5;return{name:s.name,likelihood:Math.min(5,l),impact:Math.min(5,s.type==="decision"?l+0.5:l),duration:toHours(s.duration,s.durationUnit),risk:s.risk};})}>{ps.map((s,i)=><Cell key={i} fill={RISK_COLORS[s.risk]} fillOpacity={0.7}/>)}</Scatter></ScatterChart></ResponsiveContainer></Card><Card elevated><table style={{width:"100%",borderCollapse:"collapse",fontSize:12,fontFamily:FONT}}><thead><tr>{["Step","Risk","Rationale","Mitigations"].map(h=><th key={h} style={thS}>{h}</th>)}</tr></thead><tbody>{ps.filter(s=>s.risk!=="low").map(s=>(<tr key={s.id}><td style={tdS}>{s.name}</td><td style={tdS}><Badge label={s.risk} color={RISK_COLORS[s.risk]} bg={RISK_BG[s.risk]}/></td><td style={tdS}>{s.riskRationale}</td><td style={tdS}>{genMitigation(s).map((m,i)=><div key={i} style={{marginBottom:3}}>â€¢ {m}</div>)}</td></tr>))}</tbody></table></Card></div>}

      {tab==="bottleneck"&&<div><Card elevated style={{marginBottom:20}}><h3 style={{color:C.charcoal,fontSize:15,fontWeight:700,marginBottom:14,fontFamily:FONT}}>Step Duration Analysis</h3><ResponsiveContainer width="100%" height={280}><BarChart data={bnData} margin={{top:10,right:20,bottom:50,left:20}}><CartesianGrid strokeDasharray="3 3" stroke={C.grey200}/><XAxis dataKey="name" tick={{fill:C.grey500,fontSize:10}} angle={-35} textAnchor="end" height={60}/><YAxis tick={{fill:C.grey500,fontSize:11}}/><Tooltip/><Bar dataKey="duration" radius={[6,6,0,0]}>{bnData.map((e,i)=><Cell key={i} fill={e.fill} fillOpacity={0.8}/>)}</Bar></BarChart></ResponsiveContainer></Card><Card elevated><h3 style={{color:C.charcoal,fontSize:15,fontWeight:700,marginBottom:14,fontFamily:FONT}}>Role Workload</h3><ResponsiveContainer width="100%" height={250}><RPieChart><Pie data={rwData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value" label={({name,value})=>`${name}: ${value}`}>{rwData.map((e,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip/></RPieChart></ResponsiveContainer></Card></div>}

      {tab==="health"&&<div><Card elevated style={{textAlign:"center",marginBottom:20,borderTop:`3px solid ${health.overall>=70?C.green:health.overall>=40?C.amber:C.cherryMid}`}}><div style={{color:C.grey500,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",marginBottom:6}}>Overall Health Score</div><div style={{color:health.overall>=70?C.greenDark:health.overall>=40?C.amberDark:C.cherryDark,fontSize:56,fontWeight:800,fontFamily:FONT}}>{health.overall}</div><div style={{color:C.grey500,fontSize:12}}>out of 100</div></Card><Card elevated style={{marginBottom:20}}><ResponsiveContainer width="100%" height={350}><RadarChart data={hRadar}><PolarGrid stroke={C.grey300}/><PolarAngleAxis dataKey="subject" tick={{fill:C.grey600,fontSize:11}}/><PolarRadiusAxis angle={30} domain={[0,100]} tick={{fill:C.grey400,fontSize:10}}/><Radar name="Score" dataKey="value" stroke={C.cherryMid} fill={C.cherryMid} fillOpacity={0.15} strokeWidth={2}/></RadarChart></ResponsiveContainer></Card><div style={{display:"flex",gap:12,flexWrap:"wrap"}}>{hRadar.map(d=>(<Card key={d.subject} style={{flex:"1 1 140px",borderTop:`3px solid ${d.value>=70?C.green:d.value>=40?C.amber:C.cherryMid}`}}><div style={{color:C.grey500,fontSize:10,fontWeight:700,marginBottom:4,textTransform:"uppercase"}}>{d.subject}</div><div style={{color:d.value>=70?C.greenDark:d.value>=40?C.amberDark:C.cherryDark,fontSize:28,fontWeight:800}}>{d.value}</div><div style={{color:C.grey500,fontSize:10,lineHeight:1.4,marginTop:6}}>{d.desc}</div></Card>))}</div></div>}

      {tab==="cost"&&<div><Card elevated style={{marginBottom:20}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}><div style={{display:"flex",alignItems:"center",gap:12}}><h3 style={{color:C.charcoal,fontSize:15,fontWeight:700,fontFamily:FONT}}>Cost Estimation</h3><select value={state.analysis.currency} onChange={e=>dispatch({type:"SET_CURRENCY",payload:e.target.value})} style={{padding:"5px 10px",background:C.grey50,border:`1px solid ${C.grey300}`,borderRadius:6,color:C.charcoal,fontSize:12,fontFamily:FONT,outline:"none",cursor:"pointer"}}>{CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}</select></div><div style={{color:C.charcoal,fontSize:32,fontWeight:800,fontFamily:FONT}}>{curObj.symbol}{Math.round(costData.totalCost).toLocaleString()}</div></div><div style={{marginBottom:20}}><div style={{color:C.grey500,fontSize:10,fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:"1px"}}>Hourly Rates ({curObj.symbol})</div><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{metrics.roles.filter(r=>r!=="System").map(r=>(<div key={r} style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:C.grey600,fontSize:11,minWidth:80}}>{r.length>14?r.substring(0,12)+"...":r}</span><input type="number" value={costRates[r]||85} onChange={e=>dispatch({type:"SET_COST_RATE",payload:{role:r,rate:parseInt(e.target.value)||0}})} style={{width:65,padding:"4px 8px",background:C.grey50,border:`1px solid ${C.grey300}`,borderRadius:6,color:C.charcoal,fontSize:12,fontFamily:FONT,outline:"none"}}/><span style={{color:C.grey500,fontSize:10}}>/hr</span></div>))}</div></div><ResponsiveContainer width="100%" height={250}><RPieChart><Pie data={rcChart} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value" label={({name,value})=>`${name}: ${curObj.symbol}${value.toLocaleString()}`}>{rcChart.map((e,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip formatter={v=>`${curObj.symbol}${v.toLocaleString()}`}/></RPieChart></ResponsiveContainer></Card></div>}
    </div>
  );
});

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   BRD GENERATOR
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const BRDGen = memo(function BRDGen({state}){
  const metrics=useMemo(()=>computeMetrics(state.steps),[state.steps]);
  const raci=useMemo(()=>computeRACI(state.steps),[state.steps]);
  const health=useMemo(()=>computeHealth(state.steps,metrics),[state.steps,metrics]);
  const ps=useMemo(()=>state.steps.filter(s=>s.type!=="start"&&s.type!=="end"),[state.steps]);
  const today=new Date().toISOString().split("T")[0];
  const handleExport=useCallback(()=>{
    const html=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>BRD - ${state.process.name}</title><style>body{font-family:Calibri,Arial,sans-serif;color:#1a1a1a;margin:40px;line-height:1.6}h1{color:#8B1A1A;font-size:24pt;border-bottom:3px solid #8B1A1A;padding-bottom:8px}h2{color:#B22222;font-size:16pt;border-bottom:1px solid #B22222;padding-bottom:4px;margin-top:24pt}h3{color:#8B1A1A;font-size:13pt}table{border-collapse:collapse;width:100%;margin:12px 0}th{background-color:#8B1A1A;color:white;padding:8px 10px;text-align:left;font-size:10pt}td{padding:6px 10px;border:1px solid #ddd;font-size:10pt}tr:nth-child(even){background-color:#f8f6f3}p{margin:6px 0;font-size:11pt}</style></head><body><h1>Business Requirements Document</h1><h2>1. Document Control</h2><table><tr><td><b>Title</b></td><td>${state.process.name} - BRD</td></tr><tr><td><b>Version</b></td><td>${state.process.version}</td></tr><tr><td><b>Date</b></td><td>${today}</td></tr><tr><td><b>Author</b></td><td>${state.process.author}</td></tr><tr><td><b>Status</b></td><td>${state.process.status}</td></tr></table><h2>2. Executive Summary</h2><p>This document defines requirements for the <b>${state.process.name}</b> process: ${metrics.totalSteps} steps, ${metrics.roles.length} roles, ${metrics.decisions} decisions, ${metrics.handoffs} handoffs. Critical path: ${Math.round(metrics.criticalPathDuration)}h across ${metrics.criticalPath.length} steps. Complexity: ${metrics.complexityIndex}/10. Automation: ${metrics.automationPotential}%. Health: ${health.overall}/100.</p><h2>3. Stakeholders</h2><table><tr><th>Role</th><th>Steps</th><th>Share</th></tr>${metrics.roles.map(r=>`<tr><td>${r}</td><td>${metrics.roleWorkload[r]||0}</td><td>${Math.round(((metrics.roleWorkload[r]||0)/Math.max(metrics.totalSteps,1))*100)}%</td></tr>`).join("")}</table><h2>4. Process Overview</h2><table><tr><th>#</th><th>Step</th><th>Role</th><th>Type</th><th>Duration</th><th>Risk</th></tr>${ps.map((s,i)=>`<tr><td>${i+1}</td><td>${s.name}</td><td>${s.role}</td><td>${s.type}</td><td>${s.duration} ${s.durationUnit}</td><td>${s.risk}</td></tr>`).join("")}</table><h2>5. Detailed Flow</h2>${ps.map((s,i)=>`<h3>5.${i+1} ${s.name}</h3><p><b>Owner:</b> ${s.role} | <b>Type:</b> ${s.type} | <b>Duration:</b> ${s.duration} ${s.durationUnit} | <b>Risk:</b> ${s.risk}</p><p>${s.description}</p><p><b>Inputs:</b> ${s.inputs.join(", ")||"N/A"} | <b>Outputs:</b> ${s.outputs.join(", ")||"N/A"}</p>`).join("")}<h2>6. RACI</h2><table><tr><th>Step</th>${raci.roles.map(r=>`<th>${r}</th>`).join("")}</tr>${raci.matrix.map(row=>`<tr><td>${row.step.name}</td>${raci.roles.map(r=>`<td style="text-align:center;font-weight:bold;color:${({R:"#8B1A1A",A:"#B22222",C:"#4CAF50",I:"#888"})[row.assignments[r]]||"#ccc"}">${row.assignments[r]||"–"}</td>`).join("")}</tr>`).join("")}</table><h2>7. Approval</h2><table><tr><th>Role</th><th>Name</th><th>Signature</th><th>Date</th></tr>${metrics.roles.slice(0,4).map(r=>`<tr><td>${r}</td><td></td><td></td><td></td></tr>`).join("")}</table><p style="text-align:center;color:#999;margin-top:40px;font-size:9pt">BIO-stone V3 - Cherrystone - ${today}</p></body></html>`;
    const blob=new Blob([html],{type:"application/msword"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`BRD_${state.process.name.replace(/\s+/g,"_")}_${today}.doc`;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);
  },[state,metrics,raci,health,ps,today]);

  if(!ps.length)return<div style={{padding:28}}><EmptyState icon={FileText} title="No BRD Data" description="Parse or build a process first."/></div>;
  const sS={background:C.white,borderRadius:12,padding:"24px 28px",marginBottom:16,border:`1px solid ${C.grey200}`,fontFamily:FONT,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"};
  const h2S={color:C.cherryDark,fontSize:16,fontWeight:700,borderBottom:`2px solid ${C.cherryDark}22`,paddingBottom:6,marginBottom:14};
  const pS={color:C.charcoal,fontSize:13,lineHeight:1.7,marginBottom:8};
  const thS={padding:"8px 10px",background:C.cherryDark,color:"#fff",textAlign:"left",fontWeight:600,fontSize:11};
  const tdS={padding:"6px 10px",borderBottom:`1px solid ${C.grey200}`,color:"#444",fontSize:12};
  return(
    <div style={{padding:28,overflow:"auto",height:"calc(100vh - 60px)",background:C.grey100}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{color:C.charcoal,fontSize:24,fontWeight:800,fontFamily:FONT}}>Business Requirements Document</h2>
        <button onClick={handleExport} style={{display:"flex",alignItems:"center",gap:6,padding:"10px 24px",background:`linear-gradient(135deg,${C.cherryDark},${C.cherryMid})`,border:"none",borderRadius:8,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:FONT,boxShadow:`0 4px 16px ${C.cherryDark}33`}}><Download size={16}/>Export .doc</button>
      </div>
      <div style={sS}><h2 style={h2S}>1. Document Control</h2><table style={{borderCollapse:"collapse",fontSize:13}}><tbody>{[["Title",`${state.process.name} â€” BRD`],["Version",state.process.version],["Date",today],["Author",state.process.author],["Status",state.process.status]].map(([l,v])=><tr key={l}><td style={{padding:"4px 16px 4px 0",fontWeight:600,color:C.cherryDark,width:150}}>{l}</td><td style={{padding:"4px 0",color:C.charcoal}}>{v}</td></tr>)}</tbody></table></div>
      <div style={sS}><h2 style={h2S}>2. Executive Summary</h2><p style={pS}>This document defines the business requirements for <strong>{state.process.name}</strong>. The process comprises {metrics.totalSteps} steps executed by {metrics.roles.length} roles, with {metrics.decisions} decisions and {metrics.handoffs} handoffs. Critical path: {Math.round(metrics.criticalPathDuration)} hours. Complexity: {metrics.complexityIndex}/10. Automation: {metrics.automationPotential}%. Health: {health.overall}/100.</p></div>
      <div style={sS}><h2 style={h2S}>3. Process Overview</h2><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>{["#","Step","Role","Type","Duration","Risk"].map(h=><th key={h} style={thS}>{h}</th>)}</tr></thead><tbody>{ps.map((s,i)=><tr key={s.id}><td style={tdS}>{i+1}</td><td style={{...tdS,fontWeight:500}}>{s.name}</td><td style={tdS}>{s.role}</td><td style={tdS}>{s.type}</td><td style={tdS}>{s.duration} {s.durationUnit}</td><td style={tdS}><span style={{color:RISK_COLORS[s.risk],fontWeight:600}}>{s.risk.toUpperCase()}</span></td></tr>)}</tbody></table></div>
      <div style={{textAlign:"center",padding:20}}><span style={{color:C.grey500,fontSize:11,fontFamily:FONT}}>BIO-stone V3 - Cherrystone Consulting - {today}</span></div>
    </div>
  );
});

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MAIN
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export default function ProcessMapper(){
  const [state,dispatch]=useReducer(reducer,initialState);
  const sel=useMemo(()=>state.ui.selectedStepId?state.steps.find(s=>s.id===state.ui.selectedStepId)||null:null,[state.ui.selectedStepId,state.steps]);
  const closeDetail=useCallback(()=>{dispatch({type:"SET_UI",payload:{selectedStepId:null,showDetailPanel:false}});},[]);
  useEffect(()=>{if(state.ui.toast){const t=setTimeout(()=>dispatch({type:"CLEAR_TOAST"}),3500);return()=>clearTimeout(t);}},[state.ui.toast]);
  return(
    <div style={{display:"flex",height:"100vh",overflow:"hidden",background:C.grey100,fontFamily:FONT,color:C.charcoal}}>
      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes slideIn{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}
        ::-webkit-scrollbar{width:8px;height:8px}
        ::-webkit-scrollbar-track{background:${C.grey100}}
        ::-webkit-scrollbar-thumb{background:${C.grey300};border-radius:4px}
        ::-webkit-scrollbar-thumb:hover{background:${C.grey400}}
        ::selection{background:${C.cherryDark}22}
        input::placeholder,textarea::placeholder{color:${C.grey400}}
        select{appearance:none}
        option{background:${C.white};color:${C.charcoal}}
        @media (max-width: 768px) {
          .mobile-hide { display: none !important; }
          .mobile-full { width: 100% !important; min-width: 100% !important; }
        }
      `}</style>
      <Toast toast={state.ui.toast} onDismiss={useCallback(()=>dispatch({type:"CLEAR_TOAST"}),[])}/>
      <Sidebar state={state} dispatch={dispatch}/>
      <main style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        <div style={{display: (window.innerWidth < 1024) ? "flex" : "none", alignItems:"center", padding:"12px 20px", background:C.white, borderBottom:`1px solid ${C.grey200}`, gap:12}}>
          <button onClick={() => dispatch({type:"SET_UI",payload:{sidebarOpen: true}})} style={{background:"none", border:"none", color:C.cherryDark, cursor:"pointer"}}>
            <SlidersHorizontal size={24}/>
          </button>
          <span style={{fontWeight:800, color:C.charcoal, fontSize:14}}>Process Mapper</span>
        </div>
        <div style={{flex:1,overflow:"auto"}}>
          {state.ui.activePage==="input"&&<InputPage state={state} dispatch={dispatch}/>}
          {state.ui.activePage==="visualization"&&<VizPage state={state} dispatch={dispatch}/>}
          {state.ui.activePage==="analysis"&&<AnalysisDash state={state} dispatch={dispatch}/>}
          {state.ui.activePage==="brd"&&<BRDGen state={state}/>}
        </div>
      </main>
      {state.ui.showDetailPanel&&sel&&<StepDetail step={sel} dispatch={dispatch} onClose={closeDetail}/>}
    </div>
  );
}

