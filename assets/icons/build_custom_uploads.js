const fs = require('fs');
const path = require('path');

// 1. Official LinkedIn Circular Logo (exact matching the user's uploaded circular LinkedIn image)
const linkedinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <!-- Solid Official Circular Blue Badge -->
  <circle cx="64" cy="64" r="64" fill="#0077B5"/>
  <!-- Crisp Centered White 'in' Logo -->
  <path fill="#FFFFFF" d="M47.5 89H35.8V51.7h11.7V89zm-5.9-42.5c-3.7 0-6.8-3.1-6.8-6.8s3.1-6.8 6.8-6.8 6.8 3.1 6.8 6.8-3.1 6.8-6.8 6.8zm53.4 42.5H83.3V69.3c0-4.7-.1-10.7-6.5-10.7-6.5 0-7.5 5.1-7.5 10.4V89H57.6V51.7h11.2v5.1h.2c1.6-3 5.4-6.2 11.2-6.2 12 0 14.2 7.9 14.2 18.2V89z"/>
</svg>`;
fs.writeFileSync(path.join(__dirname, 'official_linkedin_circ.svg'), linkedinSvg);

// 2. Official Gmail Icon (using clean pure vector of the exact modern Google Workspace M logo fitted perfectly inside the circle)
const gmailSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <!-- Clean Off-White Disc Container -->
  <circle cx="64" cy="64" r="64" fill="#FAFAF9"/>
  <!-- Exact Modern Google Workspace Gmail M Logo -->
  <g transform="translate(24, 28) scale(0.625)">
    <!-- Left Blue Pillar -->
    <path fill="#4285F4" d="M26 128h-6c-11 0-20-9-20-20V34l26 19.5V128z"/>
    <!-- Right Green Pillar -->
    <path fill="#34A853" d="M102 128h6c11 0 20-9 20-20V34L102 53.5V128z"/>
    <!-- Center Red Chevron -->
    <path fill="#EA4335" d="M102 34l-38 28.5L26 34V14.5c0-14.2 16.3-22.1 27.5-13.7L64 9.1l10.5-8.3C85.7-7.6 102 .3 102 14.5V34z"/>
    <!-- Top Left Red Shadow Overlay -->
    <path fill="#C5221F" d="M0 34l26 19.5V14.5L0 34z" opacity="0.4"/>
    <!-- Top Right Yellow Shoulder -->
    <path fill="#FBBC04" d="M102 14.5v39L128 34V14.5c0-14.2-16.3-22.1-27.5-13.7l1.5 1.2V14.5z"/>
  </g>
</svg>`;
fs.writeFileSync(path.join(__dirname, 'official_gmail_circle.svg'), gmailSvg);

console.log('Successfully generated official_linkedin_circ.svg and official_gmail_circle.svg!');
