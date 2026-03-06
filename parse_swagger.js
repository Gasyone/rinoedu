const fs = require('fs');
const content = fs.readFileSync('swagger-ui-init.js', 'utf8');
const optionsMatch = content.match(/let options = (\{[\s\S]*?\});\n  url = options/);

if (optionsMatch) {
    let optionsStr = optionsMatch[1];
    try {
        const options = eval('(' + optionsStr + ')');
        const paths = options.swaggerDoc.paths;
        const authPaths = Object.keys(paths).filter(p => p.includes('auth') || p.includes('login') || p.includes('register') || p.includes('password'));

        const result = {};
        for (const p of authPaths) {
            result[p] = paths[p];
        }
        fs.writeFileSync('swagger_auth_paths.json', JSON.stringify(result, null, 2));
        console.log("Wrote " + authPaths.length + " paths to swagger_auth_paths.json");
    } catch (e) {
        console.log("Error:", e);
    }
} else {
    console.log("Could not find paths");
}
