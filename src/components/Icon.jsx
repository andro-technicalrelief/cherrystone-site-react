/**
 * Clean outline icons in a uniform style.
 * Usage: <Icon name="target" size={28} color="white" />
 */
export default function Icon({ name, size = 24, color = 'rgba(255,255,255,0.85)', style = {} }) {
  const s = { width: size, height: size, display: 'inline-block', verticalAlign: 'middle', ...style }
  const props = { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', style: s }

  const icons = {
    // 🎯 Target / Identify Outcomes
    target: (
      <svg {...props}>
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
      </svg>
    ),
    // 🔍 Search / Identify Processes
    search: (
      <svg {...props}>
        <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" />
      </svg>
    ),
    // 📐 Ruler / Establish Measurements
    ruler: (
      <svg {...props}>
        <path d="M21 3L3 21" /><path d="M21 3v7" /><path d="M21 3h-7" />
        <path d="M7 17l-4 4" /><path d="M17 7l4-4" /><path d="M12 12l2-2" /><path d="M9 15l2-2" />
      </svg>
    ),
    // 📊 Chart / Measure Process
    chart: (
      <svg {...props}>
        <rect x="3" y="12" width="4" height="9" rx="1" /><rect x="10" y="7" width="4" height="14" rx="1" /><rect x="17" y="3" width="4" height="18" rx="1" />
      </svg>
    ),
    // ⚙️ Gear / Manage Process
    gear: (
      <svg {...props}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
    // 👤 User / Quantified Process
    user: (
      <svg {...props}>
        <circle cx="12" cy="8" r="4" /><path d="M20 21c0-4.418-3.582-8-8-8s-8 3.582-8 8" />
      </svg>
    ),
    // 👁️ Eye / Visibility
    eye: (
      <svg {...props}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
      </svg>
    ),
    // 📏 Straightedge / Measurement
    straightedge: (
      <svg {...props}>
        <path d="M3 21h18" /><path d="M3 21V7l4-4v18" /><path d="M7 9h2M7 13h2M7 17h2" />
      </svg>
    ),
    // 🔄 Loop / Improvement / Continuous Improvement
    loop: (
      <svg {...props}>
        <path d="M21 12a9 9 0 1 1-6.22-8.56" /><polyline points="21 3 21 9 15 9" />
      </svg>
    ),
    // 🔬 Microscope / Diagnose
    microscope: (
      <svg {...props}>
        <path d="M6 21h12" /><path d="M12 21v-4" /><circle cx="12" cy="7" r="4" /><path d="M12 3V1" /><path d="M8.5 14.5a7 7 0 0 0 7 0" />
      </svg>
    ),
    // 🗺️ Map / Map
    map: (
      <svg {...props}>
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    ),
    // 📈 Trending up / Scale
    trending: (
      <svg {...props}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    // 📋 Clipboard / Document
    clipboard: (
      <svg {...props}>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" />
        <line x1="8" y1="12" x2="16" y2="12" /><line x1="8" y1="16" x2="12" y2="16" />
      </svg>
    ),
    // 🏗️ Building / Process Architecture
    building: (
      <svg {...props}>
        <rect x="4" y="2" width="16" height="20" rx="2" /><line x1="9" y1="7" x2="9" y2="7.01" /><line x1="15" y1="7" x2="15" y2="7.01" />
        <line x1="9" y1="12" x2="9" y2="12.01" /><line x1="15" y1="12" x2="15" y2="12.01" />
        <path d="M9 22v-4h6v4" />
      </svg>
    ),
    // 🗂️ Folder / Knowledge Management
    folder: (
      <svg {...props}>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z" />
        <line x1="9" y1="14" x2="15" y2="14" />
      </svg>
    ),
    // 🔗 Link / Connected Frameworks
    link: (
      <svg {...props}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    // 🛡️ Shield / Built to Last
    shield: (
      <svg {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  }

  return icons[name] || null
}
