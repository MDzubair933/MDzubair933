const fs = require('fs');
const path = require('path');

const stackDir = path.join(__dirname);
if (!fs.existsSync(stackDir)) {
  fs.mkdirSync(stackDir, { recursive: true });
}

// Convert hex to rgb
function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return { r, g, b };
}

// Generate subtle dark tinted bg and matching border
function getTint(hex) {
  const { r, g, b } = hexToRgb(hex);
  // Blend with base dark charcoal #121418
  const bgR = Math.round(18 + r * 0.08);
  const bgG = Math.round(20 + g * 0.08);
  const bgB = Math.round(24 + b * 0.08);
  const bg = `rgb(${bgR}, ${bgG}, ${bgB})`;

  const brR = Math.round(35 + r * 0.28);
  const brG = Math.round(38 + g * 0.28);
  const brB = Math.round(44 + b * 0.28);
  const border = `rgb(${brR}, ${brG}, ${brB})`;

  return { bg, border };
}

// Function to generate natural-width chip SVG (Height 36px, radius 6px)
function createChipSvg({ file, label, iconSvg, accent, text = '#F4F4F5' }) {
  const { bg, border } = getTint(accent);
  const charWidth = 7.7;
  const textWidth = label.length * charWidth;
  const width = Math.round(Math.max(textWidth + 50, 90));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="36" viewBox="0 0 ${width} 36" fill="none">
  <!-- Subtle Tinted Background & 1.2px Border -->
  <rect width="${width}" height="36" rx="6" fill="${bg}" stroke="${border}" stroke-width="1.2" />
  <!-- Brand Icon (x=13, y=9) -->
  <g transform="translate(13, 9)">
    ${iconSvg}
  </g>
  <!-- Clean High-Contrast Typography -->
  <text x="38" y="22.5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', Roboto, sans-serif" font-size="12.5" font-weight="600" letter-spacing="0.3" fill="${text}">${label}</text>
</svg>`;

  fs.writeFileSync(path.join(stackDir, file), svg);
}

// ----------------------------------------------------
// CRISP SVG VECTOR ICONS
// ----------------------------------------------------
const icons = {
  // Generic Tech Tag
  codeTag: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  cpu: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>`,
  database: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
  bot: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4M8 16h.01M16 16h.01"/></svg>`,
  cloud: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
  shield: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,

  // Web Engineering
  nextjs: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#000" stroke="${c}" stroke-width="1.4"/><path d="M15.5 15.5L8.5 7.5V16.5" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/><path d="M15.5 7.5V12.5" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  react: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.5"><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="2" fill="${c}"/></svg>`,
  typescript: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="${c}"/><path d="M4 8H12M8 8V18" stroke="#FFF" stroke-width="2" stroke-linecap="round"/><path d="M14 15.5C14.5 17 16 18 18 18C19.5 18 20.5 17 20.5 15.5C20.5 13.5 14 14.5 14 11C14 9.5 15.5 8 17.5 8C19 8 20.5 9 20.5 10.5" stroke="#FFF" stroke-width="2" stroke-linecap="round"/></svg>`,
  javascript: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="${c}"/><path d="M6 13V16.5C6 17.5 7 18 8 18C9 18 9.5 17.5 9.5 16.5V11" stroke="#000" stroke-width="2" stroke-linecap="round"/><path d="M14 16C14.5 17.5 16 18 17.5 18C19 18 20 17 20 15.5C20 13.5 14 14.5 14 11C14 9.5 15.5 8 17.5 8C19 8 20 9 20 10.5" stroke="#000" stroke-width="2" stroke-linecap="round"/></svg>`,
  vite: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21.5 4.5L12.5 21L2.5 4.5L14 3L21.5 4.5Z" stroke="${c}" stroke-width="2"/><path d="M12.5 3L8 12H13.5L11 19L18 8.5H13L15 3H12.5Z" fill="${c}"/></svg>`,
  tailwind: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"/></svg>`,
  shadcn: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"><line x1="4" y1="20" x2="20" y2="4"/><polyline points="4 4 20 4 20 20"/></svg>`,
  aceternity: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="12"/><line x1="2" y1="8.5" x2="12" y2="12"/><line x1="22" y1="8.5" x2="12" y2="12"/></svg>`,
  radix: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><circle cx="6" cy="6" r="3"/><path d="M12 3h6v6h-6z"/><path d="M12 15a6 6 0 0 1 6 6h-6z"/></svg>`,
  gsap: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.5a4.5 4.5 0 0 1-4.5-4.5A4.5 4.5 0 0 1 13 7.5a4.4 4.4 0 0 1 3.2 1.4l-1.4 1.4A2.4 2.4 0 0 0 13 9.5a2.5 2.5 0 0 0-2.5 2.5A2.5 2.5 0 0 0 13 14.5a2.4 2.4 0 0 0 1.8-.8v-1.2H13v-2h3.8v4a4.4 4.4 0 0 1-3.8 2z"/></svg>`,
  framer: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z"/></svg>`,
  tanstack: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
  zustand: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><circle cx="12" cy="12" r="8"/><path d="M9 10h6l-6 4h6"/></svg>`,

  // AI Systems
  openai: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.98 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494z"/></svg>`,
  claude: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><path d="M4.5 12a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0zm7.5-5.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z"/></svg>`,
  gemini: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.627 12 12 0-6.373 5.373-12 12-12-6.627 0-12-5.373-12-12z"/></svg>`,
  langgraph: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><line x1="8.5" y1="7" x2="15.5" y2="7"/><line x1="7.5" y1="8.5" x2="10.5" y2="15.5"/><line x1="16.5" y1="8.5" x2="13.5" y2="15.5"/></svg>`,
  langchain: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  crewai: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  vector: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  llamaindex: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  apify: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><circle cx="12" cy="12" r="10"/></svg>`,
  firecrawl: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  pinecone: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><path d="M12 2L4 7v10l8 5 8-5V7l-8-5z"/><line x1="12" y1="22" x2="12" y2="12"/><line x1="4" y1="7" x2="12" y2="12"/><line x1="20" y1="7" x2="12" y2="12"/></svg>`,

  // Automation & Agents
  n8n: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"><circle cx="5" cy="6" r="3"/><circle cx="19" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><path d="M5 9v3a3 3 0 0 0 3 3h4M19 9v3a3 3 0 0 1-3 3h-4"/></svg>`,
  zapier: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  make: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  mcp: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 12h8M12 8v8"/></svg>`,
  webhook: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  extension: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><path d="M4 8V4h4v1a3 3 0 0 0 6 0V4h4v4h-1a3 3 0 0 0 0 6h1v4h-4v-1a3 3 0 0 0-6 0v1H4v-4h1a3 3 0 0 0 0-6H4z"/></svg>`,

  // Conversational AI
  vapi: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8"/></svg>`,
  elevenlabs: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><path d="M2 10v4M6 6v12M10 3v18M14 8v8M18 5v14M22 10v4"/></svg>`,
  retell: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  livekit: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
  botpress: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><circle cx="12" cy="12" r="9"/></svg>`,
  voiceflow: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>`,

  // Backend & Data
  nodejs: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><path d="M12 2L2 7.8v11.5L12 25l10-5.7V7.8L12 2zm-1 18.5l-6-3.4v-6.9l6 3.4v6.9zm2 0v-6.9l6-3.4v6.9l-6 3.4zm6-11.5l-6 3.4-6-3.4 6-3.5 6 3.5z"/></svg>`,
  express: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><text x="2" y="16" font-family="sans-serif" font-size="14" font-weight="bold" fill="${c}">ex</text></svg>`,
  python: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><path d="M11.91 0c-3.1 0-5.09.28-5.09.28s-3.08.34-3.08 3.08v2.32h8.28v1.16H3.63S0 7.28 0 12c0 4.6 3.2 4.7 3.2 4.7h1.93v-2.73s-.1-3.27 3.23-3.27h5.53s3.1.05 3.1-3.04V3.36S17.44 0 11.91 0zm-2.82 1.83a.95.95 0 1 1 0 1.9.95.95 0 0 1 0-1.9zm3 22.17c3.1 0 5.09-.28 5.09-.28s3.08-.34 3.08-3.08v-2.32H11.9v-1.16h8.39s3.63-.44 3.63-5.16c0-4.6-3.2-4.7-3.2-4.7h-1.93v2.73s.1 3.27-3.23 3.27H10.05s-3.1-.05-3.1 3.04v4.3s-.45 3.36 5.08 3.36zm2.82-1.83a.95.95 0 1 1 0-1.9.95.95 0 0 1 0 1.9z"/></svg>`,
  fastapi: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  cpp: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M10 9a3 3 0 0 0-3 3 3 3 0 0 0 3 3M14 12h4M16 10v4"/></svg>`,
  supabase: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L.648 13.914a.792.792 0 0 0 .618 1.282H12v8.958a.396.396 0 0 0 .716.233l10.636-13.751a.792.792 0 0 0-.618-1.282z"/></svg>`,
  postgresql: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-2.5 0-4.5-2-4.5-4.5S10.5 7.5 13 7.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5z"/></svg>`,
  mongodb: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><path d="M12 0s-7.5 6.5-7.5 13.5c0 5 3.5 9 7.5 10.5 4-1.5 7.5-5.5 7.5-10.5C19.5 6.5 12 0 12 0zm0 21.5c-3-1.5-5.5-4.5-5.5-8 0-4.5 5.5-10 5.5-10s5.5 5.5 5.5 10c0 3.5-2.5 6.5-5.5 8z"/></svg>`,
  redis: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polygon points="2 12 12 17 22 12 12 7 2 12"/><polygon points="2 17 12 22 22 17 12 12 2 17"/></svg>`,
  prisma: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><polygon points="12 2 2 19 22 19 12 2"/></svg>`,
  zod: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 9h6l-6 6h6"/></svg>`,
  pydantic: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><polygon points="12 2 22 20 2 20 12 2"/></svg>`,

  // Deployment & Infrastructure
  antigravity: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3" fill="${c}"/><line x1="12" y1="1" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="1" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="23" y2="12"/></svg>`,
  git: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><path d="M21.7 10.3l-8-8c-.4-.4-1-.4-1.4 0l-1.9 1.9 2.5 2.5c.4-.1.8 0 1.1.3.4.4.4 1 0 1.4L11.5 11v5.2c.3.1.6.4.7.8.3.8-.1 1.7-.9 2-.8.3-1.7-.1-2-.9-.3-.8.1-1.7.9-2v-5.2c-.3-.1-.6-.4-.7-.8-.2-.5 0-1.1.4-1.5L7.4 6.1 2.3 11.2c-.4.4-.4 1 0 1.4l8 8c.4.4 1 .4 1.4 0l10-10c.4-.4.4-1 0-1.4z"/></svg>`,
  github: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`,
  docker: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><path d="M2.5 13.5c.2 3.8 3.5 6.5 7.5 6.5 5 0 8.5-3 9.5-8 .5 0 2-.2 2.5-1.5-.5-.5-1.5-.8-2.5-.5 0-.5-.5-2-2-2.5-1.5-.5-2.5.5-2.5.5V7h-3v3H9V7H6v3H3v3.5h-.5z"/></svg>`,
  actions: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>`,
  vercel: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><path d="M12 1L24 22H0L12 1Z"/></svg>`,
  netlify: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><polygon points="12 2 2 12 12 22 22 12 12 2"/></svg>`,
  cloudflare: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>`,
  aws: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><path d="M6.5 17.5c4 2.5 8.5 2.5 11 0M18 17.5l2-1M6.5 17.5l-2-1M12 3v8M8 7l4-4 4 4"/></svg>`,
  langsmith: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>`,
  phoenix: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><path d="M12 2c-4 4-8 8-8 13 0 4.4 3.6 8 8 8s8-3.6 8-8c0-5-4-9-8-13z"/></svg>`
};

