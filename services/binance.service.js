// =====================================================
// PROJECT: SN DESIGN ENGINE AI
// MODULE: services/binance.service.js
// VERSION: 1.0.0
// STATUS: crypto-production
// LAST FIX: INITIAL BINANCE CRYPTO PAYMENT ENGINE
// =====================================================

const axios = require("axios");
const crypto = require("crypto");

// =====================================================
// ENV CONFIG
// =====================================================

const API_KEY = process.env.BINANCE_API_KEY;
const API_SECRET = process.env.BINANCE_API_SECRET;

// =====================================================
// FIXED CREDIT CONFIG
// =====================================================

const FIX_RATE_THB = 34;      // 1 USD ≈ 34 บาท
const CREDIT_RATE = 200;      // 1 บาท = 200 เครดิต

// =====================================================
// CREDIT CALCULATOR
// =====================================================

function calculateCredits(usd){

    const thb = usd * FIX_RATE_THB;
    const credits = thb * CREDIT_RATE;

    return {
        usd,
        thb,
        credits
    };

}

// =====================================================
// SIGN BINANCE REQUEST
// =====================================================

function signRequest(payload){

    const queryString = Object.keys(payload)
        .map(key => `${key}=${payload[key]}`)
        .join("&");

    const signature = crypto
        .createHmac("sha256", API_SECRET)
        .update(queryString)
        .digest("hex");

    return signature;

}

// =====================================================
// CREATE BINANCE ORDER
// =====================================================

async function createOrder({ userId, usd }){

    if(![10,15,20,25,30,50].includes(usd)){
        throw new Error("INVALID_USD_AMOUNT");
    }

    const creditData = calculateCredits(usd);

    const timestamp = Date.now();

    const payload = {
        merchantTradeNo: "SN-" + timestamp,
        totalFee: usd,
        currency: "USDT",
        timestamp
    };

    const signature = signRequest(payload);

    try{

        const response = await axios.post(
            "https://api.binance.com/api/v3/order",
            payload,
            {
                headers:{
                    "X-MBX-APIKEY": API_KEY
                },
                params:{
                    signature
                }
            }
        );

        return {
            status:"created",
            orderId: payload.merchantTradeNo,
            credits: creditData.credits,
            paymentUrl: response.data
        };

    }catch(err){

        console.error("BINANCE ERROR:",err.response?.data || err.message);

        throw new Error("BINANCE_CREATE_FAILED");

    }

}

// =====================================================
// EXPORT
// =====================================================

module.exports = {
    createOrder,
    calculateCredits
};
