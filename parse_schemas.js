const fs = require('fs');
const content = fs.readFileSync('swagger-ui-init.js', 'utf8');
const optionsMatch = content.match(/let options = (\{[\s\S]*?\});\n  url = options/);

if (optionsMatch) {
    let optionsStr = optionsMatch[1];
    try {
        const options = eval('(' + optionsStr + ')');
        const schemas = options.swaggerDoc.components.schemas;
        const result = {
            AuthRequestDto: schemas.AuthRequestDto,
            AuthResponseDto: schemas.AuthResponseDto,
            RegisterRequest: null,
            ForgotPasswordRequest: null
        };

        // Find other schema keys that might be related to register/password
        const schemaKeys = Object.keys(schemas);
        const relatedKeys = schemaKeys.filter(k => k.toLowerCase().includes('register') || k.toLowerCase().includes('password') || k.toLowerCase().includes('forgot') || k.toLowerCase().includes('otp') || k.toLowerCase().includes('verify'));

        for (const k of relatedKeys) {
            result[k] = schemas[k];
        }

        // Also look for paths
        const paths = Object.keys(options.swaggerDoc.paths);
        const relatedPaths = paths.filter(p => !p.includes('users/auth') && (p.toLowerCase().includes('password') || p.toLowerCase().includes('forgot') || p.toLowerCase().includes('otp') || p.toLowerCase().includes('verify') || p.toLowerCase().includes('register') || p.toLowerCase().includes('send')));

        result.RelatedPaths = {};
        for (const p of relatedPaths) {
            result.RelatedPaths[p] = options.swaggerDoc.paths[p];
        }

        fs.writeFileSync('swagger_auth_schemas.json', JSON.stringify(result, null, 2));
        console.log("Wrote schemas to swagger_auth_schemas.json");
    } catch (e) {
        console.log("Error:", e);
    }
} else {
    console.log("Could not find options");
}
