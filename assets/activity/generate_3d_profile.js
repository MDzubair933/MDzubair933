const https = require('https');
const fs = require('fs');
const path = require('path');

const USERNAME = 'MDzubair933';
const outputDir = path.join(__dirname);

function fetchText(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const reqHeaders = {
      'User-Agent': 'Mozilla/5.0 (Node.js/Antigravity)',
      ...headers
    };
    https.get(url, { headers: reqHeaders }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function fetchJson(url, token) {
  return new Promise((resolve, reject) => {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Node.js/Antigravity)'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

const GITHUB_LANG_COLORS = {
  'TypeScript': '#3178C6',
  'Python': '#3572A5',
  'JavaScript': '#F7DF1E',
  'C++': '#F34B7D',
  'C': '#555555',
  'HTML': '#E34F26',
  'CSS': '#1572B6',
  'Shell': '#89E051',
  'Dockerfile': '#384D54',
  'Batchfile': '#C1F12E',
  'Markdown': '#083FA1',
  'YAML': '#CB171E',
  'Jupyter Notebook': '#DA5B0B',
  'SQL': '#e38c00',
  'PLpgSQL': '#336791',
  'PostgreSQL': '#336791',
  'JSON': '#292929',
  'TOML': '#9c4221'
};

async function fetchAllUserRepos(token) {
  const allRepos = [];
  let page = 1;
  while (true) {
    const url = token
      ? `https://api.github.com/user/repos?type=all&per_page=100&page=${page}`
      : `https://api.github.com/users/${USERNAME}/repos?per_page=100&page=${page}`;
    const batch = await fetchJson(url, token);
    if (!Array.isArray(batch) || batch.length === 0) break;
    allRepos.push(...batch);
    if (batch.length < 100) break;
    page++;
  }
  return allRepos;
}

// 1. Fetch Real Language Data Directly From GitHub API
async function fetchRealLanguagesFromGitHub() {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  console.log('Fetching live languages from GitHub API... Token present:', !!token);

  const repos = await fetchAllUserRepos(token);
  if (!Array.isArray(repos)) return [];
  console.log(`  Total Repositories Fetched Across All Pages: ${repos.length}`);

  const langMap = {};
  let totalBytes = 0;

  for (const repo of repos) {
    if (repo.fork) continue;
    const languages = await fetchJson(repo.languages_url, token);
    // Guard: skip if API returned an error (rate limit, auth error, etc.)
    if (!languages || typeof languages !== 'object' || languages.message || Array.isArray(languages)) {
      continue;
    }
    for (let [lang, bytes] of Object.entries(languages)) {
      // Only process entries where bytes is a real number
      if (typeof bytes !== 'number' || bytes <= 0) continue;
      if (lang === 'Jupyter Notebook') {
        lang = 'Python'; // Map Jupyter notebook code to Python
      }
      langMap[lang] = (langMap[lang] || 0) + bytes;
      totalBytes += bytes;
    }
  }

  if (totalBytes === 0) return [];

  const sorted = Object.entries(langMap)
    .map(([name, bytes]) => ({
      name,
      bytes,
      color: GITHUB_LANG_COLORS[name] || '#8B949E',
      pct: bytes / totalBytes,
      pctFormatted: `${((bytes / totalBytes) * 100).toFixed(1)}%`
    }))
    .sort((a, b) => b.bytes - a.bytes);

  return sorted;
}

// 2. Fetch Rolling 1-Year Contributions Directly From GitHub Profile
async function getOneYearContributionsFromGitHub() {
  console.log(`Scraping exact rolling 1-year contributions directly from GitHub for ${USERNAME}...`);
  const url = `https://github.com/users/${USERNAME}/contributions`;
  const html = await fetchText(url);

  const headingMatch = html.match(/([0-9,]+)\s+contributions/i);
  const oneYearCount = headingMatch ? parseInt(headingMatch[1].replace(/,/g, ''), 10) : 0;

  const grid = Array.from({ length: 53 }, () => Array(7).fill(0));
  const tipRegex = /<tool-tip[^>]*for="contribution-day-component-([^"]+)"[^>]*>([^<]+)<\/tool-tip>/g;
  let match;

  while ((match = tipRegex.exec(html)) !== null) {
    const coord = match[1];
    const text = match[2].trim();
    const countMatch = text.match(/^([0-9]+)\s+contribution/i);
    const count = countMatch ? parseInt(countMatch[1], 10) : 0;

    const parts = coord.split('-').map(Number);
    if (parts.length === 2) {
      const row = parts[0];
      const col = parts[1];
      if (col < 53 && row < 7) {
        grid[col][row] = count;
      }
    }
  }

  return {
    grid,
    oneYearCount
  };
}

// 3. Fetch Real Lifetime Contributions & Streaks Directly From GitHub Profile
async function getLifetimeContributionsFromGitHub() {
  console.log(`Aggregating true lifetime contribution history directly from GitHub for ${USERNAME}...`);
  const currentYear = new Date().getFullYear();
  let totalLifetimeCount = 0;

  // Step 1: Get lifetime TOTAL by summing year-specific page headings
  for (let y = 2024; y <= currentYear; y++) {
    try {
      const url = `https://github.com/users/${USERNAME}/contributions?from=${y}-01-01&to=${y}-12-31`;
      const html = await fetchText(url);
      const headingMatch = html.match(/([0-9,]+)\s+contributions/i);
      const yearTotal = headingMatch ? parseInt(headingMatch[1].replace(/,/g, ''), 10) : 0;
      totalLifetimeCount += yearTotal;
      console.log(`  Year ${y}: ${yearTotal} contributions`);
    } catch (err) {
      console.warn(`Could not scrape year ${y}:`, err.message);
    }
  }

  // Step 2: Use the DEFAULT page (rolling 1-year, no future months) for STREAK calculations
  const defaultUrl = `https://github.com/users/${USERNAME}/contributions`;
  const defaultHtml = await fetchText(defaultUrl);

  const tipRegex = /<tool-tip[^>]*for="contribution-day-component-([^"]+)"[^>]*>([^<]+)<\/tool-tip>/g;
  let match;
  const dayEntries = [];
  while ((match = tipRegex.exec(defaultHtml)) !== null) {
    const coord = match[1];
    const text = match[2].trim();
    const countMatch = text.match(/^([0-9]+)\s+contribution/i);
    const count = countMatch ? parseInt(countMatch[1], 10) : 0;

    const parts = coord.split('-').map(Number);
    if (parts.length === 2) {
      const row = parts[0]; // day of week
      const col = parts[1]; // week number (oldest=0, newest=max)
      dayEntries.push({ col, row, count });
    }
  }

  // Sort chronologically: by column (week) first, then by row (day of week)
  dayEntries.sort((a, b) => {
    if (a.col !== b.col) return a.col - b.col;
    return a.row - b.row;
  });

  const allDays = dayEntries.map(e => e.count);
  console.log(`  Streak data: ${allDays.length} days, Non-zero: ${allDays.filter(c => c > 0).length}`);

  // Calculate LONGEST streak from chronologically sorted data
  let longestStreak = 0;
  let tempStreak = 0;
  for (const count of allDays) {
    if (count > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  }

  // Calculate CURRENT streak from the end (most recent day backward)
  let currentStreak = 0;
  for (let i = allDays.length - 1; i >= 0; i--) {
    if (allDays[i] > 0) {
      currentStreak++;
    } else if (i === allDays.length - 1) {
      // If the very last day (today) has 0, skip it and check yesterday
      continue;
    } else {
      break;
    }
  }

  console.log(`  Lifetime Total: ${totalLifetimeCount}, Current Streak: ${currentStreak}, Longest Streak: ${longestStreak}`);

  return {
    totalLifetimeCount,
    currentStreak: `${currentStreak} Days`,
    longestStreak: `${longestStreak} Days`
  };
}

function generateStatsCardSvg(num, label) {
  const formattedNum = typeof num === 'number' ? num.toLocaleString() : num;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="108" viewBox="0 0 160 108" fill="none">
  <style>
    * { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif; }
  </style>
  <rect width="160" height="108" rx="8" fill="#0C0A09" stroke="#1C1917" stroke-width="1.2" />
  <text x="80" y="50" text-anchor="middle" font-size="28" font-weight="700" fill="#E8D5B7">${formattedNum}</text>
  <text x="80" y="78" text-anchor="middle" font-size="13" font-weight="500" fill="#8B95A3">${label}</text>
</svg>`;
}

function generateStatsRowSvg(total, current, repoCount) {
  const formattedTotal = typeof total === 'number' ? total.toLocaleString() : total;
  const formattedRepo = typeof repoCount === 'number' ? repoCount.toLocaleString() : repoCount;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="750" height="110" viewBox="0 0 750 110" fill="none">
  <style>
    * { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif; }
  </style>

  <!-- Card 1: Lifetime Total -->
  <g transform="translate(0, 0)">
    <rect width="234" height="108" rx="10" fill="#0C0A09" stroke="#1C1917" stroke-width="1.2" />
    <text x="117" y="50" text-anchor="middle" font-size="28" font-weight="700" fill="#E8D5B7">${formattedTotal}</text>
    <text x="117" y="78" text-anchor="middle" font-size="13" font-weight="500" fill="#8B95A3">Lifetime Total</text>
  </g>

  <!-- Card 2: Current Streak -->
  <g transform="translate(258, 0)">
    <rect width="234" height="108" rx="10" fill="#0C0A09" stroke="#1C1917" stroke-width="1.2" />
    <text x="117" y="50" text-anchor="middle" font-size="28" font-weight="700" fill="#E8D5B7">${current}</text>
    <text x="117" y="78" text-anchor="middle" font-size="13" font-weight="500" fill="#8B95A3">Current Streak</text>
  </g>

  <!-- Card 3: Total Repositories (Public + Private) -->
  <g transform="translate(516, 0)">
    <rect width="234" height="108" rx="10" fill="#0C0A09" stroke="#1C1917" stroke-width="1.2" />
    <text x="117" y="50" text-anchor="middle" font-size="28" font-weight="700" fill="#E8D5B7">${formattedRepo}</text>
    <text x="117" y="78" text-anchor="middle" font-size="13" font-weight="500" fill="#8B95A3">Total Repositories</text>
  </g>
</svg>`;
}

function generateComposite3DSvg(grid, oneYearCount, activityStats) {
  const width = 1280;
  const height = 850;

  let gridSvg = '';
  for (let col = 0; col < 53; col++) {
    for (let row = 0; row < 7; row++) {
      const count = grid[col][row];
      const baseX = 120 + (col - row) * 19.5;
      const baseY = 145 + (col + row) * 11.2;

      const h = count === 0 ? 2.6 : 6.5 + count * 0.8;
      const elevY = (h - 2.6) * 1.15;
      const posY = baseY - elevY;

      const hue = Math.round((col / 53) * 360);
      const topCol = count === 0 ? `hsl(${hue}, 35%, 18%)` : `hsl(${hue}, 85%, 48%)`;
      const leftCol = count === 0 ? `hsl(${hue}, 35%, 14%)` : `hsl(${hue}, 85%, 38%)`;
      const rightCol = count === 0 ? `hsl(${hue}, 35%, 11%)` : `hsl(${hue}, 85%, 30%)`;

      gridSvg += `\n    <g transform="translate(${baseX.toFixed(2)} ${posY.toFixed(2)})">
      <rect stroke="none" x="0" y="0" width="18" height="18" transform="skewY(-30) skewX(40.89) scale(1 1.15)" fill="${topCol}" />
      <rect stroke="none" x="0" y="0" width="18" height="${h.toFixed(2)}" transform="skewY(30) scale(1 1.15)" fill="${leftCol}" />
      <rect stroke="none" x="0" y="0" width="18" height="${h.toFixed(2)}" transform="translate(18 10.39) skewY(-30) scale(1 1.15)" fill="${rightCol}" />
    </g>`;
    }
  }

  // Radar scale: 6 rings → 1, 10, 100, 1K, 10K, 100K
  // Unit = 26px per log level, max radius = 26 * 6 = 156px
  const RING = 26;
  const getRadarRadius = (val) => {
    const v = Math.max(1, val);
    const logVal = Math.log10(v);
    const r = RING * (1 + Math.min(logVal, 5));  // cap at 10^5 = 100K
    return Math.min(Math.max(r, 22), RING * 6);
  };

  // ALL radar values from live GitHub data — zero hardcoded numbers
  const rCommit = getRadarRadius(oneYearCount);
  const rIssue = getRadarRadius(activityStats.issueCount);
  const rPR = getRadarRadius(activityStats.prCount);
  const rReview = getRadarRadius(activityStats.reviewCount);
  const rRepo = getRadarRadius(activityStats.repoCount);

  const radarPoints = `0,${(-rCommit).toFixed(1)} ${(rIssue * 0.951).toFixed(1)},${(-rIssue * 0.309).toFixed(1)} ${(rPR * 0.588).toFixed(1)},${(rPR * 0.809).toFixed(1)} ${(-rReview * 0.588).toFixed(1)},${(rReview * 0.809).toFixed(1)} ${(-rRepo * 0.951).toFixed(1)},${(-rRepo * 0.309).toFixed(1)}`;

  // Helper: generate pentagon points at a given radius
  const pent = (r) => `0,${(-r).toFixed(1)} ${(r*0.951).toFixed(1)},${(-r*0.309).toFixed(1)} ${(r*0.588).toFixed(1)},${(r*0.809).toFixed(1)} ${(-r*0.588).toFixed(1)},${(r*0.809).toFixed(1)} ${(-r*0.951).toFixed(1)},${(-r*0.309).toFixed(1)}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <style>
    * { font-family: "Ubuntu", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica", "Arial", sans-serif; }
  </style>

  <rect x="0" y="0" width="${width}" height="${height}" fill="#00000f" />

  <g>
    ${gridSvg}
  </g>

  <g transform="translate(960, 240)">
    <polygon points="${pent(RING*1)}" style="fill: none; stroke: #444455; stroke-width: 1px;" />
    <polygon points="${pent(RING*2)}" style="fill: none; stroke: #444455; stroke-width: 1px;" />
    <polygon points="${pent(RING*3)}" style="fill: none; stroke: #444455; stroke-width: 1px;" />
    <polygon points="${pent(RING*4)}" style="fill: none; stroke: #444455; stroke-width: 1px;" />
    <polygon points="${pent(RING*5)}" style="fill: none; stroke: #444455; stroke-width: 1px;" />
    <polygon points="${pent(RING*6)}" style="fill: none; stroke: #555566; stroke-width: 1px;" />

    <text style="font-size: 12px;" text-anchor="start" x="3" y="${-RING*1}" fill="#aaaaaa">1</text>
    <text style="font-size: 12px;" text-anchor="start" x="3" y="${-RING*2}" fill="#aaaaaa">10</text>
    <text style="font-size: 12px;" text-anchor="start" x="3" y="${-RING*3}" fill="#aaaaaa">100</text>
    <text style="font-size: 12px;" text-anchor="start" x="3" y="${-RING*4}" fill="#aaaaaa">1K</text>
    <text style="font-size: 12px;" text-anchor="start" x="3" y="${-RING*5}" fill="#aaaaaa">10K</text>
    <text style="font-size: 12px;" text-anchor="start" x="3" y="${-RING*6}" fill="#aaaaaa">100K</text>

    <g class="axis">
      <line x1="0" y1="${-RING}" x2="0" y2="${-RING*6}" style="stroke: #aaaaaa; stroke-dasharray: 4 4; stroke-width: 1px;" />
      <text style="font-size: 20px; font-weight: 600;" text-anchor="middle" dominant-baseline="middle" x="0" y="${-RING*6 - 26}" fill="#eeeeff">Commit</text>
    </g>
    <g class="axis">
      <line x1="${(RING*0.951).toFixed(1)}" y1="${(-RING*0.309).toFixed(1)}" x2="${(RING*6*0.951).toFixed(1)}" y2="${(-RING*6*0.309).toFixed(1)}" style="stroke: #aaaaaa; stroke-dasharray: 4 4; stroke-width: 1px;" />
      <text style="font-size: 20px; font-weight: 600;" text-anchor="middle" dominant-baseline="middle" x="${(RING*6*0.951 + 40).toFixed(0)}" y="${(-RING*6*0.309 - 10).toFixed(0)}" fill="#eeeeff">Issue</text>
    </g>
    <g class="axis">
      <line x1="${(RING*0.588).toFixed(1)}" y1="${(RING*0.809).toFixed(1)}" x2="${(RING*6*0.588).toFixed(1)}" y2="${(RING*6*0.809).toFixed(1)}" style="stroke: #aaaaaa; stroke-dasharray: 4 4; stroke-width: 1px;" />
      <text style="font-size: 20px; font-weight: 600;" text-anchor="middle" dominant-baseline="middle" x="${(RING*6*0.588 + 25).toFixed(0)}" y="${(RING*6*0.809 + 22).toFixed(0)}" fill="#eeeeff">PullReq</text>
    </g>
    <g class="axis">
      <line x1="${(-RING*0.588).toFixed(1)}" y1="${(RING*0.809).toFixed(1)}" x2="${(-RING*6*0.588).toFixed(1)}" y2="${(RING*6*0.809).toFixed(1)}" style="stroke: #aaaaaa; stroke-dasharray: 4 4; stroke-width: 1px;" />
      <text style="font-size: 20px; font-weight: 600;" text-anchor="middle" dominant-baseline="middle" x="${(-RING*6*0.588 - 25).toFixed(0)}" y="${(RING*6*0.809 + 22).toFixed(0)}" fill="#eeeeff">Review</text>
    </g>
    <g class="axis">
      <line x1="${(-RING*0.951).toFixed(1)}" y1="${(-RING*0.309).toFixed(1)}" x2="${(-RING*6*0.951).toFixed(1)}" y2="${(-RING*6*0.309).toFixed(1)}" style="stroke: #aaaaaa; stroke-dasharray: 4 4; stroke-width: 1px;" />
      <text style="font-size: 20px; font-weight: 600;" text-anchor="middle" dominant-baseline="middle" x="${(-RING*6*0.951 - 40).toFixed(0)}" y="${(-RING*6*0.309 - 10).toFixed(0)}" fill="#eeeeff">Repo</text>
    </g>

    <polygon style="stroke-width: 4px; stroke: rgb(255,200,55); fill: rgb(255,200,55); fill-opacity: 0.45;" points="${radarPoints}">
      <animate attributeName="points" values="0,-24 23,-7 14,20 -14,20 -23,-7;${radarPoints}" dur="2.5s" repeatCount="1" />
    </polygon>
  </g>

  <g transform="translate(640, 815)">
    <text text-anchor="middle">
      <tspan fill="rgb(255,200,55)" font-size="34px" font-weight="800">${oneYearCount.toLocaleString()}</tspan>
      <tspan fill="#eeeeff" font-size="24px" font-weight="500">  contributions in the past 365 days</tspan>
    </text>
  </g>

  <text style="font-size: 16px; font-weight: 500;" x="1240" y="28" dominant-baseline="hanging" text-anchor="end" fill="#888899">${USERNAME}</text>
</svg>`;
}

// Generate Dedicated Languages & Systems Distribution Card (1280 x 350 px)
function generateLanguagesDistributionSvg(languages) {
  const width = 1280;
  const height = 350;

  const bgFill = '#0C0A09';
  const borderStroke = '#1C1917';
  const textPrimary = '#F4F4F5';

  // No hardcoded fallback — only show real data from GitHub
  const displayLangs = languages;

  // Dynamic Multi-Column Clean High-Contrast Typographic Legend
  let itemsSvg = '';
  const numLangs = displayLangs.length;
  const numCols = numLangs > 8 ? 3 : 2;
  const colWidth = numCols === 3 ? 285 : 400;
  const rowHeight = 52;

  displayLangs.forEach((lang, i) => {
    const col = i % numCols;
    const row = Math.floor(i / numCols);
    const x = col * colWidth;
    const y = row * rowHeight;

    itemsSvg += `\n    <g transform="translate(${x}, ${y})">
      <circle cx="9" cy="17" r="7" fill="${lang.color}" />
      <text x="28" y="23" font-size="17.5" font-weight="700" fill="#FFFFFF">${lang.name} <tspan fill="${lang.color}" font-size="16.5" font-weight="800">(${lang.pctFormatted})</tspan></text>
    </g>`;
  });

  let currentAngle = -Math.PI / 2;
  const rOut = 125;
  const rIn = 72;
  let donutPaths = '';

  displayLangs.forEach((lang) => {
    const sliceAngle = Math.max(lang.pct, 0.005) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;

    const x1Out = rOut * Math.cos(startAngle);
    const y1Out = rOut * Math.sin(startAngle);
    const x2Out = rOut * Math.cos(endAngle);
    const y2Out = rOut * Math.sin(endAngle);

    const x1In = rIn * Math.cos(startAngle);
    const y1In = rIn * Math.sin(startAngle);
    const x2In = rIn * Math.cos(endAngle);
    const y2In = rIn * Math.sin(endAngle);

    const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0;
    const d = `M ${x1Out} ${y1Out} A ${rOut} ${rOut} 0 ${largeArc} 1 ${x2Out} ${y2Out} L ${x2In} ${y2In} A ${rIn} ${rIn} 0 ${largeArc} 0 ${x1In} ${y1In} Z`;

    donutPaths += `\n        <path d="${d}" fill="${lang.color}" stroke="${bgFill}" stroke-width="2.5px">
          <title>${lang.name}: ${lang.pctFormatted}</title>
        </path>`;
  });

  const cardHeight = Math.max(360, 130 + Math.ceil(numLangs / numCols) * rowHeight);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${cardHeight}" viewBox="0 0 ${width} ${cardHeight}" fill="none">
  <style>
    * { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif; }
  </style>

  <rect width="${width}" height="${cardHeight}" rx="14" fill="${bgFill}" stroke="${borderStroke}" stroke-width="1.5" />

  <g transform="translate(50, 48)">
    <text font-size="25" font-weight="800" fill="${textPrimary}" letter-spacing="-0.3px">Most Used Languages &amp; Codebase Distribution</text>
  </g>

  <!-- Donut Chart (Left Side, Bigger & Bolder) -->
  <g transform="translate(200, ${cardHeight / 2 + 18})">
    ${donutPaths}
  </g>

  <!-- Languages Clean Legend (Right Side, Big Crisp Font) -->
  <g transform="translate(390, 105)">
    ${itemsSvg}
  </g>
</svg>`;
}

// 4. Fetch Real GitHub Activity Stats (Issues, PRs, Reviews, Repos) — ALL from API
async function fetchGitHubActivityStats() {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  console.log('Fetching live activity stats from GitHub API...');

  // Total Repos (Public + Private combined across all pages) via token
  let repoCount = 0;
  const allRepos = await fetchAllUserRepos(token);
  if (Array.isArray(allRepos) && allRepos.length > 0) {
    repoCount = allRepos.length; // Total all public + private repositories matching GitHub profile header
  } else {
    const userInfo = await fetchJson(`https://api.github.com/users/${USERNAME}`, token);
    repoCount = userInfo?.public_repos || 0;
  }

  // Issues created by user (Search API)
  const issuesResult = await fetchJson(`https://api.github.com/search/issues?q=author:${USERNAME}+type:issue&per_page=1`, token);
  const issueCount = (issuesResult && typeof issuesResult.total_count === 'number') ? issuesResult.total_count : 0;

  // PRs created by user (Search API)
  const prsResult = await fetchJson(`https://api.github.com/search/issues?q=author:${USERNAME}+type:pr&per_page=1`, token);
  const prCount = (prsResult && typeof prsResult.total_count === 'number') ? prsResult.total_count : 0;

  // PR reviews by user (Search API)
  const reviewsResult = await fetchJson(`https://api.github.com/search/issues?q=reviewed-by:${USERNAME}+type:pr&per_page=1`, token);
  const reviewCount = (reviewsResult && typeof reviewsResult.total_count === 'number') ? reviewsResult.total_count : 0;

  console.log(`  Repos: ${repoCount}, Issues: ${issueCount}, PRs: ${prCount}, Reviews: ${reviewCount}`);
  return { repoCount, issueCount, prCount, reviewCount };
}

