const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;

const CLIENT_KEY = 'sbawz3s6ovvz0rm40u';
const CLIENT_SECRET = 'OqTaIO7tGzvF93evV29K9mfC7wZ2KZu1';
const REDIRECT_URI = 'https://tektok-oyqt.onrender.com';

app.get('/', async (req, res) => {
    const authCode = req.query.code;
    
    if (!authCode) {
        return res.status(400).send('No authorization code provided by TikTok.');
    }

    try {
        const response = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', new URLSearchParams({
            client_key: CLIENT_KEY,
            client_secret: CLIENT_SECRET,
            code: authCode,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URI
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const token = response.data.access_token || (response.data.data && response.data.data.access_token);

        if (!token) {
            const responseDataString = JSON.stringify(response.data, null, 2);
            return res.send(`<h1>TikTok Response Structure:</h1><pre>${responseDataString}</pre>`);
        }

        // إعادة توجيه المستخدم تلقائياً لتطبيق الأندرويد مع إرسال الـ Token والـ Open ID
        const openId = response.data.open_id || (response.data.data && response.data.data.open_id) || '';
        const deepLinkUrl = `com.nejm.tiktok://oauth?access_token=${token}&open_id=${openId}`;

        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Redirecting...</title>
                <meta http-equiv="refresh" content="0;url=${deepLinkUrl}">
            </head>
            <body style="font-family: Arial; text-align: center; padding-top: 50px;">
                <h2>✅ تم تسجيل الدخول بنجاح!</h2>
                <p>جاري تحويلك إلى تطبيق نجم الإبداع...</p>
                <p><a href="${deepLinkUrl}">اضغط هنا إذا لم يتم تحويلك تلقائياً</a></p>
            </body>
            </html>
        `);

    } catch (error) {
        const errorDetails = error.response ? JSON.stringify(error.response.data, null, 2) : error.message;
        res.status(500).send(`<h1>TikTok API Error</h1><pre>${errorDetails}</pre>`);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
