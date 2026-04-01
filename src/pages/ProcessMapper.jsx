import React, { useState, useEffect, useCallback, useMemo, useReducer, useRef, memo } from "react";
import {
  Play, Square, Diamond, Circle, ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  Plus, Trash2, Copy, Edit3, FileText, BarChart3, GitBranch, Network, Settings,
  Upload, Zap, AlertTriangle, CheckCircle, Clock, Users, Target, Shield,
  TrendingUp, DollarSign, Download, Eye, Search, Filter, ArrowRight, ArrowDown,
  Layers, Activity, PieChart, Award, BookOpen, ClipboardList, Maximize2, Minimize2,
  X, Check, RefreshCw, Moon, Workflow, Hash, GripVertical, MoreVertical, Info
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RPieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, LineChart, Line, ScatterChart, Scatter, ZAxis
} from "recharts";
import * as d3 from "d3";
import _ from "lodash";

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS & BRAND IDENTITY
   ═══════════════════════════════════════════════════════════════════════════ */

const C = {
  crimson: "#6D061D",
  teal: "#25464B",
  cream: "#F0E6DA",
  olive: "#4F6815",
  navy: "#001524",
  forest: "#132319",
  crimsonLight: "#8B1A35",
  crimsonFaded: "#6D061D55",
  tealLight: "#356A72",
  tealFaded: "#25464B44",
  creamDim: "#F0E6DAD9",
  creamMuted: "#F0E6DAA6",
  creamFaint: "#F0E6DA73",
  olivLight: "#6B8A1F",
  navyLight: "#0A2540",
  forestLight: "#1E3828",
};

const FONT = "'Inter', system-ui, -apple-system, sans-serif";

const RISK_COLORS = {
  low: C.olive,
  medium: C.teal,
  high: C.crimson,
  critical: "#9B0A2E",
};

const TYPE_ICONS = {
  start: "circle",
  end: "circle",
  action: "rect",
  decision: "diamond",
  "parallel-gateway": "parallel",
};

const DURATION_UNITS = ["hours", "days", "weeks"];

const CATEGORIES = [
  "approval", "data-entry", "communication", "review",
  "transformation", "handoff", "verification", "notification",
];

/* ═══════════════════════════════════════════════════════════════════════════
   TEMPLATES
   ═══════════════════════════════════════════════════════════════════════════ */

const TEMPLATES = {
  onboarding: {
    name: "Employee Onboarding",
    description: `HR initiates the onboarding process by creating an employee record in the HR system with the new hire's personal details, start date, and assigned department. The hiring manager then prepares the role-specific onboarding plan, outlining required training modules, initial assignments, and mentorship pairings. IT provisions the employee's workstation, email account, VPN access, and necessary software licenses within 2 days. If the role requires elevated system access, the security team must review and approve the access request before IT can proceed. Meanwhile, the facilities team simultaneously prepares the physical workspace, including desk assignment, access badge, and parking permit. The HR coordinator schedules orientation sessions covering company policies, benefits enrollment, and compliance training, which takes approximately 3 hours. The new employee completes all required compliance training modules within the first week. The assigned mentor conducts an introductory session to walk through team norms, project workflows, and communication channels. The hiring manager reviews and approves the completed onboarding checklist. If any items are incomplete, the HR coordinator follows up with the responsible parties to resolve gaps. Finally, HR sends a 30-day check-in survey to the new employee and their manager to assess the onboarding experience.`,
  },
  invoice: {
    name: "Invoice Processing",
    description: `The accounts payable clerk receives the vendor invoice via email or postal mail and logs it into the invoice tracking system within 24 hours. The clerk verifies the invoice against the corresponding purchase order and delivery receipt to confirm quantities, pricing, and terms match. If there are discrepancies, the clerk contacts the vendor for clarification and flags the invoice for review. For invoices under $5,000, the department manager reviews and approves the payment. For invoices between $5,000 and $25,000, the finance director must approve. Invoices exceeding $25,000 require VP of Finance approval and a secondary review by the controller. Once approved, the payment team schedules the payment according to the vendor's payment terms, typically net-30 or net-60. The system generates a payment batch which the treasury analyst reviews before execution. After payment is processed, the accounts payable clerk reconciles the payment against the general ledger and updates the vendor account. If payment fails or is rejected by the bank, the treasury analyst investigates the cause and resubmits within 2 business days. Monthly, the AP manager generates an aging report and reviews outstanding invoices for escalation.`,
  },
  support: {
    name: "Customer Support Escalation",
    description: `The customer submits a support ticket through the self-service portal, email, or phone channel. The Tier 1 support agent reviews the ticket, categorizes it by severity and product area, and attempts initial resolution using the knowledge base within 1 hour of receipt. If the agent resolves the issue, they document the solution and close the ticket. If the issue cannot be resolved at Tier 1, the agent escalates to Tier 2 specialist support with detailed notes on troubleshooting steps already attempted. The Tier 2 specialist diagnoses the issue within 4 hours, which may involve reviewing system logs, replicating the issue in a test environment, or consulting with the engineering team. If the issue is a confirmed software defect, the specialist creates a bug report and escalates to the engineering team. Meanwhile, the customer success manager is notified and proactively contacts the customer to provide status updates. The engineering team triages the bug, assigns it a priority level, and provides an estimated fix timeline. If the fix requires a hotfix release, the release manager coordinates an expedited deployment. Once resolved, the Tier 2 specialist verifies the fix, notifies the customer, and requests confirmation of resolution. If the customer confirms, the ticket is closed with a satisfaction survey sent within 24 hours.`,
  },
  changeRequest: {
    name: "Product Change Request",
    description: `The product owner submits a change request documenting the proposed modification, business justification, affected components, and expected impact on existing functionality. The technical lead conducts an initial feasibility assessment within 2 days, evaluating architecture implications, dependency impacts, and estimated development effort. Simultaneously, the QA lead assesses testing requirements and identifies regression risk areas. The change advisory board, consisting of the product owner, technical lead, QA lead, and a senior architect, reviews the request in the weekly review meeting. If the change is approved, the technical lead creates detailed technical specifications and breaks the work into development tasks. If rejected, the product owner receives written feedback with suggestions for alternative approaches. The development team implements the changes according to the technical specification. After implementation, the developer performs unit testing and submits a pull request for code review. The senior developer conducts the code review within 1 day. Once code review passes, the QA team executes the test plan including functional, regression, and performance testing over 3 days. If testing reveals defects, the development team fixes them and QA retests. Upon successful testing, the release manager schedules the deployment and notifies all stakeholders. Post-deployment, the operations team monitors system health for 48 hours.`,
  },
  vendorRisk: {
    name: "Vendor Risk Assessment",
    description: `The procurement specialist initiates the vendor risk assessment by collecting the vendor's business documentation, including financial statements, insurance certificates, and compliance certifications. The compliance officer reviews the vendor's regulatory standing, checking for sanctions, litigation history, and industry-specific compliance requirements within 3 days. If the vendor operates in a high-risk jurisdiction, an enhanced due diligence review is triggered, requiring additional documentation and a background investigation. The information security team evaluates the vendor's cybersecurity posture, reviewing their SOC 2 report, penetration test results, and data handling procedures within 5 days. Meanwhile, the finance team assesses the vendor's financial stability using credit reports and financial ratio analysis. The legal team reviews the proposed contract terms, focusing on liability clauses, data protection obligations, indemnification, and termination rights. If any risk area scores above the acceptable threshold, the risk committee convenes to determine whether to proceed with additional controls, request remediation, or reject the vendor. The risk committee issues a formal risk rating and recommendation. Once all assessments are complete, the vendor management office compiles the comprehensive risk report and presents it to the approval authority. Depending on the contract value, approval may require sign-off from the CPO, CFO, or the board of directors.`,
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   NATURAL LANGUAGE PARSER ENGINE
   ═══════════════════════════════════════════════════════════════════════════ */

const ROLE_KEYWORDS = [
  "HR", "hiring manager", "IT", "security team", "facilities team",
  "HR coordinator", "mentor", "employee", "new employee", "new hire",
  "accounts payable clerk", "clerk", "department manager", "finance director",
  "VP of Finance", "controller", "payment team", "treasury analyst", "AP manager",
  "customer", "Tier 1 support agent", "Tier 1 agent", "agent", "Tier 2 specialist",
  "specialist", "customer success manager", "engineering team", "release manager",
  "product owner", "technical lead", "QA lead", "change advisory board",
  "development team", "developer", "senior developer", "QA team", "operations team",
  "procurement specialist", "compliance officer", "information security team",
  "finance team", "legal team", "risk committee", "vendor management office",
  "approval authority", "CPO", "CFO", "board of directors",
  "manager", "director", "analyst", "coordinator", "supervisor", "administrator",
  "architect", "senior architect", "team lead", "stakeholder", "reviewer",
  "auditor", "vendor", "client", "requester", "approver",
];

const HIGH_RISK_VERBS = ["delete", "cancel", "terminate", "remove", "reject", "revoke", "override", "disable"];
const MEDIUM_RISK_VERBS = ["approve", "reject", "escalate", "review", "assess", "evaluate", "authorize", "sign"];
const LOW_RISK_VERBS = ["notify", "log", "record", "document", "send", "email", "update", "schedule", "create"];
const DECISION_SIGNALS = ["if ", "whether", "depending on", "in case of", "should ", "when ", "for invoices", "once ", "upon "];
const PARALLEL_SIGNALS = ["simultaneously", "at the same time", "in parallel", "meanwhile", "concurrently"];
const SEQUENCE_SIGNALS = ["after", "once", "following", "then", "next", "subsequently", "before", "upon"];

const AUTOMATION_VERBS = [
  "log", "record", "send", "email", "notify", "schedule", "generate",
  "update", "track", "monitor", "calculate", "compute", "assign", "route",
];

function generateStepId(index) {
  return `step_${String(index + 1).padStart(3, "0")}`;
}

function extractRole(sentence) {
  const lower = sentence.toLowerCase();
  const sorted = [...ROLE_KEYWORDS].sort((a, b) => b.length - a.length);

  for (const role of sorted) {
    const rl = role.toLowerCase();
    const patterns = [
      new RegExp(`^the\\s+${rl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s`, "i"),
      new RegExp(`^${rl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s`, "i"),
    ];
    for (const p of patterns) {
      if (p.test(sentence.trim())) {
        return role.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      }
    }
  }

  for (const role of sorted) {
    const rl = role.toLowerCase();
    const idx = lower.indexOf(rl);
    if (idx !== -1 && idx < lower.length * 0.5) {
      const before = lower.substring(0, idx).trim();
      if (before === "" || before.endsWith("the ") || before.endsWith(",") || before.endsWith(";")) {
        return role.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      }
    }
  }

  const subjectMatch = sentence.match(/^(?:the\s+)?([A-Z][a-z]+(?:\s+[A-Za-z]+){0,3}?)(?:\s+(?:then|will|must|shall|should|can|has|have|is|are|was|were|do|does|did|reviews?|creates?|sends?|submits?|prepares?|conducts?|performs?|generates?|initiates?|receives?|completes?|assigns?|checks?|approves?|rejects?|verifies?|schedules?))/);
  if (subjectMatch) {
    return subjectMatch[1].trim();
  }

  return "Process Owner";
}

function extractAction(sentence) {
  const verbPhraseMatch = sentence.match(/(?:then\s+|and\s+)?(?:will\s+|must\s+|shall\s+|should\s+|can\s+)?(\w+(?:s|es|ed|ing)?)\s+([\w\s]{2,40}?)(?:\.|,|;|$| within| using| through| via| by| to the| from| in the| for | if | when | which| that)/i);
  if (verbPhraseMatch) {
    const verb = verbPhraseMatch[1];
    const obj = verbPhraseMatch[2].trim();
    const action = (verb + " " + obj).replace(/\s+/g, " ").trim();
    return action.length > 45 ? action.substring(0, 42) + "..." : action;
  }
  const words = sentence.split(/\s+/).slice(0, 6).join(" ");
  return words.length > 40 ? words.substring(0, 37) + "..." : words;
}

function inferRisk(sentence, actionType) {
  const lower = sentence.toLowerCase();
  if (HIGH_RISK_VERBS.some(v => lower.includes(v))) return { level: "critical", rationale: "Contains destructive or irreversible action" };
  if (actionType === "decision") return { level: "medium", rationale: "Decision point introduces branching risk" };
  if (MEDIUM_RISK_VERBS.some(v => lower.includes(v))) return { level: "medium", rationale: "Involves approval or evaluation requiring judgment" };
  if (lower.includes("compliance") || lower.includes("security") || lower.includes("audit"))
    return { level: "high", rationale: "Compliance or security-sensitive activity" };
  if (lower.includes("financial") || lower.includes("payment") || lower.includes("budget"))
    return { level: "medium", rationale: "Financial activity requiring accuracy" };
  if (LOW_RISK_VERBS.some(v => lower.includes(v))) return { level: "low", rationale: "Administrative or notification activity" };
  return { level: "low", rationale: "Standard process activity with limited risk exposure" };
}

function inferDuration(sentence) {
  const patterns = [
    { regex: /within\s+(\d+)\s+hour/i, unit: "hours" },
    { regex: /within\s+(\d+)\s+day/i, unit: "days" },
    { regex: /within\s+(\d+)\s+week/i, unit: "weeks" },
    { regex: /(\d+)\s*[-–]\s*hour/i, unit: "hours" },
    { regex: /(\d+)\s*[-–]\s*day/i, unit: "days" },
    { regex: /(\d+)\s+business\s+day/i, unit: "days" },
    { regex: /takes?\s+(?:about|approximately)?\s*(\d+)\s+hour/i, unit: "hours" },
    { regex: /takes?\s+(?:about|approximately)?\s*(\d+)\s+day/i, unit: "days" },
    { regex: /takes?\s+(?:about|approximately)?\s*(\d+)\s+week/i, unit: "weeks" },
    { regex: /over\s+(\d+)\s+day/i, unit: "days" },
    { regex: /(\d+)\s+hours?\b/i, unit: "hours" },
    { regex: /(\d+)\s+days?\b/i, unit: "days" },
    { regex: /(\d+)\s+weeks?\b/i, unit: "weeks" },
    { regex: /24-hour/i, unit: "hours", val: 24 },
    { regex: /48\s*hours?/i, unit: "hours", val: 48 },
    { regex: /net-?30/i, unit: "days", val: 30 },
    { regex: /net-?60/i, unit: "days", val: 60 },
  ];

  for (const p of patterns) {
    const m = sentence.match(p.regex);
    if (m) {
      return { duration: p.val || parseInt(m[1], 10), unit: p.unit };
    }
  }

  const lower = sentence.toLowerCase();
  if (lower.includes("quick") || lower.includes("immediate")) return { duration: 1, unit: "hours" };
  if (lower.includes("review") || lower.includes("assess")) return { duration: 4, unit: "hours" };
  if (lower.includes("deploy") || lower.includes("implement")) return { duration: 2, unit: "days" };
  return { duration: 2, unit: "hours" };
}

function detectType(sentence) {
  const lower = sentence.toLowerCase();
  for (const sig of DECISION_SIGNALS) {
    if (lower.includes(sig)) return "decision";
  }
  return "action";
}

function detectParallel(sentence) {
  const lower = sentence.toLowerCase();
  return PARALLEL_SIGNALS.some(s => lower.includes(s));
}

function extractInputsOutputs(sentence) {
  const inputs = [];
  const outputs = [];
  const lower = sentence.toLowerCase();

  const inputPatterns = [/(?:receives?|collects?|reviews?|checks?|reads?)\s+(?:the\s+)?(.{5,40}?)(?:\.|,|;|and|$)/i];
  const outputPatterns = [/(?:creates?|generates?|produces?|sends?|submits?|issues?|compiles?)\s+(?:the\s+|a\s+|an\s+)?(.{5,40}?)(?:\.|,|;|and|$)/i];

  for (const p of inputPatterns) {
    const m = sentence.match(p);
    if (m) inputs.push(m[1].trim());
  }
  for (const p of outputPatterns) {
    const m = sentence.match(p);
    if (m) outputs.push(m[1].trim());
  }

  if (inputs.length === 0 && (lower.includes("review") || lower.includes("check"))) {
    inputs.push("Prior step output");
  }
  if (outputs.length === 0) {
    if (lower.includes("report")) outputs.push("Report");
    else if (lower.includes("approv")) outputs.push("Approval decision");
    else if (lower.includes("notif")) outputs.push("Notification");
    else outputs.push("Updated process state");
  }

  return { inputs, outputs };
}

function inferCategory(sentence) {
  const lower = sentence.toLowerCase();
  if (lower.match(/approv|sign.?off|authorize/)) return "approval";
  if (lower.match(/enter|input|fill|record|log|create.*record/)) return "data-entry";
  if (lower.match(/notify|email|send|contact|inform|communicate/)) return "communication";
  if (lower.match(/review|assess|evaluat|check|inspect|audit/)) return "review";
  if (lower.match(/convert|transform|generat|compil|calculat|comput/)) return "transformation";
  if (lower.match(/escalat|transfer|handoff|forward|assign|route/)) return "handoff";
  if (lower.match(/verify|confirm|validat|test/)) return "verification";
  return "review";
}

function inferAutomatable(sentence) {
  const lower = sentence.toLowerCase();
  return AUTOMATION_VERBS.some(v => lower.includes(v));
}

function extractOutcomes(sentence) {
  const lower = sentence.toLowerCase();
  if (lower.includes("approved") && lower.includes("rejected")) return ["Approved", "Rejected"];
  if (lower.includes("pass") && lower.includes("fail")) return ["Pass", "Fail"];
  if (lower.includes("accept") && lower.includes("reject")) return ["Accepted", "Rejected"];
  if (lower.includes("complete") && lower.includes("incomplete")) return ["Complete", "Incomplete"];
  if (lower.includes("yes") || lower.includes("no")) return ["Yes", "No"];
  if (lower.includes("approve")) return ["Approved", "Not Approved"];
  if (lower.includes("resolve")) return ["Resolved", "Unresolved"];
  return ["Yes", "No"];
}

function parseNaturalLanguage(text) {
  if (!text || !text.trim()) return [];

  const rawSentences = text
    .replace(/(\d+)\.\s+/g, "|||$1. ")
    .replace(/([a-z)]+)\)\s+/g, "|||$1) ")
    .replace(/^[-•]\s+/gm, "|||")
    .replace(/\n/g, " ||| ")
    .split(/(?<=[.;])\s+|\|\|\|/)
    .map(s => s.trim())
    .filter(s => s.length > 15);

  const merged = [];
  for (const s of rawSentences) {
    if (merged.length > 0 && s.length < 30 && !s.match(/^[A-Z]/)) {
      merged[merged.length - 1] += " " + s;
    } else {
      merged.push(s);
    }
  }

  const steps = [];
  let prevRole = "Process Owner";

  for (let i = 0; i < merged.length; i++) {
    const sentence = merged[i].replace(/^\d+[\.)]\s*/, "").trim();
    if (sentence.length < 10) continue;

    const role = extractRole(sentence);
    if (role !== "Process Owner") prevRole = role;
    const usedRole = role === "Process Owner" && prevRole !== "Process Owner" ? prevRole : role;

    const stepType = detectType(sentence);
    const parallel = detectParallel(sentence);
    const { duration, unit } = inferDuration(sentence);
    const risk = inferRisk(sentence, stepType);
    const { inputs, outputs } = extractInputsOutputs(sentence);
    const category = inferCategory(sentence);
    const automatable = inferAutomatable(sentence);
    const action = extractAction(sentence);

    const name = action.length > 40 ? action.substring(0, 37) + "..." : action;

    const step = {
      id: generateStepId(steps.length),
      name,
      role: usedRole,
      action,
      description: sentence,
      type: stepType,
      duration,
      durationUnit: unit,
      risk: risk.level,
      riskRationale: risk.rationale,
      inputs,
      outputs,
      dependencies: steps.length > 0 && !parallel ? [steps[steps.length - 1].id] : [],
      parallel,
      outcomes: stepType === "decision" ? extractOutcomes(sentence) : [],
      automatable,
      category,
    };

    steps.push(step);
  }

  if (steps.length > 0) {
    steps.unshift({
      id: "step_start",
      name: "Process Start",
      role: "System",
      action: "Initiate Process",
      description: "Process begins",
      type: "start",
      duration: 0,
      durationUnit: "hours",
      risk: "low",
      riskRationale: "Process initiation point",
      inputs: ["Trigger event"],
      outputs: ["Process initiated"],
      dependencies: [],
      parallel: false,
      outcomes: [],
      automatable: true,
      category: "notification",
    });

    for (let i = 2; i < steps.length; i++) {
      if (steps[i].dependencies.length === 0 && !steps[i].parallel) {
        steps[i].dependencies = [steps[i - 1].id];
      }
    }
    if (steps.length > 1 && steps[1].dependencies.length === 0) {
      steps[1].dependencies = ["step_start"];
    }

    steps.push({
      id: "step_end",
      name: "Process Complete",
      role: "System",
      action: "End Process",
      description: "Process concludes",
      type: "end",
      duration: 0,
      durationUnit: "hours",
      risk: "low",
      riskRationale: "Process termination point",
      inputs: ["All steps completed"],
      outputs: ["Process record"],
      dependencies: [steps[steps.length - 1].id],
      parallel: false,
      outcomes: [],
      automatable: true,
      category: "notification",
    });
  }

  return steps;
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATE MANAGEMENT
   ═══════════════════════════════════════════════════════════════════════════ */

