const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

// Mpesa credentials
const consumerKey = process.env.CONSUMER_KEY;
const consumerSecret = process.env.CONSUMER_SECRET;

// Token storage
let accessToken = "";

// Get Mpesa access token
async function getAccessToken() {
    const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    try {
        const response = await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
            headers: { Authorization: `Basic ${credentials}` }
        });
        accessToken = response.data.access_token;
    } catch (error) {
        console.error("Error getting access token:", error.message);
    }
}

// Payment endpoint
app.post('/api/payment', async (req, res) => {
    const { phone } = req.body;

    const shortCode = "174379"; // Your business shortcode
    const passKey = "bfb279f9aa9bdbcf158e97dd71a467cd2b7e74f2351c"; // Test passkey
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
    const password = Buffer.from(`${shortCode}${passKey}${timestamp}`).toString('base64');

    const requestPayload = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: 20,
        PartyA: phone,
        PartyB: shortCode,
        PhoneNumber: phone,
        CallBackURL: "https://your-callback-url.com/confirmation",
        AccountReference: "TRYME",
        TransactionDesc: "Betting Payment"
    };

    try {
        const response = await axios.post("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", requestPayload, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        res.json({ success: true, message: "Payment initiated successfully." });
    } catch (error) {
        console.error("Error initiating payment:", error.message);
        res.json({ success: false, message: "Payment failed." });
    }
});

// Start server
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    await getAccessToken();
});
