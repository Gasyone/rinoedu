const fs = require('fs');
const content = fs.readFileSync('swagger-ui-init.js', 'utf8');
const regex = /"(\/api\/v1\/[^"]+)"/g;
let match;
const urls = new Set();
while ((match = regex.exec(content)) !== null) {
    const url = match[1];
    if (url.includes('auth') || url.includes('login') || url.includes('pass') || url.includes('reg')) {
        urls.add(url);
    }
}
console.log([...urls].join('\n'));
