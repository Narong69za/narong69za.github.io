// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: controllers/crypto.controller.js
// VERSION: v9.0.0
// STATUS: production-final
// LAYER: gateway
// RESPONSIBILITY:
// - create binance order
// - calculate credit via policy
// - hardened webhook (idempotent + atomic)
// DEPENDS ON:
// - config/credit.policy.js
// - db/db.js
// =====================================================

const axios = require("axios");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const CREDIT_POLICY = require("../config/credit.policy");
const db = require("../db/db");

const BINANCE_API_KEY = process.env.BINANCE_PAY_KEY;
const BINANCE_SECRET = process.env.BINANCE_PAY_SECRET;

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

exports.createOrder = async ({ userId, amountBNB, credits }) => {

  const merchantTradeNo = `SN-${userId}-${Date.now()}`;

  const payload = {
    merchantTradeNo,
    orderAmount: amountBNB,
    currency: "BNB",
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

  return {
    merchantTradeNo,
    checkoutUrl: response.data?.data?.checkoutUrl,
    credits
  };
};

// =====================================================
// WEBHOOK (HARDENED)
// =====================================================

exports.webhook = async (req, res) => {

  try {

    if (!Buffer.isBuffer(req.body)) {
      return res.status(400).send("INVALID_BODY");
    }

    const data = JSON.parse(req.body.toString());

    if (data?.bizStatus !== "PAY_SUCCESS") {
      return res.status(200).json({ received: true });
    }

    const merchantTradeNo = data.merchantTradeNo;
    const totalBNB = Number(data.totalFee);

    if (!merchantTradeNo || !totalBNB) {
      return res.status(400).send("INVALID_DATA");
    }

    const parts = merchantTradeNo.split("-");
    const userId = parts[1];

    const creditResult =
      CREDIT_POLICY.calculateCreditFromBNB(totalBNB);

    const credits = creditResult.totalCredit;

    const txId = merchantTradeNo;

    // ===============================
    // ATOMIC BLOCK
    // ===============================

    await new Promise((resolve, reject) => {

      db.sqlite.serialize(() => {

        db.sqlite.run("BEGIN TRANSACTION");

        db.sqlite.get(
          "SELECT id FROM payment_logs WHERE tx_id = ?",
          [txId],
          (err, row) => {

            if (err) {
              db.sqlite.run("ROLLBACK");
              return reject(err);
            }

            if (row) {
              db.sqlite.run("ROLLBACK");
              return resolve("DUPLICATE");
            }

            db.sqlite.run(
              "UPDATE users SET credits = COALESCE(credits,0) + ? WHERE id = ?",
              [credits, userId]
            );

            db.sqlite.run(
              `INSERT INTO transactions
               (id, user_id, type, amount, status)
               VALUES (?, ?, 'topup', ?, 'success')`,
              [uuidv4(), userId, credits]
            );

            db.sqlite.run(
              `INSERT INTO payment_logs
               (id,user_id,method,amount,currency,status,tx_id)
               VALUES (?,?,?,?,?,?,?)`,
              [
                uuidv4(),
                userId,
                "crypto",
                totalBNB,
                "BNB",
                "success",
                txId
              ]
            );

            db.sqlite.run("COMMIT", (commitErr) => {
              if (commitErr) {
                db.sqlite.run("ROLLBACK");
                return reject(commitErr);
              }
              resolve("OK");
            });

          }
        );

      });

    });

    return res.status(200).json({ success: true });

  } catch (err) {

    console.error("CRYPTO WEBHOOK ERROR:", err);
    return res.status(500).send("ERROR");

  }
};
