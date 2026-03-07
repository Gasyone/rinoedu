const fs = require('fs');
const path = require('path');

const wpPath = path.join(__dirname, '..', '..', 'docs', 'architecture', 'whitepaper.md');
const outPath = path.join(__dirname, 'whitepaper.js');

let content = fs.readFileSync(wpPath, 'utf8');

// Escape backticks and dollar signs for template literal
content = content.replace(/`/g, '\\`').replace(/\$/g, '\\$');

const jsContent = `export const WHITEPAPER_CONTENT = \`${content}\`;\n`;

fs.writeFileSync(outPath, jsContent, 'utf8');
console.log('Successfully generated whitepaper.js');
