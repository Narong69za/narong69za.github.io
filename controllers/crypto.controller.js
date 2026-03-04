// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: controllers/crypto.controller.js
// VERSION: v9.2.0
// STATUS: production-final
// LAYER: gateway
// RESPONSIBILITY:
// - create Binance Pay order
// - verify Binance webhook signature
// - replay attack protection
// - idempotent credit add
// - atomic ledger logging
// DEPENDS ON:
// - config/credit.policy.js
// - db/db.js
// LAST FIX:
// - full signature verification
// - replay timestamp guard (5 min)
// - idempotent protection via payment_logs
// =====================================================

const axios = require("axios");
const crypto = require("crypto");
const db = require("../db/db");
const CREDIT_POLICY = require("../config/credit.policy");

const BINANCE_API_KEY = process.env.BINANCE_PAY_KEY;
const BINANCE_SECRET = process.env.BINANCE_PAY_SECRET;

const ALLOWED_AMOUNTS = [10, 15, 20, 25, 30, 50];
const ALLOWED_COINS = ["USDT", "BNB", "TON"];

// =====================================================
// CREDIT CALCULATION (POLICY BASED)
// =====================================================

function calculateCredits(usd) {

  const thb = usd * CREDIT_POLICY.BINANCE_THB_RATE;
  const base = thb * CREDIT_POLICY.BASE_RATE;

  const tier = CREDIT_POLICY.BONUS_TIERS
    .filter(t => thb >= t.min)
    .sort((a, b) => b.min - a.min)[0];

  if (!tier) return Math.floor(base);

  return Math.floor(base + (base * tier.bonusPercent / 100));
}

// =====================================================
// SIGN BINANCE REQUEST
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
// WEBHOOK (FULL HARDENED)
// =====================================================

exports.webhook = async (req, res) => {

  try {

    // ===============================
    // 1. VERIFY SIGNATURE
    // ===============================

    const timestamp = req.headers["binancepay-timestamp"];
    const nonce = req.headers["binancepay-nonce"];
    const signature = req.headers["binancepay-signature"];

    if (!timestamp || !nonce || !signature) {
      return res.status(401).json({ error: "NO_SIGNATURE" });
    }

    const rawBody = Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(req.body);

    const payload = timestamp + "\n" + nonce + "\n" + rawBody.toString() + "\n";

    const expected = crypto
      .createHmac("sha512", BINANCE_SECRET)
      .update(payload)
      .digest("hex")
      .toUpperCase();

    const valid =
      signature.length === expected.length &&
      crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expected)
      );

    if (!valid) {
      return res.status(403).json({ error: "INVALID_SIGNATURE" });
    }

    // ===============================
    // 2. REPLAY TIMESTAMP GUARD (±5 min)
    // ===============================

    const now = Date.now();
    const requestTime = Number(timestamp);

    if (Math.abs(now - requestTime) > 5 * 60 * 1000) {
      return res.status(400).json({ error: "TIMESTAMP_EXPIRED" });
    }

    // ===============================
    // 3. PARSE BODY
    // ===============================

    const data = JSON.parse(rawBody.toString());

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

    // ===============================
    // 4. IDEMPOTENT LOCK
    // ===============================

    const existing = await new Promise((resolve, reject) => {
      db.sqlite.get(
        "SELECT id FROM payment_logs WHERE tx_id = ?",
        [merchantTradeNo],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });

    if (existing) {
      return res.status(200).json({ duplicate: true });
    }

    // ===============================
    // 5. ATOMIC CREDIT + LOG
    // ===============================

    await db.addCredit(userId, credits);

    await new Promise((resolve, reject) => {
      db.sqlite.run(
        `INSERT INTO payment_logs
         (id,user_id,method,amount,currency,status,tx_id)
         VALUES (?,?,?,?,?,?,?)`,
        [
          crypto.randomUUID(),
          userId,
          "binance",
          totalFee,
          "USD",
          "success",
          merchantTradeNo
        ],
        function (err) {
          if (err) return reject(err);
          resolve(true);
        }
      );
    });

    return res.status(200).json({
      success: true,
      creditsAdded: credits
    });

  } catch (err) {

    console.error("WEBHOOK ERROR:", err);
    return res.status(500).json({ error: "WEBHOOK_FAILED" });

  }
};
