// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: config/credit.policy.js
// VERSION: v9.0.0
// STATUS: production-final
// LAYER: core-policy
// RESPONSIBILITY:
// - centralized credit rate
// - bonus tier logic
// - engine cost mapping
// - multi-gateway normalization (THB base)
// DEPENDS ON: none
// LAST FIX:
// - production credit model (1 THB = 100 CREDIT)
// - bonus tier system
// - binance rate 34 THB
// =====================================================

// ===============================
// BASE CONFIG
// ===============================

const BASE_RATE = 100;          // 1 THB = 100 CREDIT
const MIN_TOPUP_THB = 10;       // ขั้นต่ำ 10 บาท
const BINANCE_THB_RATE = 34;    // 1 BNB = 34 THB

// ===============================
// BONUS TIERS
// ===============================

const BONUS_TIERS = [
  { min: 1000, bonus: 0.30 },
  { min: 300,  bonus: 0.20 },
  { min: 100,  bonus: 0.10 },
];

// ===============================
// ENGINE COST (CREDIT)
// ===============================

const ENGINE_COST = {
  image: 50,
  upscale: 80,
  video: 200,
  deep_motion: 300
};

// ===============================
// CREDIT CALCULATOR
// ===============================

function calculateCreditFromTHB(amountTHB) {

  if (!amountTHB || amountTHB < MIN_TOPUP_THB) {
    throw new Error("MIN_TOPUP_NOT_REACHED");
  }

  const baseCredit = amountTHB * BASE_RATE;

  let bonusPercent = 0;

  for (const tier of BONUS_TIERS) {
    if (amountTHB >= tier.min) {
      bonusPercent = tier.bonus;
      break;
    }
  }

  const bonusCredit = Math.floor(baseCredit * bonusPercent);

  return {
    baseCredit,
    bonusCredit,
    totalCredit: baseCredit + bonusCredit,
    bonusPercent
  };
}

// ===============================
// CRYPTO (BNB → THB → CREDIT)
// ===============================

function calculateCreditFromBNB(amountBNB) {

  if (!amountBNB || amountBNB <= 0) {
    throw new Error("INVALID_BNB_AMOUNT");
  }

  const thbValue = amountBNB * BINANCE_THB_RATE;

  return calculateCreditFromTHB(thbValue);
}

// ===============================
// EXPORT
// ===============================

module.exports = {
  BASE_RATE,
  MIN_TOPUP_THB,
  BINANCE_THB_RATE,
  BONUS_TIERS,
  ENGINE_COST,
  calculateCreditFromTHB,
  calculateCreditFromBNB
};