// ----------------------------------------------------
// COMPLETE BADGE DEFINITIONS
// ----------------------------------------------------
const badges = [
  // 1. WEB ENGINEERING
  { file: 'chip_nextjs.svg', label: 'Next.js', accent: '#E5E7EB', icon: icons.nextjs },
  { file: 'chip_react.svg', label: 'React', accent: '#61DAFB', icon: icons.react },
  { file: 'chip_typescript.svg', label: 'TypeScript', accent: '#3178C6', icon: icons.typescript },
  { file: 'chip_javascript.svg', label: 'JavaScript', accent: '#F7DF1E', icon: icons.javascript },
  { file: 'chip_zustand.svg', label: 'Zustand', accent: '#B08968', icon: icons.zustand },
  { file: 'chip_vite.svg', label: 'Vite', accent: '#8B5CF6', icon: icons.vite },
  { file: 'chip_tailwind.svg', label: 'Tailwind CSS', accent: '#38BDF8', icon: icons.tailwind },
  { file: 'chip_shadcn.svg', label: 'shadcn/ui', accent: '#A3A3A3', icon: icons.shadcn },
  { file: 'chip_aceternity.svg', label: 'Aceternity UI', accent: '#A78BFA', icon: icons.aceternity },
  { file: 'chip_radix.svg', label: 'Radix UI', accent: '#C084FC', icon: icons.radix },
  { file: 'chip_gsap.svg', label: 'GSAP', accent: '#88CE02', icon: icons.gsap },
  { file: 'chip_framer_motion.svg', label: 'Framer Motion', accent: '#FF4D8D', icon: icons.framer },
  { file: 'chip_tanstack.svg', label: 'TanStack Query', accent: '#FF4154', icon: icons.tanstack },

  // 2. AI SYSTEMS (ChromaDB placed in the middle of line 1 for optimal row balance)
  { file: 'chip_openai.svg', label: 'OpenAI', accent: '#10A37F', icon: icons.openai },
  { file: 'chip_claude.svg', label: 'Claude', accent: '#D97757', icon: icons.claude },
  { file: 'chip_gemini.svg', label: 'Gemini', accent: '#8AB4F8', icon: icons.gemini },
  { file: 'chip_chromadb.svg', label: 'ChromaDB', accent: '#EC4899', icon: icons.database },
  { file: 'chip_langgraph.svg', label: 'LangGraph', accent: '#7C3AED', icon: icons.langgraph },
  { file: 'chip_langchain.svg', label: 'LangChain', accent: '#14B8A6', icon: icons.langchain },
  { file: 'chip_crewai.svg', label: 'CrewAI', accent: '#F97316', icon: icons.crewai },
  { file: 'chip_data_vectorization.svg', label: 'Data Vectorization', accent: '#22C55E', icon: icons.vector },
  { file: 'chip_llamaindex.svg', label: 'LlamaIndex', accent: '#F59E0B', icon: icons.llamaindex },
  { file: 'chip_apify.svg', label: 'Apify', accent: '#EF4444', icon: icons.apify },
  { file: 'chip_firecrawl.svg', label: 'Firecrawl', accent: '#FB7185', icon: icons.firecrawl },
  { file: 'chip_pgvector.svg', label: 'pgvector', accent: '#6366F1', icon: icons.database },
  { file: 'chip_pinecone.svg', label: 'Pinecone', accent: '#16A34A', icon: icons.pinecone },

  // 3. AUTOMATION & AGENTS
  { file: 'chip_n8n.svg', label: 'n8n', accent: '#EA4B71', icon: icons.n8n },
  { file: 'chip_zapier.svg', label: 'Zapier', accent: '#FF4F00', icon: icons.zapier },
  { file: 'chip_make.svg', label: 'Make', accent: '#7B61FF', icon: icons.make },
  { file: 'chip_mcp.svg', label: 'MCP', accent: '#06B6D4', icon: icons.mcp },
  { file: 'chip_webhooks.svg', label: 'Webhooks', accent: '#FACC15', icon: icons.webhook },
  { file: 'chip_custom_browser_ext.svg', label: 'Custom Browser Extensions', accent: '#4285F4', icon: icons.extension },

  // 4. CONVERSATIONAL AI (with Retell AI and LiveKit)
  { file: 'chip_vapi.svg', label: 'Vapi', accent: '#A855F7', icon: icons.vapi },
  { file: 'chip_elevenlabs.svg', label: 'ElevenLabs', accent: '#FFFFFF', icon: icons.elevenlabs },
  { file: 'chip_retell_ai.svg', label: 'Retell AI', accent: '#5B21B6', icon: icons.retell },
  { file: 'chip_livekit.svg', label: 'LiveKit', accent: '#00F5D4', icon: icons.livekit },
  { file: 'chip_botpress.svg', label: 'Botpress', accent: '#3B82F6', icon: icons.botpress },
  { file: 'chip_voiceflow.svg', label: 'Voiceflow', accent: '#7C5CFC', icon: icons.voiceflow },

  // 5. BACKEND & DATA
  { file: 'chip_nodejs.svg', label: 'Node.js', accent: '#68A063', icon: icons.nodejs },
  { file: 'chip_express.svg', label: 'Express', accent: '#9CA3AF', icon: icons.express },
  { file: 'chip_python.svg', label: 'Python', accent: '#3776AB', icon: icons.python },
  { file: 'chip_fastapi.svg', label: 'FastAPI', accent: '#009688', icon: icons.fastapi },
  { file: 'chip_cpp.svg', label: 'C/C++', accent: '#659AD2', icon: icons.cpp },
  { file: 'chip_supabase.svg', label: 'Supabase', accent: '#3ECF8E', icon: icons.supabase },
  { file: 'chip_postgresql.svg', label: 'PostgreSQL', accent: '#336791', icon: icons.postgresql },
  { file: 'chip_mongodb.svg', label: 'MongoDB', accent: '#47A248', icon: icons.mongodb },
  { file: 'chip_redis.svg', label: 'Redis', accent: '#DC382D', icon: icons.redis },
  { file: 'chip_prisma.svg', label: 'Prisma ORM', accent: '#5A67D8', icon: icons.prisma },
  { file: 'chip_zod.svg', label: 'Zod Validation', accent: '#3E67B1', icon: icons.zod },
  { file: 'chip_pydantic.svg', label: 'Pydantic', accent: '#E92063', icon: icons.pydantic },

  // 6. DEPLOYMENT & INFRASTRUCTURE
  { file: 'chip_antigravity_ide.svg', label: 'Antigravity IDE', accent: '#D4A574', icon: icons.antigravity },
  { file: 'chip_git.svg', label: 'Git', accent: '#F05032', icon: icons.git },
  { file: 'chip_github.svg', label: 'GitHub', accent: '#C9D1D9', icon: icons.github },
  { file: 'chip_docker.svg', label: 'Docker', accent: '#2496ED', icon: icons.docker },
  { file: 'chip_github_actions.svg', label: 'GitHub Actions', accent: '#2088FF', icon: icons.actions },
  { file: 'chip_vercel.svg', label: 'Vercel', accent: '#E5E7EB', icon: icons.vercel },
  { file: 'chip_netlify.svg', label: 'Netlify', accent: '#00C7B7', icon: icons.netlify },
  { file: 'chip_cloudflare.svg', label: 'Cloudflare', accent: '#F48120', icon: icons.cloudflare },
  { file: 'chip_aws.svg', label: 'AWS', accent: '#FF9900', icon: icons.aws },
  { file: 'chip_langsmith.svg', label: 'LangSmith', accent: '#22C55E', icon: icons.langsmith },
  { file: 'chip_phoenix.svg', label: 'Phoenix', accent: '#FF6B35', icon: icons.phoenix }
];

console.log(`Generating all ${badges.length} premium technology badges...`);
badges.forEach(b => {
  createChipSvg({
    file: b.file,
    label: b.label,
    accent: b.accent,
    iconSvg: b.icon(b.accent)
  });
});

console.log(`Successfully generated all ${badges.length} badges in ${stackDir}!`);
