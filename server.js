const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;

// بيانات تطبيق تيك توك الخاصة بك
const CLIENT_KEY = 'sbawz3s6ovvz0rm40u';
const CLIENT_SECRET = 'OqTaIO7tGzvF93evV29K9mfC7wZ2KZu1';

// الرابط الجديد والصحيح لسيرفر راندر الخاص بك
const REDIRECT_URI = 'https://tektok-oyqt.onrender.com';

app.get('/', async (req, res) => {
    const authCode = req.query.code;
    
    if (!authCode) {
        return res.status(400).send('No authorization code provided by TikTok.');
    }

    try {
        // الخطوة الأهم: تبديل الـ code بـ access_token باستخدام الـ Client Secret في السيرفر بأمان
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

        const accessToken = response.data.data.access_token;
        
        // إرسال التوكن مباشرة للعميل أو عرضه مؤقتاً لتتأكد منه
        res.send(`<h1>Success!</h1><p>Access Token: ${accessToken}</p>`);

    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send('Failed to exchange token with TikTok.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
