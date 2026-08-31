const fs = require('fs');
const path = require('path');

// 1. Copy the real website favicon PNG directly to official_website.png
const srcFavicon = path.join(__dirname, 'favicon.png');
const dstFavicon = path.join(__dirname, 'official_website.png');
fs.copyFileSync(srcFavicon, dstFavicon);
console.log('Saved official_website.png from real site favicon');

// 2. Official LinkedIn Favicon (Full Circular Official Asset)
const linkedinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <circle cx="64" cy="64" r="64" fill="#0A66C2"/>
  <path fill="#FFFFFF" d="M47 88H36V53h11v35zm-5.5-39.8c-3.5 0-6.3-2.8-6.3-6.3 0-3.5 2.8-6.3 6.3-6.3 3.5 0 6.3 2.8 6.3 6.3 0 3.5-2.8 6.3-6.3 6.3zM92 88H81V69.5c0-4.4-.1-10-6.1-10-6.1 0-7 4.8-7 9.7V88H57V53h10.5v4.8h.2c1.5-2.8 5.1-5.8 10.5-5.8 11.2 0 13.3 7.4 13.3 17V88z"/>
</svg>`;
fs.writeFileSync(path.join(__dirname, 'official_linkedin.svg'), linkedinSvg);

// 3. Official GitHub Favicon (Full Circular Official Asset)
const githubSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <circle cx="64" cy="64" r="64" fill="#181717"/>
  <path fill="#FFFFFF" fill-rule="evenodd" clip-rule="evenodd" d="M64 24C41.9 24 24 41.9 24 64c0 17.7 11.5 32.7 27.4 38 2 .4 2.7-.9 2.7-1.9v-7.5c-11.1 2.4-13.5-2.7-13.5-2.7-1.8-4.6-4.4-5.9-4.4-5.9-3.6-2.5.3-2.4.3-2.4 4 .3 6.1 4.1 6.1 4.1 3.6 6.1 9.4 4.3 11.7 3.3.4-2.6 1.4-4.3 2.6-5.3-8.9-1-18.2-4.4-18.2-19.8 0-4.4 1.6-8 4.1-10.8-.4-1-.18-5.1.4-10.6 0 0 3.4-1.1 11 4.1 3.2-.9 6.6-1.3 10-1.3s6.8.4 10 1.3c7.6-5.2 11-4.1 11-4.1 2.2 5.5 0.8 9.6.4 10.6 2.6 2.8 4.1 6.4 4.1 10.8 0 15.4-9.4 18.7-18.3 19.7 1.4 1.2 2.7 3.7 2.7 7.5v11.1c0 1.1.7 2.3 2.8 1.9C92.5 96.7 104 81.7 104 64c0-22.1-17.9-40-40-40z"/>
</svg>`;
fs.writeFileSync(path.join(__dirname, 'official_github.svg'), githubSvg);

// 4. Official X Favicon (Full Circular Official Asset)
const xSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <circle cx="64" cy="64" r="64" fill="#000000"/>
  <g transform="translate(36, 36)">
    <path fill="#FFFFFF" d="M44.4 3h8.8L34 25.1 57 55.4H39.3L25.4 37.3 9.6 55.4H.8l20.5-23.4L0 3h18.1l12.5 16.5L44.4 3zm-3.1 47.1h4.9L16 7.9h-5.2l30.5 42.2z"/>
  </g>
</svg>`;
fs.writeFileSync(path.join(__dirname, 'official_x.svg'), xSvg);

// 5. Official Gmail Favicon (Full Circular Official Asset)
const gmailSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <circle cx="64" cy="64" r="64" fill="#1C1917" stroke="#292524" stroke-width="2"/>
  <g transform="translate(31, 35) scale(2.2)">
    <path fill="#4285F4" d="M2.5 27h5V13.8L0 8v16.5C0 26 1.1 27 2.5 27z"/>
    <path fill="#34A853" d="M22.5 27h5c1.4 0 2.5-1 2.5-2.5V8l-7.5 5.8V27z"/>
    <path fill="#EA4335" d="M22.5 13.8V4.2c0-1.9-2.2-2.9-3.7-1.7L15 5.5 11.2 2.5C9.7 1.3 7.5 2.3 7.5 4.2v9.6L15 19.5l7.5-5.7z"/>
    <path fill="#FBBC05" d="M0 8l7.5 5.8V4.2c0-1.9 2.2-2.9 3.7-1.7L15 5.5 0 8z" opacity="0.9"/>
    <path fill="#C5221F" d="M30 8l-7.5 5.8V4.2c0-1.9-2.2-2.9-3.7-1.7L15 5.5 30 8z" opacity="0.9"/>
  </g>
</svg>`;
fs.writeFileSync(path.join(__dirname, 'official_gmail.svg'), gmailSvg);

console.log('All 5 official circular favicon assets created successfully!');