async function main() {
  try {
    // 1. Fetch Rolling 1-Year Contributions Directly From GitHub Profile
    const { grid, oneYearCount } = await getOneYearContributionsFromGitHub();
    console.log(`GitHub 1-Year Live Count: ${oneYearCount}`);

    // 2. Fetch Lifetime Numbers Directly From GitHub Profile
    const { totalLifetimeCount, currentStreak, longestStreak } = await getLifetimeContributionsFromGitHub();
    console.log(`GitHub Lifetime Count: ${totalLifetimeCount}, Streak: ${currentStreak}, Longest: ${longestStreak}`);

    // 3. Fetch Real Languages Directly From GitHub API
    const liveLanguages = await fetchRealLanguagesFromGitHub();
    console.log('GitHub Live Languages:', liveLanguages.map(l => `${l.name}: ${l.pctFormatted}`));

    // 4. Fetch Real Activity Stats (Issues, PRs, Reviews, Repos) From GitHub API
    const activityStats = await fetchGitHubActivityStats();

    // 5. Generate Top Stats Cards (Card 1: Lifetime Total, Card 2: Current Streak, Card 3: Total Repositories)
    fs.writeFileSync(path.join(outputDir, 'stats_cards_row.svg'), generateStatsRowSvg(totalLifetimeCount, currentStreak, activityStats.repoCount));
    fs.writeFileSync(path.join(outputDir, 'stat_total.svg'), generateStatsCardSvg(totalLifetimeCount, 'Lifetime Total'));
    fs.writeFileSync(path.join(outputDir, 'stat_total_v2.svg'), generateStatsCardSvg(totalLifetimeCount, 'Lifetime Total'));
    fs.writeFileSync(path.join(outputDir, 'stat_total_v3.svg'), generateStatsCardSvg(totalLifetimeCount, 'Lifetime Total'));

    fs.writeFileSync(path.join(outputDir, 'stat_current.svg'), generateStatsCardSvg(currentStreak, 'Current Streak'));
    fs.writeFileSync(path.join(outputDir, 'stat_current_v2.svg'), generateStatsCardSvg(currentStreak, 'Current Streak'));
    fs.writeFileSync(path.join(outputDir, 'stat_current_v3.svg'), generateStatsCardSvg(currentStreak, 'Current Streak'));

    fs.writeFileSync(path.join(outputDir, 'stat_longest.svg'), generateStatsCardSvg(activityStats.repoCount, 'Total Repositories'));
    fs.writeFileSync(path.join(outputDir, 'stat_longest_v2.svg'), generateStatsCardSvg(activityStats.repoCount, 'Total Repositories'));
    fs.writeFileSync(path.join(outputDir, 'stat_longest_v3.svg'), generateStatsCardSvg(activityStats.repoCount, 'Total Repositories'));

    // 6. Generate 1-Year 3D Isometric Terrain — with live activity stats for radar
    const composite3DSvg = generateComposite3DSvg(grid, oneYearCount, activityStats);
    fs.writeFileSync(path.join(outputDir, 'profile-3d-contrib.svg'), composite3DSvg);
    fs.writeFileSync(path.join(outputDir, 'profile-3d-contrib_main.svg'), composite3DSvg);
    fs.writeFileSync(path.join(outputDir, 'profile-3d-contrib_full.svg'), composite3DSvg);
    fs.writeFileSync(path.join(outputDir, 'profile-3d-contrib_v2.svg'), composite3DSvg);
    fs.writeFileSync(path.join(outputDir, 'profile-3d-contrib_v3.svg'), composite3DSvg);
    console.log(`Generated pure GitHub 1-year 3D isometric terrain!`);

    // 7. Generate Dedicated Languages Distribution Card
    const langCardSvg = generateLanguagesDistributionSvg(liveLanguages);
    fs.writeFileSync(path.join(outputDir, 'languages_card.svg'), langCardSvg);
    fs.writeFileSync(path.join(outputDir, 'languages_card_v2.svg'), langCardSvg);
    fs.writeFileSync(path.join(outputDir, 'languages_distribution.svg'), langCardSvg);
    fs.writeFileSync(path.join(outputDir, 'most_used_languages.svg'), langCardSvg);
    fs.writeFileSync(path.join(outputDir, 'most_used_languages_v3.svg'), langCardSvg);
    console.log(`Generated pure GitHub live languages distribution!`);

  } catch (err) {
    console.error('Error generating 3D profile contribution SVGs:', err);
  }
}

main();
