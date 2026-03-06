const https = require('https');

https.get('https://auth-dev.gasy.one/api/docs-json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const doc = JSON.parse(data);
            const components = doc.components.schemas;

            const schemasToExtract = [
                'RegisterParamsDto',
                'SendForgotPasswordCodeDto',
                'VerifyForgotPasswordCodeDto',
                'ResetPasswordWithTokenDto'
            ];

            const result = {};
            for (const s of schemasToExtract) {
                result[s] = components[s];
            }

            console.log(JSON.stringify(result, null, 2));
        } catch (e) {
            console.log("Error parsing");
        }
    });
});
