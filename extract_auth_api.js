const https = require('https');

https.get('https://auth-dev.gasy.one/api/docs-json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const doc = JSON.parse(data);
            const pathsToExtract = [
                '/auth/register',
                '/auth/login',
                '/auth/refresh-token',
                '/auth/app/forgot-password/send-code',
                '/auth/app/forgot-password/verify-code',
                '/auth/app/forgot-password/reset'
            ];

            const result = {};
            for (const p of pathsToExtract) {
                result[p] = doc.paths[p];
            }

            console.log(JSON.stringify(result, null, 2));
        } catch (e) {
            console.log("Error parsing");
        }
    });
});
