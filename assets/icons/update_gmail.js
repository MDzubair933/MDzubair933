const fs = require('fs');
const path = require('path');

const srcGmail = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\c392ecc3-fb8c-4134-ba95-3760602500e3\\.user_uploaded\\media_1788079907525.png';
const gmailBuf = fs.readFileSync(srcGmail);
const gmailB64 = gmailBuf.toString('base64');

// Generate official_gmail.svg containing the user's exact uploaded Gmail logo on a clean circular disc
const gmailSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <circle cx="64" cy="64" r="64" fill="#FAFAF9"/>
  <image href="data:image/png;base64,${gmailB64}" x="14" y="14" width="100" height="100" preserveAspectRatio="xMidYMid meet" />
</svg>`;

fs.writeFileSync(path.join(__dirname, 'official_gmail.svg'), gmailSvg);
console.log('Successfully updated official_gmail.svg with user uploaded logo!');
