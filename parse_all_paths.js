const fs = require('fs');
const content = fs.readFileSync('swagger-ui-init.js', 'utf8');
const optionsMatch = content.match(/let options = (\{[\s\S]*?\});\n  url = options/);

if (optionsMatch) {
    let optionsStr = optionsMatch[1];
    try {
        const options = eval('(' + optionsStr + ')');
        const paths = Object.keys(options.swaggerDoc.paths);

        // Let's find any path that might be related to users or auth
        const userOrAuthPaths = paths.filter(p => p.toLowerCase().includes('user') || p.toLowerCase().includes('auth') || p.toLowerCase().includes('log') || p.toLowerCase().includes('sign'));

        fs.writeFileSync('swagger_paths_list.txt', userOrAuthPaths.join('\n'));
        console.log("Wrote " + userOrAuthPaths.length + " paths to swagger_paths_list.txt");
    } catch (e) {
        console.log("Error:", e);
    }
} else {
    console.log("Could not find options");
}
