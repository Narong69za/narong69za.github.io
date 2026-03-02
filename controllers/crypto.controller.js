// =====================================================
// PROJECT: SN DESIGN ENGINE AI
// MODULE: controllers/crypto.controller.js
// VERSION: v1.0.0
// STATUS: production
// LAST FIX: Binance Pay create order + webhook handler
// =====================================================

const axios = require("axios");
const crypto = require("crypto");
const creditEngine = require("../services/credit.engine");

// =====================================================
// CONFIG
// =====================================================

const BINANCE_API_KEY = process.env.BINANCE_PAY_KEY;
const BINANCE_SECRET = process.env.BINANCE_PAY_SECRET;

const FIX_RATE_THB = 34;
const CREDIT_RATE = 200;

const ALLOWED_AMOUNTS = [10, 15, 20, 25, 30, 50];
const ALLOWED_COINS = ["USDT", "BNB", "TON"];

// =====================================================
// CREDIT CALCULATOR
// =====================================================

function calculateCredits(usd) {
    return usd * FIX_RATE_THB * CREDIT_RATE;
}

// =====================================================
// SIGN BINANCE PAY REQUEST
// =====================================================

function signPayload(payload, timestamp, nonce) {

    const body = JSON.stringify(payload);
    const preSign = timestamp + "\n" + nonce + "\n" + body + "\n";

    return crypto
        .createHmac("sha512", BINANCE_SECRET)
        .update(preSign)
        .digest("hex")
        .toUpperCase();
}

// =====================================================
// CREATE ORDER
// =====================================================

exports.createOrder = async (req, res) => {

    try {

        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: "UNAUTHORIZED" });
        }

        const { usd, coin } = req.body;

        if (!ALLOWED_AMOUNTS.includes(Number(usd))) {
            return res.status(400).json({ error: "INVALID_AMOUNT" });
        }

        if (!ALLOWED_COINS.includes(coin)) {
            return res.status(400).json({ error: "INVALID_COIN" });
        }

        const credits = calculateCredits(Number(usd));

        const merchantTradeNo = `SN-${userId}-${Date.now()}`;

        const payload = {
            merchantTradeNo,
            orderAmount: usd,
            currency: coin,
            goods: {
                goodsType: "01",
                goodsCategory: "D000",
                referenceGoodsId: "SN_CREDIT",
                goodsName: "SN DESIGN CREDIT"
            }
        };

        const timestamp = Date.now().toString();
        const nonce = crypto.randomBytes(16).toString("hex");

        const signature = signPayload(payload, timestamp, nonce);

        const response = await axios.post(
            "https://bpay.binanceapi.com/binancepay/openapi/v2/order",
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    "BinancePay-Timestamp": timestamp,
                    "BinancePay-Nonce": nonce,
                    "BinancePay-Certificate-SN": BINANCE_API_KEY,
                    "BinancePay-Signature": signature
                }
            }
        );

        return res.json({
            status: "created",
            orderId: merchantTradeNo,
            credits,
            paymentUrl: response.data?.data?.checkoutUrl
        });

    } catch (err) {

        console.error("CREATE ORDER ERROR:", err.response?.data || err.message);
        return res.status(500).json({ error: "CREATE_ORDER_FAILED" });

    }
};

// =====================================================
// WEBHOOK
// =====================================================

exports.webhook = async (req, res) => {

    try {

        const data = JSON.parse(req.body.toString());

        if (data?.bizStatus !== "PAY_SUCCESS") {
            return res.status(200).json({ received: true });
        }

        const merchantTradeNo = data.merchantTradeNo;
        const totalFee = Number(data.totalFee);

        if (!merchantTradeNo) {
            return res.status(400).json({ error: "NO_ORDER_ID" });
        }

        const parts = merchantTradeNo.split("-");
        const userId = parts[1];

        const credits = calculateCredits(totalFee);

        await creditEngine.addCredit(userId, credits);

        return res.status(200).json({
            success: true,
            creditsAdded: credits
        });

    } catch (err) {

        console.error("WEBHOOK ERROR:", err);
        return res.status(500).json({ error: "WEBHOOK_FAILED" });

    }
};
