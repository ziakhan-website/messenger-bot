```js
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('Bot chal raha hai'));
app.listen(process.env.PORT || 3000);

const genAI = new GoogleGenerativeAI('TUMHARI_GEMINI_API_KEY_YAHAN');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('QR scan karo WhatsApp se');
});

client.on('ready', () => {
    console.log('Bot ready ho gaya!');
});

client.on('message', async msg => {
    if (msg.fromMe) return;
    
    await new Promise(r => setTimeout(r, 2000));
    
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(
            `Tum friendly WhatsApp assistant ho. Short Roman Urdu reply do. User: ${msg.body}`
        );
        await msg.reply(result.response.text());
    } catch (err) {
        await msg.reply('Abhi error hai, dobara try karo');
    }
});

client.initialize();
```
