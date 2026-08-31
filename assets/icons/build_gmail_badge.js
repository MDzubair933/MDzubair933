const fs = require('fs');
const path = require('path');

const srcGmail = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\c392ecc3-fb8c-4134-ba95-3760602500e3\\.user_uploaded\\media_1788080469657.jpg';
const gmailBuf = fs.readFileSync(srcGmail);
const gmailB64 = gmailBuf.toString('base64');

// Create official_gmail_badge.svg with the user's exact uploaded image clipped to a perfect circle
const gmailSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <defs>
    <clipPath id="circleClip">
      <circle cx="64" cy="64" r="64"/>
    </clipPath>
  </defs>
  <!-- Background circle -->
  <circle cx="64" cy="64" r="64" fill="#FFFFFF"/>
  <!-- User uploaded Gmail image with black corners clipped out -->
  <image href="data:image/jpeg;base64,${gmailB64}" x="0" y="0" width="128" height="128" clip-path="url(#circleClip)" preserveAspectRatio="xMidYMid slice"/>
</svg>`;

fs.writeFileSync(path.join(__dirname, 'official_gmail_badge.svg'), gmailSvg);
console.log('Successfully created official_gmail_badge.svg with user uploaded image!');
