const fs = require('fs');
const content = fs.readFileSync('swagger-ui-init.js', 'utf8');
const pathsMatch = content.match(/"paths":\s*(\{[\s\S]*?\}),\s*"components"/);
if (pathsMatch) {
    const pathsStr = pathsMatch[1];
    const regex = /"(\/api\/[^"]+)"/g;
    let match;
    const urls = new Set();
    while ((match = regex.exec(pathsStr)) !== null) {
        if (match[1].includes('auth') || match[1].includes('login') || match[1].includes('reg') || match[1].includes('password')) {
            urls.add(match[1]);
        }
    }
    console.log(Array.from(urls).join('\n'));
} else {
    console.log("No match found for paths block.");
}
