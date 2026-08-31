const fs = require('fs');
const path = require('path');

const faviconPath = path.join(__dirname, 'favicon.png');
const pngBuf = fs.readFileSync(faviconPath);
const b64 = pngBuf.toString('base64');

// 1. Website Favicon: Full circular badge with exact zubairsystems logo cropped past gold ring
const websiteSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54" fill="none">
  <defs>
    <clipPath id="favCircle">
      <circle cx="27" cy="27" r="26" />
    </clipPath>
  </defs>
  <!-- Clean dark container -->
  <circle cx="27" cy="27" r="26" fill="#1C1917" stroke="#292524" stroke-width="1.5" />
  <!-- Scaled website favicon image with outer gold ring cropped out -->
  <image href="data:image/png;base64,${b64}" x="0" y="0" width="54" height="54" clip-path="url(#favCircle)" preserveAspectRatio="xMidYMid slice" />
</svg>`;
fs.writeFileSync(path.join(__dirname, 'website.svg'), websiteSvg);

// 2. LinkedIn Favicon: Solid official LinkedIn blue circle with white 'in'
const linkedinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54" fill="none">
  <!-- Official LinkedIn Blue Circular Favicon -->
  <circle cx="27" cy="27" r="26" fill="#0A66C2" />
  <g transform="translate(15, 14.5) scale(1.05)">
    <path fill="#FFFFFF" d="M5.5 24.5H.5V9.2h5v15.3zM3 7.1C1.3 7.1 0 5.8 0 4.1 0 2.5 1.3 1.1 3 1.1s3 1.3 3 3c0 1.6-1.3 3-3 3zm21.5 17.4h-5v-7.8c0-1.9 0-4.3-2.6-4.3-2.6 0-3 2-3 4.1v8h-5V9.2h4.8v2.1h.1c.7-1.3 2.3-2.6 4.7-2.6 5.1 0 6 3.3 6 7.7v8.1z"/>
  </g>
</svg>`;
fs.writeFileSync(path.join(__dirname, 'linkedin.svg'), linkedinSvg);

// 3. GitHub Favicon: Solid official GitHub dark circle with white Invertocat
const githubSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54" fill="none">
  <!-- Official GitHub Circular Favicon -->
  <circle cx="27" cy="27" r="26" fill="#24292F" />
  <g transform="translate(13.5, 13.5)">
    <path fill="#FFFFFF" fill-rule="evenodd" clip-rule="evenodd" d="M13.5 0C6.04 0 0 6.04 0 13.5c0 5.97 3.87 11.03 9.24 12.82.68.12.92-.29.92-.65 0-.32-.01-1.38-.02-2.52-3.76.82-4.55-.91-4.55-.91-.61-1.56-1.5-1.98-1.5-1.98-1.23-.84.09-.82.09-.82 1.36.1 2.07 1.39 2.07 1.39 1.21 2.07 3.16 1.47 3.93 1.13.12-.88.48-1.47.86-1.81-3-.34-6.16-1.5-6.16-6.68 0-1.48.53-2.68 1.39-3.63-.14-.34-.6-1.72.13-3.58 0 0 1.13-.36 3.72 1.39 1.08-.3 2.24-.45 3.39-.45 1.15 0 2.31.15 3.39.45 2.58-1.75 3.71-1.39 3.71-1.39.74 1.86.28 3.24.14 3.58.87.95 1.39 2.15 1.39 3.63 0 5.19-3.17 6.33-6.18 6.67.49.42.92 1.25.92 2.52 0 1.82-.02 3.28-.02 3.73 0 .37.24.78.93.65C23.14 24.52 27 19.46 27 13.5 27 6.04 20.96 0 13.5 0z"/>
  </g>
</svg>`;
fs.writeFileSync(path.join(__dirname, 'github.svg'), githubSvg);

// 4. X Favicon: Solid official X black circle with crisp white X
const xSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54" fill="none">
  <!-- Official X Black Circular Favicon -->
  <circle cx="27" cy="27" r="26" fill="#000000" stroke="#292524" stroke-width="1.5" />
  <g transform="translate(16, 16)">
    <path fill="#FFFFFF" d="M17.1 1h3.38L13.1 9.43 22 21h-6.8l-5.32-6.96L3.8 21H.4l7.9-9.03L0 1h6.98l4.82 6.37L17.1 1zm-1.19 18.2h1.87L6.18 2.92H4.18l11.73 16.28z"/>
  </g>
</svg>`;
fs.writeFileSync(path.join(__dirname, 'x.svg'), xSvg);

// 5. Gmail Favicon: Official Google Gmail 4-Color icon inside clean circle
const emailSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54" fill="none">
  <!-- Official Gmail Circular Favicon -->
  <circle cx="27" cy="27" r="26" fill="#1C1917" stroke="#292524" stroke-width="1.5" />
  <g transform="translate(13.5, 14.5) scale(0.9)">
    <path fill="#4285F4" d="M2.5 27h5V13.8L0 8v16.5C0 26 1.1 27 2.5 27z"/>
    <path fill="#34A853" d="M22.5 27h5c1.4 0 2.5-1 2.5-2.5V8l-7.5 5.8V27z"/>
    <path fill="#EA4335" d="M22.5 13.8V4.2c0-1.9-2.2-2.9-3.7-1.7L15 5.5 11.2 2.5C9.7 1.3 7.5 2.3 7.5 4.2v9.6L15 19.5l7.5-5.7z"/>
    <path fill="#FBBC05" d="M0 8l7.5 5.8V4.2c0-1.9 2.2-2.9 3.7-1.7L15 5.5 0 8z" opacity="0.9"/>
    <path fill="#C5221F" d="M30 8l-7.5 5.8V4.2c0-1.9-2.2-2.9-3.7-1.7L15 5.5 30 8z" opacity="0.9"/>
  </g>
</svg>`;
fs.writeFileSync(path.join(__dirname, 'email.svg'), emailSvg);

console.log('Successfully generated full circular official favicons!');