const initialState = {
  process: {
    name: "Untitled Process",
    description: "",
    version: "1.0",
    author: "Cherrystone Consulting",
    status: "Draft",
    createdDate: new Date().toISOString().split("T")[0],
  },
  steps: [],
  ui: {
    activePage: "input",
    inputMode: "natural",
    selectedStepId: null,
    showDetailPanel: false,
    parseProgress: null,
    toast: null,
    vizMode: "flowchart",
    searchTerm: "",
    brdSection: "all",
  },
  analysis: {
    costRates: {},
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_PROCESS":
      return { ...state, process: { ...state.process, ...action.payload } };
    case "SET_STEPS":
      return { ...state, steps: action.payload };
    case "ADD_STEP": {
      const newStep = {
        id: generateStepId(state.steps.length),
        name: "New Step",
        role: "Unassigned",
        action: "",
        description: "",
        type: "action",
        duration: 1,
        durationUnit: "hours",
        risk: "low",
        riskRationale: "Default assignment",
        inputs: [],
        outputs: [],
        dependencies: state.steps.length > 0 ? [state.steps[state.steps.length - 1].id] : [],
        parallel: false,
        outcomes: [],
        automatable: false,
        category: "review",
        ...action.payload,
      };
      return { ...state, steps: [...state.steps, newStep] };
    }
    case "UPDATE_STEP":
      return {
        ...state,
        steps: state.steps.map(s => s.id === action.payload.id ? { ...s, ...action.payload.changes } : s),
      };
    case "DELETE_STEP":
      return {
        ...state,
        steps: state.steps.filter(s => s.id !== action.payload),
        ui: { ...state.ui, selectedStepId: state.ui.selectedStepId === action.payload ? null : state.ui.selectedStepId },
      };
    case "DUPLICATE_STEP": {
      const orig = state.steps.find(s => s.id === action.payload);
      if (!orig) return state;
      const dup = { ...orig, id: generateStepId(state.steps.length), name: orig.name + " (copy)" };
      const idx = state.steps.findIndex(s => s.id === action.payload);
      const newSteps = [...state.steps];
      newSteps.splice(idx + 1, 0, dup);
      return { ...state, steps: newSteps };
    }
    case "REORDER_STEPS": {
      const { fromIndex, toIndex } = action.payload;
      const arr = [...state.steps];
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      return { ...state, steps: arr };
    }
    case "SET_UI":
      return { ...state, ui: { ...state.ui, ...action.payload } };
    case "SET_COST_RATE":
      return {
        ...state,
        analysis: {
          ...state.analysis,
          costRates: { ...state.analysis.costRates, [action.payload.role]: action.payload.rate },
        },
      };
    case "SHOW_TOAST":
      return { ...state, ui: { ...state.ui, toast: action.payload } };
    case "CLEAR_TOAST":
      return { ...state, ui: { ...state.ui, toast: null } };
    default:
      return state;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANALYSIS COMPUTATIONS
   ═══════════════════════════════════════════════════════════════════════════ */

function toHours(duration, unit) {
  if (unit === "hours") return duration;
  if (unit === "days") return duration * 8;
  if (unit === "weeks") return duration * 40;
  return duration;
}

function computeMetrics(steps) {
  const processSteps = steps.filter(s => s.type !== "start" && s.type !== "end");
  const totalSteps = processSteps.length;
  const roles = _.uniq(processSteps.map(s => s.role));
  const decisions = processSteps.filter(s => s.type === "decision").length;

  let handoffs = 0;
  for (let i = 1; i < processSteps.length; i++) {
    if (processSteps[i].role !== processSteps[i - 1].role) handoffs++;
  }

  const parallelGates = processSteps.filter(s => s.parallel).length;

  const totalDurationHours = processSteps.reduce((sum, s) => sum + toHours(s.duration, s.durationUnit), 0);

  const criticalPath = computeCriticalPath(steps);
  const criticalPathDuration = criticalPath.reduce((sum, s) => sum + toHours(s.duration, s.durationUnit), 0);

  const rawComplexity = (totalSteps * 1) + (decisions * 2.5) + (roles.length * 1.5) + (handoffs * 2) + (parallelGates * 1.5);
  const complexityIndex = Math.min(10, Math.max(1, rawComplexity / 5));

  const automatableCount = processSteps.filter(s => s.automatable).length;
  const automationPotential = totalSteps > 0 ? (automatableCount / totalSteps) * 100 : 0;

  const durations = processSteps.map(s => toHours(s.duration, s.durationUnit));
  const meanDuration = _.mean(durations) || 0;
  const stdDuration = durations.length > 1
    ? Math.sqrt(_.sumBy(durations, d => Math.pow(d - meanDuration, 2)) / durations.length)
    : 0;

  const bottleneckSteps = processSteps.filter(s => toHours(s.duration, s.durationUnit) > meanDuration + stdDuration);

  const roleWorkload = _.countBy(processSteps, "role");

  return {
    totalSteps,
    roles,
    decisions,
    handoffs,
    parallelGates,
    totalDurationHours,
    criticalPath,
    criticalPathDuration,
    complexityIndex: Math.round(complexityIndex * 10) / 10,
    automationPotential: Math.round(automationPotential),
    automatableCount,
    bottleneckSteps,
    meanDuration,
    stdDuration,
    roleWorkload,
  };
}

function computeCriticalPath(steps) {
  if (steps.length === 0) return [];
  const idMap = {};
  steps.forEach(s => { idMap[s.id] = s; });

  const dist = {};
  const prev = {};
  steps.forEach(s => { dist[s.id] = 0; prev[s.id] = null; });

  const sorted = topologicalSort(steps);

  for (const s of sorted) {
    const d = toHours(s.duration, s.durationUnit);
    for (const dep of s.dependencies) {
      if (idMap[dep] && dist[dep] + toHours(idMap[dep].duration, idMap[dep].durationUnit) > dist[s.id]) {
        dist[s.id] = dist[dep] + toHours(idMap[dep].duration, idMap[dep].durationUnit);
        prev[s.id] = dep;
      }
    }
  }

  let maxId = null;
  let maxDist = -1;
  for (const [id, d] of Object.entries(dist)) {
    if (d > maxDist) { maxDist = d; maxId = id; }
  }

  const path = [];
  let cur = maxId;
  while (cur) {
    if (idMap[cur]) path.unshift(idMap[cur]);
    cur = prev[cur];
  }

  return path;
}

function topologicalSort(steps) {
  const idSet = new Set(steps.map(s => s.id));
  const inDegree = {};
  const adj = {};
  steps.forEach(s => { inDegree[s.id] = 0; adj[s.id] = []; });
  steps.forEach(s => {
    for (const d of s.dependencies) {
      if (idSet.has(d)) {
        adj[d].push(s.id);
        inDegree[s.id]++;
      }
    }
  });

  const queue = steps.filter(s => inDegree[s.id] === 0).map(s => s.id);
  const result = [];
  const idMap = {};
  steps.forEach(s => { idMap[s.id] = s; });

  while (queue.length > 0) {
    const id = queue.shift();
    result.push(idMap[id]);
    for (const next of adj[id]) {
      inDegree[next]--;
      if (inDegree[next] === 0) queue.push(next);
    }
  }

  if (result.length < steps.length) {
    const remaining = steps.filter(s => !result.find(r => r.id === s.id));
    return [...result, ...remaining];
  }
  return result;
}

function computeRACI(steps) {
  const processSteps = steps.filter(s => s.type !== "start" && s.type !== "end");
  const roles = _.uniq(processSteps.map(s => s.role)).filter(r => r !== "System");
  const matrix = [];

  for (const step of processSteps) {
    const row = { step, assignments: {} };

    roles.forEach(r => { row.assignments[r] = ""; });
    row.assignments[step.role] = "R";

    const nextApproval = processSteps.find(
      s => s.type === "decision" && processSteps.indexOf(s) > processSteps.indexOf(step) && s.role !== step.role
    );
    if (nextApproval) {
      if (row.assignments[nextApproval.role] !== "R") {
        row.assignments[nextApproval.role] = "A";
      }
    } else {
      row.assignments[step.role] = "R";
    }

    const desc = step.description.toLowerCase();
    for (const r of roles) {
      if (r === step.role) continue;
      if (row.assignments[r] === "A") continue;
      if (desc.includes(r.toLowerCase())) {
        row.assignments[r] = "C";
      }
    }

    const stepIdx = processSteps.indexOf(step);
    const adjacentRoles = [];
    if (stepIdx > 0) adjacentRoles.push(processSteps[stepIdx - 1].role);
    if (stepIdx < processSteps.length - 1) adjacentRoles.push(processSteps[stepIdx + 1].role);
    for (const ar of adjacentRoles) {
      if (ar !== step.role && !row.assignments[ar]) {
        row.assignments[ar] = "I";
      }
    }

    matrix.push(row);
  }

  return { roles, matrix };
}

function computeHealthScores(steps, metrics) {
  const processSteps = steps.filter(s => s.type !== "start" && s.type !== "end");
  if (processSteps.length === 0) return { efficiency: 0, clarity: 0, riskExposure: 0, roleBalance: 0, automationReadiness: 0, decisionDensity: 0, overall: 0 };

  const avgDurationPerStep = metrics.totalDurationHours / Math.max(metrics.totalSteps, 1);
  const efficiency = Math.max(0, Math.min(100, 100 - (avgDurationPerStep - 2) * 10));

  const descriptive = processSteps.filter(s => s.description && s.description.length > 20).length;
  const clarity = (descriptive / processSteps.length) * 100;

  const highRisk = processSteps.filter(s => s.risk === "high" || s.risk === "critical").length;
  const riskExposure = Math.max(0, 100 - (highRisk / processSteps.length) * 200);

  const workloads = Object.values(metrics.roleWorkload);
  const workloadStd = workloads.length > 1
    ? Math.sqrt(_.sumBy(workloads, w => Math.pow(w - _.mean(workloads), 2)) / workloads.length)
    : 0;
  const roleBalance = Math.max(0, 100 - workloadStd * 15);

  const automationReadiness = metrics.automationPotential;

  const decisionRatio = metrics.decisions / Math.max(metrics.totalSteps, 1);
  const decisionDensity = decisionRatio > 0.4 ? 100 - (decisionRatio - 0.4) * 200
    : decisionRatio < 0.05 ? decisionRatio * 1000
    : 80 + (0.2 - Math.abs(decisionRatio - 0.2)) * 100;

  const overall = (efficiency * 0.2 + clarity * 0.15 + riskExposure * 0.2 + roleBalance * 0.15 + automationReadiness * 0.15 + Math.max(0, Math.min(100, decisionDensity)) * 0.15);

  return {
    efficiency: Math.round(Math.max(0, Math.min(100, efficiency))),
    clarity: Math.round(Math.max(0, Math.min(100, clarity))),
    riskExposure: Math.round(Math.max(0, Math.min(100, riskExposure))),
    roleBalance: Math.round(Math.max(0, Math.min(100, roleBalance))),
    automationReadiness: Math.round(Math.max(0, Math.min(100, automationReadiness))),
    decisionDensity: Math.round(Math.max(0, Math.min(100, decisionDensity))),
    overall: Math.round(Math.max(0, Math.min(100, overall))),
  };
}

function generateMitigation(step) {
  const mitigations = [];
  if (step.risk === "critical" || step.risk === "high") {
    mitigations.push(`Add secondary review gate before "${step.name}"`);
    if (step.type === "decision") mitigations.push("Implement decision audit trail with mandatory rationale documentation");
    if (step.category === "approval") mitigations.push("Enforce dual-approval policy with segregation of duties");
    if (step.duration > 4) mitigations.push(`Introduce SLA monitoring with ${Math.ceil(step.duration * 0.75)} ${step.durationUnit} escalation trigger`);
  }
  if (step.risk === "medium") {
    if (step.type === "decision") mitigations.push("Create standardized decision criteria checklist");
    mitigations.push("Implement automated status notifications for stakeholders");
    if (step.category === "handoff") mitigations.push("Add structured handoff template to minimize information loss");
  }
  if (step.automatable) mitigations.push("Evaluate RPA or workflow automation to reduce manual error risk");
  if (mitigations.length === 0) mitigations.push("Monitor step performance against baseline KPIs");
  return mitigations;
}

function getDefaultRate(role) {
  const lower = role.toLowerCase();
  if (lower.includes("vp") || lower.includes("director") || lower.includes("cfo") || lower.includes("cpo")) return 175;
  if (lower.includes("manager") || lower.includes("lead") || lower.includes("senior") || lower.includes("architect")) return 125;
  if (lower.includes("analyst") || lower.includes("specialist") || lower.includes("coordinator")) return 95;
  if (lower.includes("clerk") || lower.includes("agent")) return 65;
  if (lower === "system") return 0;
  return 85;
}

/* ═══════════════════════════════════════════════════════════════════════════
   UI HELPER COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

const Toast = memo(function Toast({ toast, onDismiss }) {
  if (!toast) return null;
  const bgColor = toast.type === "success" ? C.olive : toast.type === "error" ? C.crimson : C.teal;
  return (
    <div style={{
      position: "fixed", top: 20, right: 20, zIndex: 9999,
      background: bgColor, color: C.cream, padding: "12px 20px",
      borderRadius: 8, fontFamily: FONT, fontSize: 13, fontWeight: 500,
      boxShadow: `0 4px 20px ${bgColor}44`, display: "flex", alignItems: "center", gap: 8,
      animation: "slideIn 0.3s ease",
    }}>
      {toast.type === "success" ? <CheckCircle size={16} /> : toast.type === "error" ? <AlertTriangle size={16} /> : <Info size={16} />}
      {toast.message}
      <button onClick={onDismiss} style={{ background: "none", border: "none", color: C.cream, cursor: "pointer", marginLeft: 8 }}>
        <X size={14} />
      </button>
    </div>
  );
});

const Badge = memo(function Badge({ label, color, small }) {
  return (
    <span style={{
      display: "inline-block", padding: small ? "1px 6px" : "2px 8px",
      borderRadius: 4, fontSize: small ? 10 : 11, fontWeight: 600,
      background: color + "22", color, border: `1px solid ${color}44`,
      textTransform: "uppercase", letterSpacing: "0.5px",
    }}>{label}</span>
  );
});

const MetricCard = memo(function MetricCard({ icon: Icon, label, value, sub, accent }) {
  const accentColor = accent || C.teal;
  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.forest}, ${C.navyLight})`,
      border: `1px solid ${accentColor}33`, borderRadius: 10, padding: "16px 18px",
      minWidth: 150, flex: 1,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Icon size={16} style={{ color: accentColor }} />
        <span style={{ color: C.creamMuted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
      </div>
      <div style={{ color: C.cream, fontSize: 22, fontWeight: 700 }}>{value}</div>
      {sub && <div style={{ color: C.creamFaint, fontSize: 11, marginTop: 4 }}>{sub}</div>}
    </div>
  );
});

const EmptyState = memo(function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60, textAlign: "center" }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background: `linear-gradient(135deg, ${C.teal}22, ${C.crimson}22)`,
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
      }}>
        <Icon size={32} style={{ color: C.tealLight }} />
      </div>
      <h3 style={{ color: C.cream, fontSize: 18, fontWeight: 600, marginBottom: 8, fontFamily: FONT }}>{title}</h3>
      <p style={{ color: C.creamMuted, fontSize: 13, maxWidth: 400, lineHeight: 1.6, fontFamily: FONT }}>{description}</p>
      {actionLabel && (
        <button onClick={onAction} style={{
          marginTop: 20, padding: "10px 24px", background: C.crimson, color: C.cream,
          border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer",
          fontFamily: FONT,
        }}>{actionLabel}</button>
      )}
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   SIDEBAR NAVIGATION
   ═══════════════════════════════════════════════════════════════════════════ */

const Sidebar = memo(function Sidebar({ state, dispatch }) {
  const pages = [
    { id: "input", label: "Process Input", icon: Edit3 },
    { id: "visualization", label: "Visualization", icon: GitBranch },
    { id: "analysis", label: "Analysis", icon: BarChart3 },
    { id: "brd", label: "BRD Report", icon: FileText },
  ];

  const handlePageChange = useCallback((pageId) => {
    dispatch({ type: "SET_UI", payload: { activePage: pageId } });
  }, [dispatch]);

  const handleNameChange = useCallback((e) => {
    dispatch({ type: "SET_PROCESS", payload: { name: e.target.value } });
  }, [dispatch]);

  return (
    <div style={{
      width: 260, minWidth: 260, height: "100vh",
      background: `linear-gradient(180deg, ${C.forest}, ${C.navy})`,
      borderRight: `1px solid ${C.teal}22`, display: "flex", flexDirection: "column",
      fontFamily: FONT, overflow: "hidden",
    }}>
      <div style={{ padding: "20px 18px 16px", borderBottom: `1px solid ${C.teal}22` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: `linear-gradient(135deg, ${C.crimson}, ${C.crimsonLight})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Workflow size={20} style={{ color: C.cream }} />
          </div>
          <div>
            <div style={{ color: C.cream, fontSize: 15, fontWeight: 700 }}>ProcessForge</div>
            <div style={{ color: C.creamFaint, fontSize: 10, fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase" }}>by Cherrystone</div>
          </div>
        </div>
        <input
          value={state.process.name}
          onChange={handleNameChange}
          style={{
            width: "100%", padding: "8px 10px", background: C.navy + "88",
            border: `1px solid ${C.teal}33`, borderRadius: 6, color: C.cream,
            fontSize: 13, fontFamily: FONT, outline: "none",
          }}
          placeholder="Process name..."
        />
      </div>

      <nav style={{ padding: "12px 10px", flex: 1 }}>
        {pages.map(p => {
          const active = state.ui.activePage === p.id;
          const Icon = p.icon;
          return (
            <button key={p.id} onClick={() => handlePageChange(p.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", marginBottom: 4, borderRadius: 8,
              background: active ? `${C.crimson}22` : "transparent",
              border: active ? `1px solid ${C.crimson}44` : "1px solid transparent",
              color: active ? C.cream : C.creamMuted, cursor: "pointer",
              fontSize: 13, fontWeight: active ? 600 : 400, fontFamily: FONT,
              transition: "all 0.2s ease",
            }}>
              <Icon size={18} style={{ color: active ? C.crimson : C.creamFaint }} />
              {p.label}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: "14px 18px", borderTop: `1px solid ${C.teal}22` }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ color: C.creamFaint, fontSize: 11 }}>Steps</span>
          <span style={{ color: C.cream, fontSize: 11, fontWeight: 600 }}>{state.steps.filter(s => s.type !== "start" && s.type !== "end").length}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ color: C.creamFaint, fontSize: 11 }}>Version</span>
          <span style={{ color: C.cream, fontSize: 11, fontWeight: 600 }}>{state.process.version}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: C.creamFaint, fontSize: 11 }}>Status</span>
          <Badge label={state.process.status} color={C.olive} small />
        </div>
      </div>
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   NATURAL LANGUAGE INPUT PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

const NaturalLanguageInput = memo(function NaturalLanguageInput({ state, dispatch }) {
  const [text, setText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parseStage, setParseStage] = useState("");
  const [progress, setProgress] = useState(0);

  const handleParse = useCallback(() => {
    if (!text.trim()) {
      dispatch({ type: "SHOW_TOAST", payload: { type: "error", message: "Please enter a process description first." } });
      return;
    }

    setParsing(true);
    setProgress(0);

    const stages = [
      { msg: "Analyzing sentence structure...", pct: 15 },
      { msg: "Extracting roles and actors...", pct: 35 },
      { msg: "Identifying decisions and branches...", pct: 55 },
      { msg: "Mapping dependencies...", pct: 70 },
      { msg: "Computing risk profiles...", pct: 85 },
      { msg: "Generating process model...", pct: 100 },
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < stages.length) {
        setParseStage(stages[i].msg);
        setProgress(stages[i].pct);
        i++;
      } else {
        clearInterval(interval);
        const steps = parseNaturalLanguage(text);
        dispatch({ type: "SET_STEPS", payload: steps });
        setParsing(false);
        setParseStage("");
        setProgress(0);
        if (steps.length > 0) {
          dispatch({ type: "SHOW_TOAST", payload: { type: "success", message: `Parsed ${steps.length - 2} process steps successfully.` } });
          dispatch({ type: "SET_UI", payload: { activePage: "visualization" } });
        } else {
          dispatch({ type: "SHOW_TOAST", payload: { type: "error", message: "Could not parse any steps. Try a more detailed description." } });
        }
      }
    }, 350);
  }, [text, dispatch]);

  const handleTemplate = useCallback((key) => {
    setText(TEMPLATES[key].description);
    dispatch({ type: "SET_PROCESS", payload: { name: TEMPLATES[key].name } });
  }, [dispatch]);

  return (
    <div style={{ padding: 28, maxWidth: 900 }}>
      <h2 style={{ color: C.cream, fontSize: 22, fontWeight: 700, marginBottom: 6, fontFamily: FONT }}>Natural Language Input</h2>
      <p style={{ color: C.creamMuted, fontSize: 13, marginBottom: 20, fontFamily: FONT }}>
        Describe your business process in plain English. Include roles, actions, decisions, and timing for best results.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {Object.entries(TEMPLATES).map(([key, tmpl]) => (
          <button key={key} onClick={() => handleTemplate(key)} style={{
            padding: "6px 14px", borderRadius: 6,
            background: C.teal + "22", border: `1px solid ${C.teal}44`,
            color: C.creamDim, fontSize: 12, fontWeight: 500, cursor: "pointer",
            fontFamily: FONT, transition: "all 0.2s ease",
          }}>{tmpl.name}</button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="e.g., The hiring manager submits a job requisition to HR. HR reviews the request and, if approved, posts the position on the careers page..."
        style={{
          width: "100%", minHeight: 220, padding: 16,
          background: C.navy + "CC", border: `1px solid ${C.teal}33`,
          borderRadius: 10, color: C.cream, fontSize: 13, fontFamily: FONT,
          lineHeight: 1.7, resize: "vertical", outline: "none",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
        <button onClick={handleParse} disabled={parsing} style={{
          padding: "10px 28px", borderRadius: 8,
          background: parsing ? C.teal : `linear-gradient(135deg, ${C.crimson}, ${C.crimsonLight})`,
          border: "none", color: C.cream, fontSize: 14, fontWeight: 600,
          cursor: parsing ? "wait" : "pointer", fontFamily: FONT,
          boxShadow: parsing ? "none" : `0 4px 16px ${C.crimson}44`,
        }}>
          {parsing ? <RefreshCw size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Zap size={16} />}
          <span style={{ marginLeft: 8 }}>{parsing ? "Parsing..." : "Parse Process"}</span>
        </button>
        <span style={{ color: C.creamFaint, fontSize: 12 }}>{text.length} characters</span>
      </div>

      {parsing && (
        <div style={{ marginTop: 20 }}>
          <div style={{
            height: 4, background: C.navy, borderRadius: 2, overflow: "hidden", marginBottom: 10,
          }}>
            <div style={{
              height: "100%", width: `${progress}%`,
              background: `linear-gradient(90deg, ${C.crimson}, ${C.tealLight})`,
              borderRadius: 2, transition: "width 0.3s ease",
            }} />
          </div>
          <p style={{ color: C.creamMuted, fontSize: 12, fontFamily: FONT }}>{parseStage}</p>
        </div>
      )}
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   STEP BUILDER (MANUAL)
   ═══════════════════════════════════════════════════════════════════════════ */

const StepBuilder = memo(function StepBuilder({ state, dispatch }) {
  const processSteps = useMemo(() => state.steps.filter(s => s.type !== "start" && s.type !== "end"), [state.steps]);

  const handleAdd = useCallback(() => {
    dispatch({ type: "ADD_STEP", payload: {} });
  }, [dispatch]);

  const handleDelete = useCallback((id) => {
    dispatch({ type: "DELETE_STEP", payload: id });
  }, [dispatch]);

  const handleDuplicate = useCallback((id) => {
    dispatch({ type: "DUPLICATE_STEP", payload: id });
  }, [dispatch]);

  const handleSelect = useCallback((id) => {
    dispatch({ type: "SET_UI", payload: { selectedStepId: id, showDetailPanel: true } });
  }, [dispatch]);

  const handleMove = useCallback((fromIdx, dir) => {
    const fullIdx = state.steps.findIndex(s => s.id === processSteps[fromIdx].id);
    const targetIdx = dir === "up" ? fullIdx - 1 : fullIdx + 1;
    if (targetIdx < 0 || targetIdx >= state.steps.length) return;
    dispatch({ type: "REORDER_STEPS", payload: { fromIndex: fullIdx, toIndex: targetIdx } });
  }, [dispatch, state.steps, processSteps]);

  const handleFieldChange = useCallback((id, field, value) => {
    dispatch({ type: "UPDATE_STEP", payload: { id, changes: { [field]: value } } });
  }, [dispatch]);

  if (processSteps.length === 0) {
    return (
      <div style={{ padding: 28 }}>
        <EmptyState
          icon={ClipboardList}
          title="No Steps Defined"
          description="Add steps manually to build your process model. Click the button below to create your first step."
          actionLabel="Add First Step"
          onAction={handleAdd}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 28, maxWidth: 1000 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h2 style={{ color: C.cream, fontSize: 22, fontWeight: 700, fontFamily: FONT }}>Step Builder</h2>
        <button onClick={handleAdd} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 18px",
          background: C.crimson, border: "none", borderRadius: 6, color: C.cream,
          fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT,
        }}>
          <Plus size={16} /> Add Step
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {processSteps.map((step, idx) => (
          <div key={step.id} onClick={() => handleSelect(step.id)} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
            background: state.ui.selectedStepId === step.id ? `${C.teal}22` : `${C.forest}CC`,
            border: `1px solid ${state.ui.selectedStepId === step.id ? C.teal + "66" : C.teal + "22"}`,
            borderRadius: 8, cursor: "pointer", transition: "all 0.2s ease",
          }}>
            <span style={{ color: C.creamFaint, fontSize: 11, fontWeight: 600, minWidth: 28 }}>#{idx + 1}</span>
            <input
              value={step.name}
              onChange={e => { e.stopPropagation(); handleFieldChange(step.id, "name", e.target.value); }}
              onClick={e => e.stopPropagation()}
              style={{
                flex: 1, background: "transparent", border: "none", color: C.cream,
                fontSize: 13, fontWeight: 500, fontFamily: FONT, outline: "none", minWidth: 0,
              }}
            />
            <input
              value={step.role}
              onChange={e => { e.stopPropagation(); handleFieldChange(step.id, "role", e.target.value); }}
              onClick={e => e.stopPropagation()}
              style={{
                width: 130, background: "transparent", border: `1px solid ${C.teal}22`,
                borderRadius: 4, padding: "2px 6px", color: C.creamDim,
                fontSize: 12, fontFamily: FONT, outline: "none",
              }}
            />
            <Badge label={step.type} color={C.teal} small />
            <Badge label={step.risk} color={RISK_COLORS[step.risk]} small />
            <span style={{ color: C.creamMuted, fontSize: 11, minWidth: 50 }}>{step.duration}{step.durationUnit.charAt(0)}</span>
            <div style={{ display: "flex", gap: 2 }} onClick={e => e.stopPropagation()}>
              <button onClick={() => handleMove(idx, "up")} disabled={idx === 0} style={{ background: "none", border: "none", color: C.creamFaint, cursor: "pointer", padding: 2 }}><ChevronUp size={14} /></button>
              <button onClick={() => handleMove(idx, "down")} disabled={idx === processSteps.length - 1} style={{ background: "none", border: "none", color: C.creamFaint, cursor: "pointer", padding: 2 }}><ChevronDown size={14} /></button>
              <button onClick={() => handleDuplicate(step.id)} style={{ background: "none", border: "none", color: C.creamFaint, cursor: "pointer", padding: 2 }}><Copy size={14} /></button>
              <button onClick={() => handleDelete(step.id)} style={{ background: "none", border: "none", color: C.crimson, cursor: "pointer", padding: 2 }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   STEP DETAIL PANEL
   ═══════════════════════════════════════════════════════════════════════════ */

const StepDetailPanel = memo(function StepDetailPanel({ step, dispatch, onClose }) {
  if (!step) return null;

  const handleChange = useCallback((field, value) => {
    dispatch({ type: "UPDATE_STEP", payload: { id: step.id, changes: { [field]: value } } });
  }, [dispatch, step.id]);

  const fieldStyle = {
    width: "100%", padding: "7px 10px", background: C.navy + "AA",
    border: `1px solid ${C.teal}33`, borderRadius: 6, color: C.cream,
    fontSize: 12, fontFamily: FONT, outline: "none",
  };

  const labelStyle = { color: C.creamMuted, fontSize: 11, fontWeight: 600, marginBottom: 4, display: "block", textTransform: "uppercase", letterSpacing: "0.5px" };

  return (
    <div style={{
      width: 310, minWidth: 310, height: "100vh", background: `linear-gradient(180deg, ${C.forest}, ${C.navy})`,
      borderLeft: `1px solid ${C.teal}22`, padding: "18px 16px", overflow: "auto",
      fontFamily: FONT,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h3 style={{ color: C.cream, fontSize: 15, fontWeight: 700 }}>Step Details</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", color: C.creamFaint, cursor: "pointer" }}><X size={18} /></button>
      </div>

      {[
        { label: "Name", field: "name", type: "text" },
        { label: "Role", field: "role", type: "text" },
        { label: "Action", field: "action", type: "text" },
      ].map(f => (
        <div key={f.field} style={{ marginBottom: 12 }}>
          <label style={labelStyle}>{f.label}</label>
          <input value={step[f.field] || ""} onChange={e => handleChange(f.field, e.target.value)} style={fieldStyle} />
        </div>
      ))}

      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Description</label>
        <textarea value={step.description || ""} onChange={e => handleChange("description", e.target.value)}
          style={{ ...fieldStyle, minHeight: 70, resize: "vertical" }} />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Type</label>
          <select value={step.type} onChange={e => handleChange("type", e.target.value)} style={fieldStyle}>
            {["action", "decision", "start", "end", "parallel-gateway"].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Risk</label>
          <select value={step.risk} onChange={e => handleChange("risk", e.target.value)} style={fieldStyle}>
            {["low", "medium", "high", "critical"].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Duration</label>
          <input type="number" value={step.duration} onChange={e => handleChange("duration", parseInt(e.target.value) || 0)} style={fieldStyle} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Unit</label>
          <select value={step.durationUnit} onChange={e => handleChange("durationUnit", e.target.value)} style={fieldStyle}>
            {DURATION_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Category</label>
        <select value={step.category} onChange={e => handleChange("category", e.target.value)} style={fieldStyle}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Risk Rationale</label>
        <textarea value={step.riskRationale || ""} onChange={e => handleChange("riskRationale", e.target.value)}
          style={{ ...fieldStyle, minHeight: 50, resize: "vertical" }} />
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <input type="checkbox" checked={step.parallel} onChange={e => handleChange("parallel", e.target.checked)} />
          Parallel
        </label>
        <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <input type="checkbox" checked={step.automatable} onChange={e => handleChange("automatable", e.target.checked)} />
          Automatable
        </label>
      </div>
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   INPUT PAGE (TABS: NL / BUILDER / IMPORT)
   ═══════════════════════════════════════════════════════════════════════════ */

const DocumentImport = memo(function DocumentImport({ dispatch }) {
  const [importText, setImportText] = useState("");
  const [preview, setPreview] = useState(null);

  const handlePreview = useCallback(() => {
    if (!importText.trim()) return;
    const lines = importText.split("\n").filter(l => l.trim());
    const isCSV = lines[0] && lines[0].includes(",");

    if (isCSV) {
      const headers = lines[0].split(",").map(h => h.trim());
      const rows = lines.slice(1).map(l => {
        const cells = l.split(",").map(c => c.trim());
        const row = {};
        headers.forEach((h, i) => { row[h] = cells[i] || ""; });
        return row;
      });
      setPreview({ type: "csv", headers, rows });
    } else {
      const steps = parseNaturalLanguage(importText);
      setPreview({ type: "text", steps });
    }
  }, [importText]);

  const handleCommit = useCallback(() => {
    if (!preview) return;
    if (preview.type === "text") {
      dispatch({ type: "SET_STEPS", payload: preview.steps });
    } else {
      const steps = preview.rows.map((row, i) => ({
        id: generateStepId(i),
        name: row.Name || row.Step || row.name || `Step ${i + 1}`,
        role: row.Role || row.role || row.Owner || "Unassigned",
        action: row.Action || row.action || "",
        description: row.Description || row.description || "",
        type: "action",
        duration: parseInt(row.Duration || row.duration) || 2,
        durationUnit: row.Unit || row.unit || "hours",
        risk: row.Risk || row.risk || "low",
        riskRationale: "Imported from CSV",
        inputs: [],
        outputs: [],
        dependencies: i > 0 ? [generateStepId(i - 1)] : [],
        parallel: false,
        outcomes: [],
        automatable: false,
        category: "review",
      }));
      dispatch({ type: "SET_STEPS", payload: steps });
    }
    dispatch({ type: "SHOW_TOAST", payload: { type: "success", message: "Data imported successfully." } });
    dispatch({ type: "SET_UI", payload: { activePage: "visualization" } });
  }, [preview, dispatch]);

  return (
    <div style={{ padding: 28, maxWidth: 900 }}>
      <h2 style={{ color: C.cream, fontSize: 22, fontWeight: 700, marginBottom: 6, fontFamily: FONT }}>Document Import</h2>
      <p style={{ color: C.creamMuted, fontSize: 13, marginBottom: 20, fontFamily: FONT }}>
        Paste CSV or plain text content. CSV should have headers like Name, Role, Description, Duration.
      </p>
      <textarea
        value={importText}
        onChange={e => setImportText(e.target.value)}
        placeholder={"Name,Role,Description,Duration,Risk\nReview Request,Manager,Review the incoming request,4,medium\n..."}
        style={{
          width: "100%", minHeight: 180, padding: 16,
          background: C.navy + "CC", border: `1px solid ${C.teal}33`,
          borderRadius: 10, color: C.cream, fontSize: 13, fontFamily: "monospace",
          lineHeight: 1.5, resize: "vertical", outline: "none",
        }}
      />
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <button onClick={handlePreview} style={{
          padding: "8px 20px", background: C.teal, border: "none", borderRadius: 6,
          color: C.cream, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT,
        }}>
          <Eye size={14} style={{ marginRight: 6 }} /> Preview
        </button>
        {preview && (
          <button onClick={handleCommit} style={{
            padding: "8px 20px", background: C.crimson, border: "none", borderRadius: 6,
            color: C.cream, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT,
          }}>
            <Check size={14} style={{ marginRight: 6 }} /> Import {preview.type === "text" ? preview.steps.length : preview.rows.length} Steps
          </button>
        )}
      </div>
      {preview && preview.type === "csv" && (
        <div style={{ marginTop: 20, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: FONT }}>
            <thead>
              <tr>
                {preview.headers.map(h => (
                  <th key={h} style={{ padding: "6px 10px", background: C.teal, color: C.cream, textAlign: "left", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.rows.slice(0, 10).map((row, i) => (
                <tr key={i}>
                  {preview.headers.map(h => (
                    <td key={h} style={{ padding: "6px 10px", borderBottom: `1px solid ${C.teal}22`, color: C.creamDim }}>{row[h]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});

const InputPage = memo(function InputPage({ state, dispatch }) {
  const tabs = [
    { id: "natural", label: "Natural Language", icon: Zap },
    { id: "builder", label: "Step Builder", icon: ClipboardList },
    { id: "import", label: "Import", icon: Upload },
  ];

  const handleTabChange = useCallback((mode) => {
    dispatch({ type: "SET_UI", payload: { inputMode: mode } });
  }, [dispatch]);

  return (
    <div>
      <div style={{ display: "flex", gap: 2, padding: "16px 28px 0", borderBottom: `1px solid ${C.teal}22` }}>
        {tabs.map(t => {
          const active = state.ui.inputMode === t.id;
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => handleTabChange(t.id)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "10px 18px",
              background: active ? `${C.teal}22` : "transparent",
              borderBottom: active ? `2px solid ${C.crimson}` : "2px solid transparent",
              border: "none", borderRadius: "6px 6px 0 0",
              color: active ? C.cream : C.creamMuted, cursor: "pointer",
              fontSize: 13, fontWeight: active ? 600 : 400, fontFamily: FONT,
            }}>
              <Icon size={15} /> {t.label}
            </button>
          );
        })}
      </div>
      {state.ui.inputMode === "natural" && <NaturalLanguageInput state={state} dispatch={dispatch} />}
      {state.ui.inputMode === "builder" && <StepBuilder state={state} dispatch={dispatch} />}
      {state.ui.inputMode === "import" && <DocumentImport dispatch={dispatch} />}
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   FLOWCHART VISUALIZATION
   ═══════════════════════════════════════════════════════════════════════════ */

const FlowchartView = memo(function FlowchartView({ steps }) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 600 });

  const processSteps = useMemo(() => steps, [steps]);
  const roles = useMemo(() => _.uniq(processSteps.map(s => s.role)), [processSteps]);

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDimensions({ width: Math.max(rect.width - 20, 600), height: Math.max(roles.length * 120 + 100, 500) });
    }
  }, [roles.length]);

  const layout = useMemo(() => {
    const laneHeight = 100;
    const nodeWidth = 140;
    const nodeHeight = 44;
    const xGap = 180;
    const yPadding = 70;
    const labelWidth = 120;
    const totalHeight = roles.length * laneHeight + yPadding * 2;

    const roleLaneY = {};
    roles.forEach((r, i) => { roleLaneY[r] = yPadding + i * laneHeight; });

    const nodes = [];
    let xPos = labelWidth + 40;

    for (const step of processSteps) {
      const y = (roleLaneY[step.role] || yPadding) + laneHeight / 2 - nodeHeight / 2;
      nodes.push({ ...step, x: xPos, y, w: nodeWidth, h: nodeHeight });
      xPos += xGap;
    }

    const totalWidth = xPos + 60;

    const edges = [];
    const idToNode = {};
    nodes.forEach(n => { idToNode[n.id] = n; });

    for (const node of nodes) {
      for (const depId of node.dependencies) {
        const source = idToNode[depId];
        if (source) {
          edges.push({
            x1: source.x + source.w,
            y1: source.y + source.h / 2,
            x2: node.x,
            y2: node.y + node.h / 2,
            type: node.type === "decision" ? "decision" : "normal",
          });
        }
      }
    }

    return { nodes, edges, roleLaneY, laneHeight, totalWidth, totalHeight, labelWidth, yPadding };
  }, [processSteps, roles]);

  if (processSteps.length === 0) {
    return <EmptyState icon={GitBranch} title="No Process Data" description="Parse or build a process first to see the flowchart." />;
  }

  return (
    <div ref={containerRef} style={{ overflow: "auto", width: "100%", height: "calc(100vh - 130px)" }}>
      <svg width={layout.totalWidth} height={layout.totalHeight} style={{ fontFamily: FONT }}>
        <defs>
          <marker id="arrowhead" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={C.tealLight} />
          </marker>
          <marker id="arrowhead-decision" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={C.crimson} />
          </marker>
        </defs>

        {roles.map((role, i) => (
          <g key={role}>
            <rect
              x={0} y={layout.roleLaneY[role]}
              width={layout.totalWidth} height={layout.laneHeight}
              fill={i % 2 === 0 ? `${C.forest}88` : `${C.navy}88`}
              stroke={C.teal + "22"} strokeWidth={1}
            />
            <text
              x={10} y={layout.roleLaneY[role] + layout.laneHeight / 2}
              fill={C.creamMuted} fontSize={11} fontWeight={600} dominantBaseline="middle"
              style={{ textTransform: "uppercase", letterSpacing: "0.5px" }}
            >{role.length > 18 ? role.substring(0, 16) + "…" : role}</text>
          </g>
        ))}

        {layout.edges.map((e, i) => (
          <line key={i}
            x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke={e.type === "decision" ? C.crimson + "88" : C.tealLight + "88"}
            strokeWidth={1.5}
            strokeDasharray={e.type === "decision" ? "6,3" : "none"}
            markerEnd={e.type === "decision" ? "url(#arrowhead-decision)" : "url(#arrowhead)"}
          />
        ))}

        {layout.nodes.map(node => {
          const riskColor = RISK_COLORS[node.risk] || C.teal;
          return (
            <g key={node.id}>
              {node.type === "decision" ? (
                <g transform={`translate(${node.x + node.w / 2}, ${node.y + node.h / 2})`}>
                  <polygon
                    points={`0,${-node.h / 2} ${node.w / 2},0 0,${node.h / 2} ${-node.w / 2},0`}
                    fill={C.forest} stroke={riskColor} strokeWidth={2}
                  />
                  <text fill={C.cream} fontSize={10} fontWeight={600} textAnchor="middle" dominantBaseline="middle">
                    {node.name.length > 18 ? node.name.substring(0, 16) + "…" : node.name}
                  </text>
                </g>
              ) : node.type === "start" || node.type === "end" ? (
                <g>
                  <circle cx={node.x + node.w / 2} cy={node.y + node.h / 2} r={node.h / 2}
                    fill={node.type === "start" ? C.olive + "44" : C.crimson + "44"}
                    stroke={node.type === "start" ? C.olive : C.crimson} strokeWidth={2}
                  />
                  <text x={node.x + node.w / 2} y={node.y + node.h / 2}
                    fill={C.cream} fontSize={10} fontWeight={600} textAnchor="middle" dominantBaseline="middle">
                    {node.type === "start" ? "Start" : "End"}
                  </text>
                </g>
              ) : (
                <g>
                  <rect
                    x={node.x} y={node.y} width={node.w} height={node.h}
                    rx={8} fill={C.forest} stroke={riskColor} strokeWidth={1.5}
                  />
                  <text x={node.x + node.w / 2} y={node.y + node.h / 2 - 6}
                    fill={C.cream} fontSize={10} fontWeight={600} textAnchor="middle" dominantBaseline="middle">
                    {node.name.length > 18 ? node.name.substring(0, 16) + "…" : node.name}
                  </text>
                  <text x={node.x + node.w / 2} y={node.y + node.h / 2 + 8}
                    fill={C.creamFaint} fontSize={9} textAnchor="middle" dominantBaseline="middle">
                    {node.role.length > 20 ? node.role.substring(0, 18) + "…" : node.role}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   NODE GRAPH (D3 FORCE)
   ═══════════════════════════════════════════════════════════════════════════ */

const NodeGraph = memo(function NodeGraph({ steps }) {
  const svgRef = useRef(null);
  const simRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  const processSteps = useMemo(() => steps.filter(s => s.type !== "start" && s.type !== "end"), [steps]);
  const roles = useMemo(() => _.uniq(processSteps.map(s => s.role)), [processSteps]);

  const roleColorScale = useMemo(() => {
    const colors = [C.crimson, C.teal, C.olive, C.tealLight, C.crimsonLight, C.olivLight];
    const scale = {};
    roles.forEach((r, i) => { scale[r] = colors[i % colors.length]; });
    return scale;
  }, [roles]);

  useEffect(() => {
    if (!svgRef.current || processSteps.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const container = svgRef.current.parentElement;
    const width = container ? container.clientWidth - 20 : 800;
    const height = Math.max(500, container ? container.clientHeight - 20 : 600);
    setDimensions({ width, height });

    const nodes = processSteps.map(s => ({
      id: s.id,
      name: s.name,
      role: s.role,
      risk: s.risk,
      type: s.type,
      duration: toHours(s.duration, s.durationUnit),
      ...s,
    }));

    const idSet = new Set(nodes.map(n => n.id));
    const links = [];
    processSteps.forEach(s => {
      s.dependencies.forEach(d => {
        if (idSet.has(d)) links.push({ source: d, target: s.id });
      });
    });

    const g = svg.append("g");

    const zoom = d3.zoom().scaleExtent([0.3, 3]).on("zoom", (event) => {
      g.attr("transform", event.transform);
    });
    svg.call(zoom);

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40));

    simRef.current = simulation;

    const link = g.append("g").selectAll("line").data(links).join("line")
      .attr("stroke", C.tealLight + "66").attr("stroke-width", 1.5)
      .attr("marker-end", "url(#graph-arrow)");

    svg.append("defs").append("marker")
      .attr("id", "graph-arrow").attr("viewBox", "0 0 10 7")
      .attr("refX", 25).attr("refY", 3.5)
      .attr("markerWidth", 8).attr("markerHeight", 6).attr("orient", "auto")
      .append("polygon").attr("points", "0 0, 10 3.5, 0 7").attr("fill", C.tealLight + "88");

    const node = g.append("g").selectAll("g").data(nodes).join("g")
      .style("cursor", "grab");

    node.append("circle")
      .attr("r", d => Math.max(16, Math.min(30, d.duration * 2 + 10)))
      .attr("fill", d => roleColorScale[d.role] + "33")
      .attr("stroke", d => RISK_COLORS[d.risk] || C.teal)
      .attr("stroke-width", 2);

    node.append("text")
      .text(d => d.name.length > 14 ? d.name.substring(0, 12) + "…" : d.name)
      .attr("text-anchor", "middle").attr("dy", -28)
      .attr("fill", C.cream).attr("font-size", 10).attr("font-weight", 600)
      .attr("font-family", FONT);

    const drag = d3.drag()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x; d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x; d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null; d.fy = null;
      });

    node.call(drag);

    simulation.on("tick", () => {
      link.attr("x1", d => d.source.x).attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    return () => { simulation.stop(); };
  }, [processSteps, roleColorScale]);

  if (processSteps.length === 0) {
    return <EmptyState icon={Network} title="No Process Data" description="Parse or build a process to see the node graph." />;
  }

  return (
    <div style={{ width: "100%", height: "calc(100vh - 130px)", position: "relative" }}>
      <svg ref={svgRef} width="100%" height="100%" style={{ background: C.navy }} />
      <div style={{
        position: "absolute", bottom: 16, left: 16, padding: 12,
        background: C.forest + "EE", borderRadius: 8, border: `1px solid ${C.teal}33`,
      }}>
        <div style={{ color: C.creamMuted, fontSize: 10, fontWeight: 600, marginBottom: 6, fontFamily: FONT }}>ROLES</div>
        {roles.map(r => (
          <div key={r} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: roleColorScale[r] }} />
            <span style={{ color: C.creamDim, fontSize: 10, fontFamily: FONT }}>{r}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   VISUALIZATION PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

const VisualizationPage = memo(function VisualizationPage({ state, dispatch }) {
  const handleToggle = useCallback((mode) => {
    dispatch({ type: "SET_UI", payload: { vizMode: mode } });
  }, [dispatch]);

  return (
    <div style={{ height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 28px", borderBottom: `1px solid ${C.teal}22` }}>
        <h2 style={{ color: C.cream, fontSize: 18, fontWeight: 700, fontFamily: FONT, marginRight: 16 }}>Visualization</h2>
        {["flowchart", "nodeGraph"].map(mode => (
          <button key={mode} onClick={() => handleToggle(mode)} style={{
            padding: "6px 16px", borderRadius: 6,
            background: state.ui.vizMode === mode ? C.crimson + "33" : "transparent",
            border: `1px solid ${state.ui.vizMode === mode ? C.crimson + "66" : C.teal + "33"}`,
            color: state.ui.vizMode === mode ? C.cream : C.creamMuted,
            fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: FONT,
          }}>
            {mode === "flowchart" ? <><GitBranch size={14} style={{ marginRight: 6 }} />Flowchart</> : <><Network size={14} style={{ marginRight: 6 }} />Node Graph</>}
          </button>
        ))}
      </div>
      {state.ui.vizMode === "flowchart" ? <FlowchartView steps={state.steps} /> : <NodeGraph steps={state.steps} />}
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   ANALYSIS DASHBOARD
   ═══════════════════════════════════════════════════════════════════════════ */

const AnalysisDashboard = memo(function AnalysisDashboard({ state, dispatch }) {
  const metrics = useMemo(() => computeMetrics(state.steps), [state.steps]);
  const raci = useMemo(() => computeRACI(state.steps), [state.steps]);
  const health = useMemo(() => computeHealthScores(state.steps, metrics), [state.steps, metrics]);
  const processSteps = useMemo(() => state.steps.filter(s => s.type !== "start" && s.type !== "end"), [state.steps]);

  const [activeTab, setActiveTab] = useState("overview");

  const costRates = useMemo(() => {
    const rates = { ...state.analysis.costRates };
    metrics.roles.forEach(r => { if (!rates[r]) rates[r] = getDefaultRate(r); });
    return rates;
  }, [metrics.roles, state.analysis.costRates]);

  const costData = useMemo(() => {
    const stepCosts = processSteps.map(s => ({
      name: s.name.length > 20 ? s.name.substring(0, 18) + "…" : s.name,
      cost: toHours(s.duration, s.durationUnit) * (costRates[s.role] || 85),
      role: s.role,
    }));
    const roleCosts = {};
    stepCosts.forEach(sc => { roleCosts[sc.role] = (roleCosts[sc.role] || 0) + sc.cost; });
    const totalCost = _.sumBy(stepCosts, "cost");
    return { stepCosts, roleCosts, totalCost };
  }, [processSteps, costRates]);

  if (processSteps.length === 0) {
    return (
      <div style={{ padding: 28 }}>
        <EmptyState icon={BarChart3} title="No Data to Analyze" description="Parse or build a process first to see analytics." />
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "raci", label: "RACI", icon: Users },
    { id: "risk", label: "Risk Matrix", icon: Shield },
    { id: "bottleneck", label: "Bottleneck", icon: AlertTriangle },
    { id: "health", label: "Health", icon: Award },
    { id: "cost", label: "Cost", icon: DollarSign },
  ];

  const raciColorMap = { R: C.crimson, A: C.teal, C: C.olive, I: C.creamFaint };

  const riskMatrixData = processSteps.map(s => {
    const likelihood = s.risk === "critical" ? 5 : s.risk === "high" ? 4 : s.risk === "medium" ? 3 : s.risk === "low" ? 1.5 : 1;
    const impact = s.type === "decision" ? likelihood + 0.5 : likelihood;
    return { name: s.name, likelihood: Math.min(5, likelihood), impact: Math.min(5, impact), duration: toHours(s.duration, s.durationUnit), risk: s.risk };
  });

  const bottleneckChartData = processSteps.map(s => ({
    name: s.name.length > 15 ? s.name.substring(0, 13) + "…" : s.name,
    duration: toHours(s.duration, s.durationUnit),
    risk: s.risk,
    fill: toHours(s.duration, s.durationUnit) > metrics.meanDuration + metrics.stdDuration ? C.crimson : RISK_COLORS[s.risk],
  }));

  const roleWorkloadData = Object.entries(metrics.roleWorkload).map(([role, count]) => ({
    name: role.length > 15 ? role.substring(0, 13) + "…" : role,
    value: count,
  }));

  const healthRadarData = [
    { subject: "Efficiency", value: health.efficiency },
    { subject: "Clarity", value: health.clarity },
    { subject: "Risk Exposure", value: health.riskExposure },
    { subject: "Role Balance", value: health.roleBalance },
    { subject: "Automation", value: health.automationReadiness },
    { subject: "Decision Density", value: health.decisionDensity },
  ];

  const roleCostChartData = Object.entries(costData.roleCosts).map(([role, cost]) => ({
    name: role.length > 15 ? role.substring(0, 13) + "…" : role,
    value: Math.round(cost),
  }));

  const CHART_COLORS = [C.crimson, C.teal, C.olive, C.tealLight, C.crimsonLight, C.olivLight];

  return (
    <div style={{ padding: 28, overflow: "auto", height: "calc(100vh - 60px)" }}>
      <h2 style={{ color: C.cream, fontSize: 22, fontWeight: 700, marginBottom: 18, fontFamily: FONT }}>Analysis Dashboard</h2>

      <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map(t => {
          const active = activeTab === t.id;
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 6,
              background: active ? C.crimson + "33" : "transparent",
              border: `1px solid ${active ? C.crimson + "66" : C.teal + "33"}`,
              color: active ? C.cream : C.creamMuted, fontSize: 12, fontWeight: 500,
              cursor: "pointer", fontFamily: FONT,
            }}>
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* ── Overview ── */}
      {activeTab === "overview" && (
        <div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            <MetricCard icon={Layers} label="Total Steps" value={metrics.totalSteps} />
            <MetricCard icon={Users} label="Roles" value={metrics.roles.length} accent={C.teal} />
            <MetricCard icon={Diamond} label="Decisions" value={metrics.decisions} accent={C.crimson} />
            <MetricCard icon={Clock} label="Critical Path" value={`${Math.round(metrics.criticalPathDuration)}h`} sub={`${metrics.criticalPath.length} steps`} accent={C.crimsonLight} />
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            <MetricCard icon={Target} label="Complexity" value={metrics.complexityIndex} sub="/ 10 scale" accent={C.tealLight} />
            <MetricCard icon={Zap} label="Automation" value={`${metrics.automationPotential}%`} sub={`${metrics.automatableCount} steps`} accent={C.olive} />
            <MetricCard icon={ArrowRight} label="Handoffs" value={metrics.handoffs} accent={C.crimson} />
            <MetricCard icon={AlertTriangle} label="Bottlenecks" value={metrics.bottleneckSteps.length} sub={`> mean + 1σ`} accent={C.crimson} />
          </div>
        </div>
      )}

      {/* ── RACI ── */}
      {activeTab === "raci" && (
        <div style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: FONT }}>
            <thead>
              <tr>
                <th style={{ padding: "8px 12px", background: C.teal, color: C.cream, textAlign: "left", fontWeight: 600, position: "sticky", left: 0, zIndex: 1 }}>Step</th>
                {raci.roles.map(r => (
                  <th key={r} style={{ padding: "8px 10px", background: C.teal, color: C.cream, textAlign: "center", fontWeight: 600, minWidth: 80 }}>
                    {r.length > 12 ? r.substring(0, 10) + "…" : r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {raci.matrix.map((row, i) => (
                <tr key={row.step.id}>
                  <td style={{ padding: "6px 12px", borderBottom: `1px solid ${C.teal}22`, color: C.creamDim, fontWeight: 500, background: C.forest, position: "sticky", left: 0 }}>
                    {row.step.name.length > 25 ? row.step.name.substring(0, 23) + "…" : row.step.name}
                  </td>
                  {raci.roles.map(r => {
                    const val = row.assignments[r];
                    return (
                      <td key={r} style={{
                        padding: "6px 10px", borderBottom: `1px solid ${C.teal}22`,
                        textAlign: "center", fontWeight: 700, fontSize: 13,
                        color: val ? raciColorMap[val] || C.creamFaint : "transparent",
                        background: val ? (raciColorMap[val] || C.creamFaint) + "11" : "transparent",
                      }}>
                        {val || "–"}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td style={{ padding: "8px 12px", background: C.navyLight, color: C.cream, fontWeight: 700, position: "sticky", left: 0 }}>Workload (R+A)</td>
                {raci.roles.map(r => {
                  const count = raci.matrix.reduce((sum, row) => {
                    const val = row.assignments[r];
                    return sum + (val === "R" || val === "A" ? 1 : 0);
                  }, 0);
                  return (
                    <td key={r} style={{
                      padding: "8px 10px", background: C.navyLight, textAlign: "center",
                      color: C.cream, fontWeight: 700, fontSize: 14,
                    }}>{count}</td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ── Risk Matrix ── */}
      {activeTab === "risk" && (
        <div>
          <div style={{
            background: `linear-gradient(135deg, ${C.forest}, ${C.navyLight})`,
            borderRadius: 10, padding: 20, border: `1px solid ${C.teal}22`, marginBottom: 20,
          }}>
            <h3 style={{ color: C.cream, fontSize: 15, fontWeight: 600, marginBottom: 14, fontFamily: FONT }}>Risk Scatter Plot</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.teal + "22"} />
                <XAxis type="number" dataKey="likelihood" name="Likelihood" domain={[0, 5.5]}
                  tick={{ fill: C.creamMuted, fontSize: 11 }} label={{ value: "Likelihood", fill: C.creamMuted, fontSize: 12, position: "bottom" }} />
                <YAxis type="number" dataKey="impact" name="Impact" domain={[0, 5.5]}
                  tick={{ fill: C.creamMuted, fontSize: 11 }} label={{ value: "Impact", fill: C.creamMuted, fontSize: 12, angle: -90, position: "insideLeft" }} />
                <ZAxis type="number" dataKey="duration" range={[40, 200]} />
                <Tooltip content={({ payload }) => {
                  if (!payload || !payload[0]) return null;
                  const d = payload[0].payload;
                  return (
                    <div style={{ background: C.navy, border: `1px solid ${C.teal}44`, padding: 10, borderRadius: 6, fontFamily: FONT }}>
                      <div style={{ color: C.cream, fontSize: 12, fontWeight: 600 }}>{d.name}</div>
                      <div style={{ color: C.creamMuted, fontSize: 11 }}>Risk: {d.risk} | Duration: {d.duration}h</div>
                    </div>
                  );
                }} />
                <Scatter data={riskMatrixData} fill={C.crimson}>
                  {riskMatrixData.map((entry, idx) => (
                    <Cell key={idx} fill={RISK_COLORS[entry.risk]} fillOpacity={0.7} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div style={{ overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: FONT }}>
              <thead>
                <tr>
                  {["Step", "Risk Level", "Rationale", "Mitigations"].map(h => (
                    <th key={h} style={{ padding: "8px 12px", background: C.teal, color: C.cream, textAlign: "left", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {processSteps.filter(s => s.risk !== "low").map(s => (
                  <tr key={s.id}>
                    <td style={{ padding: "8px 12px", borderBottom: `1px solid ${C.teal}22`, color: C.creamDim }}>{s.name}</td>
                    <td style={{ padding: "8px 12px", borderBottom: `1px solid ${C.teal}22` }}><Badge label={s.risk} color={RISK_COLORS[s.risk]} /></td>
                    <td style={{ padding: "8px 12px", borderBottom: `1px solid ${C.teal}22`, color: C.creamMuted }}>{s.riskRationale}</td>
                    <td style={{ padding: "8px 12px", borderBottom: `1px solid ${C.teal}22`, color: C.creamMuted }}>
                      {generateMitigation(s).map((m, i) => <div key={i} style={{ marginBottom: 3 }}>• {m}</div>)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Bottleneck ── */}
      {activeTab === "bottleneck" && (
        <div>
          <div style={{
            background: `linear-gradient(135deg, ${C.forest}, ${C.navyLight})`,
            borderRadius: 10, padding: 20, border: `1px solid ${C.teal}22`, marginBottom: 20,
          }}>
            <h3 style={{ color: C.cream, fontSize: 15, fontWeight: 600, marginBottom: 14, fontFamily: FONT }}>Step Duration Analysis</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={bottleneckChartData} margin={{ top: 10, right: 20, bottom: 50, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.teal + "22"} />
                <XAxis dataKey="name" tick={{ fill: C.creamMuted, fontSize: 10 }} angle={-35} textAnchor="end" height={60} />
                <YAxis tick={{ fill: C.creamMuted, fontSize: 11 }} label={{ value: "Hours", fill: C.creamMuted, fontSize: 12, angle: -90, position: "insideLeft" }} />
                <Tooltip content={({ payload }) => {
                  if (!payload || !payload[0]) return null;
                  const d = payload[0].payload;
                  return (
                    <div style={{ background: C.navy, border: `1px solid ${C.teal}44`, padding: 10, borderRadius: 6, fontFamily: FONT }}>
                      <div style={{ color: C.cream, fontSize: 12, fontWeight: 600 }}>{d.name}</div>
                      <div style={{ color: C.creamMuted, fontSize: 11 }}>{d.duration}h | Risk: {d.risk}</div>
                    </div>
                  );
                }} />
                <Bar dataKey="duration" radius={[4, 4, 0, 0]}>
                  {bottleneckChartData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
              <div style={{ width: 12, height: 12, background: C.crimson, borderRadius: 2 }} />
              <span style={{ color: C.creamMuted, fontSize: 11, fontFamily: FONT }}>Exceeds mean + 1σ ({Math.round(metrics.meanDuration + metrics.stdDuration)}h threshold)</span>
            </div>
          </div>

          <div style={{
            background: `linear-gradient(135deg, ${C.forest}, ${C.navyLight})`,
            borderRadius: 10, padding: 20, border: `1px solid ${C.teal}22`,
          }}>
            <h3 style={{ color: C.cream, fontSize: 15, fontWeight: 600, marginBottom: 14, fontFamily: FONT }}>Role Workload Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RPieChart>
                <Pie data={roleWorkloadData} cx="50%" cy="50%" innerRadius={50} outerRadius={90}
                  paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {roleWorkloadData.map((entry, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Health Scorecard ── */}
      {activeTab === "health" && (
        <div>
          <div style={{
            background: `linear-gradient(135deg, ${C.forest}, ${C.navyLight})`,
            borderRadius: 10, padding: 20, border: `1px solid ${C.teal}22`, marginBottom: 20,
            textAlign: "center",
          }}>
            <div style={{ color: C.creamMuted, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Overall Health Score</div>
            <div style={{ color: health.overall >= 70 ? C.olive : health.overall >= 40 ? C.tealLight : C.crimson, fontSize: 48, fontWeight: 700, fontFamily: FONT }}>{health.overall}</div>
            <div style={{ color: C.creamFaint, fontSize: 12 }}>out of 100</div>
          </div>

          <div style={{
            background: `linear-gradient(135deg, ${C.forest}, ${C.navyLight})`,
            borderRadius: 10, padding: 20, border: `1px solid ${C.teal}22`, marginBottom: 20,
          }}>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={healthRadarData}>
                <PolarGrid stroke={C.teal + "44"} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: C.creamMuted, fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: C.creamFaint, fontSize: 10 }} />
                <Radar name="Score" dataKey="value" stroke={C.crimson} fill={C.crimson} fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {healthRadarData.map(d => (
              <div key={d.subject} style={{
                flex: "1 1 140px", padding: 14, borderRadius: 8,
                background: `linear-gradient(135deg, ${C.forest}, ${C.navyLight})`,
                border: `1px solid ${C.teal}22`,
              }}>
                <div style={{ color: C.creamMuted, fontSize: 11, fontWeight: 600, marginBottom: 4 }}>{d.subject}</div>
                <div style={{ color: d.value >= 70 ? C.olive : d.value >= 40 ? C.tealLight : C.crimson, fontSize: 24, fontWeight: 700 }}>{d.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Cost ── */}
      {activeTab === "cost" && (
        <div>
          <div style={{
            background: `linear-gradient(135deg, ${C.forest}, ${C.navyLight})`,
            borderRadius: 10, padding: 20, border: `1px solid ${C.teal}22`, marginBottom: 20,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ color: C.cream, fontSize: 15, fontWeight: 600, fontFamily: FONT }}>Cost Estimation</h3>
              <div style={{ color: C.cream, fontSize: 28, fontWeight: 700, fontFamily: FONT }}>${Math.round(costData.totalCost).toLocaleString()}</div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ color: C.creamMuted, fontSize: 11, fontWeight: 600, marginBottom: 10, textTransform: "uppercase" }}>Hourly Rates by Role</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {metrics.roles.filter(r => r !== "System").map(r => (
                  <div key={r} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: C.creamDim, fontSize: 11, minWidth: 80 }}>{r.length > 12 ? r.substring(0, 10) + "…" : r}</span>
                    <input
                      type="number"
                      value={costRates[r] || 85}
                      onChange={e => dispatch({ type: "SET_COST_RATE", payload: { role: r, rate: parseInt(e.target.value) || 0 } })}
                      style={{
                        width: 65, padding: "3px 6px", background: C.navy + "AA",
                        border: `1px solid ${C.teal}33`, borderRadius: 4, color: C.cream,
                        fontSize: 12, fontFamily: FONT, outline: "none",
                      }}
                    />
                    <span style={{ color: C.creamFaint, fontSize: 10 }}>/hr</span>
                  </div>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <RPieChart>
                <Pie data={roleCostChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={90}
                  paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: $${value.toLocaleString()}`}>
                  {roleCostChartData.map((entry, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
              </RPieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: FONT }}>
              <thead>
                <tr>
                  {["Step", "Role", "Duration", "Rate", "Cost"].map(h => (
                    <th key={h} style={{ padding: "8px 12px", background: C.teal, color: C.cream, textAlign: "left", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {costData.stepCosts.sort((a, b) => b.cost - a.cost).map((sc, i) => (
                  <tr key={i}>
                    <td style={{ padding: "6px 12px", borderBottom: `1px solid ${C.teal}22`, color: C.creamDim }}>{sc.name}</td>
                    <td style={{ padding: "6px 12px", borderBottom: `1px solid ${C.teal}22`, color: C.creamMuted }}>{sc.role}</td>
                    <td style={{ padding: "6px 12px", borderBottom: `1px solid ${C.teal}22`, color: C.creamMuted }}>{Math.round(toHours(processSteps.find(s => s.name.startsWith(sc.name.replace("…", "")))?.duration || 0, processSteps.find(s => s.name.startsWith(sc.name.replace("…", "")))?.durationUnit || "hours"))}h</td>
                    <td style={{ padding: "6px 12px", borderBottom: `1px solid ${C.teal}22`, color: C.creamMuted }}>${costRates[sc.role] || 85}/hr</td>
                    <td style={{ padding: "6px 12px", borderBottom: `1px solid ${C.teal}22`, color: C.cream, fontWeight: 600 }}>${Math.round(sc.cost).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   BRD GENERATOR
   ═══════════════════════════════════════════════════════════════════════════ */

const BRDGenerator = memo(function BRDGenerator({ state }) {
  const metrics = useMemo(() => computeMetrics(state.steps), [state.steps]);
  const raci = useMemo(() => computeRACI(state.steps), [state.steps]);
  const health = useMemo(() => computeHealthScores(state.steps, metrics), [state.steps, metrics]);
  const processSteps = useMemo(() => state.steps.filter(s => s.type !== "start" && s.type !== "end"), [state.steps]);
  const today = new Date().toISOString().split("T")[0];

  const handleExport = useCallback(() => {
    const raciColorMapExport = { R: "#6D061D", A: "#25464B", C: "#4F6815", I: "#999" };

    const html = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>BRD - ${state.process.name}</title>
<style>
body { font-family: Calibri, Arial, sans-serif; color: #1a1a1a; margin: 40px; line-height: 1.6; }
h1 { color: #6D061D; font-size: 24pt; border-bottom: 3px solid #6D061D; padding-bottom: 8px; }
h2 { color: #25464B; font-size: 16pt; border-bottom: 1px solid #25464B; padding-bottom: 4px; margin-top: 24pt; }
h3 { color: #6D061D; font-size: 13pt; }
table { border-collapse: collapse; width: 100%; margin: 12px 0; }
th { background-color: #25464B; color: white; padding: 8px 10px; text-align: left; font-size: 10pt; }
td { padding: 6px 10px; border: 1px solid #ddd; font-size: 10pt; }
tr:nth-child(even) { background-color: #f8f6f3; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 9pt; font-weight: bold; }
.meta-table td { border: none; padding: 4px 12px; }
.meta-table td:first-child { font-weight: bold; color: #25464B; width: 160px; }
p { margin: 6px 0; font-size: 11pt; }
</style></head><body>

<h1>Business Requirements Document</h1>
<h2>1. Document Control</h2>
<table class="meta-table">
<tr><td>Title</td><td>${state.process.name} — Business Requirements Document</td></tr>
<tr><td>Version</td><td>${state.process.version}</td></tr>
<tr><td>Date</td><td>${today}</td></tr>
<tr><td>Author</td><td>${state.process.author}</td></tr>
<tr><td>Status</td><td>${state.process.status}</td></tr>
</table>

<h2>2. Executive Summary</h2>
<p>This document defines the business requirements for the <strong>${state.process.name}</strong> process. The process comprises ${metrics.totalSteps} operational steps executed by ${metrics.roles.length} distinct roles, with ${metrics.decisions} decision points and ${metrics.handoffs} inter-role handoffs.</p>
<p>The critical path spans ${metrics.criticalPath.length} steps with an estimated duration of ${Math.round(metrics.criticalPathDuration)} hours. The process complexity index is ${metrics.complexityIndex}/10, and ${metrics.automationPotential}% of steps have been identified as candidates for automation. The overall process health score is ${health.overall}/100.</p>

<h2>3. Scope &amp; Objectives</h2>
<p>This process covers the end-to-end workflow from initiation through completion. It establishes clear ownership, decision criteria, and hand-off protocols between ${metrics.roles.join(", ")}.</p>
<p>The objectives are to standardize execution, reduce cycle time through automation of eligible steps, and ensure compliance with organizational policies at each decision gate.</p>

<h2>4. Stakeholders &amp; Roles</h2>
<table>
<tr><th>Role</th><th>Steps Owned</th><th>Workload Share</th></tr>
${metrics.roles.map(r => {
  const count = metrics.roleWorkload[r] || 0;
  const pct = Math.round((count / Math.max(metrics.totalSteps, 1)) * 100);
  return `<tr><td>${r}</td><td>${count}</td><td>${pct}%</td></tr>`;
}).join("")}
</table>

<h2>5. Process Overview</h2>
<table>
<tr><th>#</th><th>Step</th><th>Role</th><th>Type</th><th>Duration</th><th>Risk</th></tr>
${processSteps.map((s, i) => `<tr><td>${i + 1}</td><td>${s.name}</td><td>${s.role}</td><td>${s.type}</td><td>${s.duration} ${s.durationUnit}</td><td>${s.risk}</td></tr>`).join("")}
</table>

<h2>6. Detailed Process Flow</h2>
${processSteps.map((s, i) => `
<h3>6.${i + 1} ${s.name}</h3>
<p><strong>Owner:</strong> ${s.role} | <strong>Type:</strong> ${s.type} | <strong>Duration:</strong> ${s.duration} ${s.durationUnit} | <strong>Risk:</strong> ${s.risk}</p>
<p><strong>Description:</strong> ${s.description}</p>
<p><strong>Inputs:</strong> ${s.inputs.join(", ") || "N/A"}</p>
<p><strong>Outputs:</strong> ${s.outputs.join(", ") || "N/A"}</p>
${s.type === "decision" ? `<p><strong>Decision Outcomes:</strong> ${s.outcomes.join(", ")}</p>` : ""}
<p><strong>Automatable:</strong> ${s.automatable ? "Yes" : "No"} | <strong>Category:</strong> ${s.category}</p>
`).join("")}

<h2>7. Decision Logic</h2>
<table>
<tr><th>Decision</th><th>Owner</th><th>Outcomes</th><th>Risk</th></tr>
${processSteps.filter(s => s.type === "decision").map(s => `<tr><td>${s.name}</td><td>${s.role}</td><td>${s.outcomes.join(" / ")}</td><td>${s.risk}</td></tr>`).join("") || "<tr><td colspan='4'>No decision points identified</td></tr>"}
</table>

<h2>8. RACI Matrix</h2>
<table>
<tr><th>Step</th>${raci.roles.map(r => `<th>${r}</th>`).join("")}</tr>
${raci.matrix.map(row => `<tr><td>${row.step.name}</td>${raci.roles.map(r => {
  const v = row.assignments[r];
  return `<td style="text-align:center;font-weight:bold;color:${raciColorMapExport[v] || '#ccc'}">${v || "–"}</td>`;
}).join("")}</tr>`).join("")}
</table>

<h2>9. Risk Assessment</h2>
<table>
<tr><th>Step</th><th>Risk</th><th>Rationale</th><th>Mitigations</th></tr>
${processSteps.filter(s => s.risk !== "low").map(s => `<tr><td>${s.name}</td><td>${s.risk}</td><td>${s.riskRationale}</td><td>${generateMitigation(s).join("; ")}</td></tr>`).join("")}
</table>

<h2>10. Process Metrics</h2>
<table class="meta-table">
<tr><td>Total Steps</td><td>${metrics.totalSteps}</td></tr>
<tr><td>Roles Involved</td><td>${metrics.roles.length}</td></tr>
<tr><td>Decision Points</td><td>${metrics.decisions}</td></tr>
<tr><td>Critical Path Duration</td><td>${Math.round(metrics.criticalPathDuration)} hours</td></tr>
<tr><td>Complexity Index</td><td>${metrics.complexityIndex} / 10</td></tr>
<tr><td>Automation Potential</td><td>${metrics.automationPotential}%</td></tr>
<tr><td>Health Score</td><td>${health.overall} / 100</td></tr>
</table>

<h2>11. Assumptions &amp; Constraints</h2>
<p>All duration estimates assume standard business hours (8h/day, 40h/week). Role assignments reflect current organizational structure. Automation potential assessments are based on action type classification and may require detailed technical evaluation.</p>

<h2>12. Dependencies &amp; Integrations</h2>
<p>The process involves ${metrics.handoffs} cross-role handoffs requiring coordination protocols. ${metrics.bottleneckSteps.length} steps have been flagged as potential bottlenecks exceeding the mean duration threshold. ${metrics.criticalPath.length} steps form the critical path and represent schedule risk.</p>

<h2>13. Glossary</h2>
<table>
<tr><th>Term</th><th>Definition</th></tr>
${metrics.roles.map(r => `<tr><td>${r}</td><td>Process participant responsible for assigned steps</td></tr>`).join("")}
<tr><td>Critical Path</td><td>Longest sequential chain of dependent steps determining minimum process duration</td></tr>
<tr><td>RACI</td><td>Responsible, Accountable, Consulted, Informed — stakeholder assignment matrix</td></tr>
</table>

<h2>14. Approval Sign-off</h2>
<table>
<tr><th>Role</th><th>Name</th><th>Signature</th><th>Date</th></tr>
${metrics.roles.slice(0, 4).map(r => `<tr><td>${r}</td><td></td><td></td><td></td></tr>`).join("")}
</table>

<p style="text-align:center;color:#999;margin-top:40px;font-size:9pt;">Generated by ProcessForge — Cherrystone Consulting — ${today}</p>
</body></html>`;

    const blob = new Blob([html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BRD_${state.process.name.replace(/\s+/g, "_")}_${today}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [state, metrics, raci, health, processSteps, today]);

  if (processSteps.length === 0) {
    return (
      <div style={{ padding: 28 }}>
        <EmptyState icon={FileText} title="No BRD Data" description="Parse or build a process to generate the Business Requirements Document." />
      </div>
    );
  }

  const raciColorMap = { R: C.crimson, A: C.teal, C: C.olive, I: C.creamFaint };
  const sectionStyle = {
    background: `linear-gradient(135deg, #FAF8F5, #F0E6DA44)`,
    borderRadius: 10, padding: "24px 28px", marginBottom: 20,
    border: `1px solid ${C.teal}22`, fontFamily: FONT,
  };
  const h2Style = { color: C.teal, fontSize: 16, fontWeight: 700, borderBottom: `2px solid ${C.teal}44`, paddingBottom: 6, marginBottom: 14 };
  const h3Style = { color: C.crimson, fontSize: 14, fontWeight: 600, marginBottom: 8, marginTop: 14 };
  const pStyle = { color: "#333", fontSize: 13, lineHeight: 1.7, marginBottom: 8 };
  const tdStyle = { padding: "6px 10px", borderBottom: "1px solid #ddd", color: "#444", fontSize: 12 };
  const thStyle = { padding: "8px 10px", background: C.teal, color: "white", textAlign: "left", fontWeight: 600, fontSize: 11 };

  return (
    <div style={{ padding: 28, overflow: "auto", height: "calc(100vh - 60px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ color: C.cream, fontSize: 22, fontWeight: 700, fontFamily: FONT }}>Business Requirements Document</h2>
        <button onClick={handleExport} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 20px",
          background: `linear-gradient(135deg, ${C.crimson}, ${C.crimsonLight})`,
          border: "none", borderRadius: 6, color: C.cream, fontSize: 13, fontWeight: 600,
          cursor: "pointer", fontFamily: FONT, boxShadow: `0 4px 16px ${C.crimson}44`,
        }}>
          <Download size={16} /> Export .doc
        </button>
      </div>

      {/* Document Control */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>1. Document Control</h2>
        <table style={{ borderCollapse: "collapse", fontSize: 13 }}>
          <tbody>
            {[
              ["Title", `${state.process.name} — Business Requirements Document`],
              ["Version", state.process.version],
              ["Date", today],
              ["Author", state.process.author],
              ["Status", state.process.status],
            ].map(([label, val]) => (
              <tr key={label}>
                <td style={{ padding: "4px 16px 4px 0", fontWeight: 600, color: C.teal, width: 150 }}>{label}</td>
                <td style={{ padding: "4px 0", color: "#333" }}>{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Executive Summary */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>2. Executive Summary</h2>
        <p style={pStyle}>
          This document defines the business requirements for the <strong>{state.process.name}</strong> process.
          The process comprises {metrics.totalSteps} operational steps executed by {metrics.roles.length} distinct roles,
          with {metrics.decisions} decision points and {metrics.handoffs} inter-role handoffs.
        </p>
        <p style={pStyle}>
          The critical path spans {metrics.criticalPath.length} steps with an estimated duration of {Math.round(metrics.criticalPathDuration)} hours.
          The process complexity index is {metrics.complexityIndex}/10, and {metrics.automationPotential}% of steps have been identified as automation candidates.
          The overall process health score is {health.overall}/100.
        </p>
      </div>

      {/* Stakeholders */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>4. Stakeholders & Roles</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr><th style={thStyle}>Role</th><th style={thStyle}>Steps Owned</th><th style={thStyle}>Workload</th></tr></thead>
          <tbody>
            {metrics.roles.map(r => (
              <tr key={r}>
                <td style={tdStyle}>{r}</td>
                <td style={tdStyle}>{metrics.roleWorkload[r] || 0}</td>
                <td style={tdStyle}>{Math.round(((metrics.roleWorkload[r] || 0) / Math.max(metrics.totalSteps, 1)) * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Process Overview */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>5. Process Overview</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["#", "Step", "Role", "Type", "Duration", "Risk"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
          <tbody>
            {processSteps.map((s, i) => (
              <tr key={s.id}>
                <td style={tdStyle}>{i + 1}</td>
                <td style={{ ...tdStyle, fontWeight: 500 }}>{s.name}</td>
                <td style={tdStyle}>{s.role}</td>
                <td style={tdStyle}>{s.type}</td>
                <td style={tdStyle}>{s.duration} {s.durationUnit}</td>
                <td style={tdStyle}><span style={{ color: RISK_COLORS[s.risk], fontWeight: 600 }}>{s.risk.toUpperCase()}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detailed Flow */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>6. Detailed Process Flow</h2>
        {processSteps.map((s, i) => (
          <div key={s.id} style={{ marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #eee" }}>
            <h3 style={h3Style}>6.{i + 1} {s.name}</h3>
            <p style={{ ...pStyle, fontSize: 12 }}>
              <strong>Owner:</strong> {s.role} | <strong>Type:</strong> {s.type} | <strong>Duration:</strong> {s.duration} {s.durationUnit} | <strong>Risk:</strong> <span style={{ color: RISK_COLORS[s.risk] }}>{s.risk}</span>
            </p>
            <p style={pStyle}>{s.description}</p>
            <p style={{ ...pStyle, fontSize: 12 }}><strong>Inputs:</strong> {s.inputs.join(", ") || "N/A"}</p>
            <p style={{ ...pStyle, fontSize: 12 }}><strong>Outputs:</strong> {s.outputs.join(", ") || "N/A"}</p>
            {s.type === "decision" && <p style={{ ...pStyle, fontSize: 12 }}><strong>Decision Outcomes:</strong> {s.outcomes.join(" / ")}</p>}
          </div>
        ))}
      </div>

      {/* RACI */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>8. RACI Matrix</h2>
        <div style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Step</th>
                {raci.roles.map(r => <th key={r} style={thStyle}>{r}</th>)}
              </tr>
            </thead>
            <tbody>
              {raci.matrix.map(row => (
                <tr key={row.step.id}>
                  <td style={tdStyle}>{row.step.name}</td>
                  {raci.roles.map(r => {
                    const v = row.assignments[r];
                    return <td key={r} style={{ ...tdStyle, textAlign: "center", fontWeight: 700, color: raciColorMap[v] || "#ccc" }}>{v || "–"}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Metrics */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>10. Process Metrics</h2>
        <table style={{ borderCollapse: "collapse", fontSize: 13 }}>
          <tbody>
            {[
              ["Total Steps", metrics.totalSteps],
              ["Roles Involved", metrics.roles.length],
              ["Decision Points", metrics.decisions],
              ["Critical Path Duration", `${Math.round(metrics.criticalPathDuration)} hours`],
              ["Complexity Index", `${metrics.complexityIndex} / 10`],
              ["Automation Potential", `${metrics.automationPotential}%`],
              ["Health Score", `${health.overall} / 100`],
            ].map(([label, val]) => (
              <tr key={label}>
                <td style={{ padding: "4px 16px 4px 0", fontWeight: 600, color: C.teal, width: 180 }}>{label}</td>
                <td style={{ padding: "4px 0", color: "#333" }}>{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sign-off */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>14. Approval Sign-off</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Role", "Name", "Signature", "Date"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
          <tbody>
            {metrics.roles.slice(0, 4).map(r => (
              <tr key={r}>
                <td style={tdStyle}>{r}</td>
                <td style={{ ...tdStyle, minWidth: 120 }}></td>
                <td style={{ ...tdStyle, minWidth: 120 }}></td>
                <td style={{ ...tdStyle, minWidth: 100 }}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: "center", padding: 20 }}>
        <span style={{ color: C.creamFaint, fontSize: 11, fontFamily: FONT }}>Generated by ProcessForge — Cherrystone Consulting — {today}</span>
      </div>
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN APPLICATION
   ═══════════════════════════════════════════════════════════════════════════ */

export default function ProcessForge() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const selectedStep = useMemo(() => {
    if (!state.ui.selectedStepId) return null;
    return state.steps.find(s => s.id === state.ui.selectedStepId) || null;
  }, [state.ui.selectedStepId, state.steps]);

  const handleCloseDetail = useCallback(() => {
    dispatch({ type: "SET_UI", payload: { selectedStepId: null, showDetailPanel: false } });
  }, [dispatch]);

  useEffect(() => {
    if (state.ui.toast) {
      const timer = setTimeout(() => dispatch({ type: "CLEAR_TOAST" }), 3500);
      return () => clearTimeout(timer);
    }
  }, [state.ui.toast]);

  const handleDismissToast = useCallback(() => {
    dispatch({ type: "CLEAR_TOAST" });
  }, [dispatch]);

  return (
    <div style={{
      display: "flex", height: "100vh", overflow: "hidden",
      background: C.navy, fontFamily: FONT, color: C.cream,
    }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: ${C.navy}; }
        ::-webkit-scrollbar-thumb { background: ${C.teal}44; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: ${C.teal}88; }
        ::selection { background: ${C.crimson}44; }
        input::placeholder, textarea::placeholder { color: ${C.creamFaint}; }
        select { appearance: none; }
        option { background: ${C.navy}; color: ${C.cream}; }
      `}</style>

      <Toast toast={state.ui.toast} onDismiss={handleDismissToast} />
      <Sidebar state={state} dispatch={dispatch} />

      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflow: "auto" }}>
          {state.ui.activePage === "input" && <InputPage state={state} dispatch={dispatch} />}
          {state.ui.activePage === "visualization" && <VisualizationPage state={state} dispatch={dispatch} />}
          {state.ui.activePage === "analysis" && <AnalysisDashboard state={state} dispatch={dispatch} />}
          {state.ui.activePage === "brd" && <BRDGenerator state={state} />}
        </div>
      </main>

      {state.ui.showDetailPanel && selectedStep && (
        <StepDetailPanel step={selectedStep} dispatch={dispatch} onClose={handleCloseDetail} />
      )}
    </div>
  );
}
