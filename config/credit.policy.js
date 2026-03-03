// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: config/credit.policy.js
// VERSION: v9.0.0
// STATUS: production-final
// LAYER: config
// RESPONSIBILITY:
// - central financial authority
// - unified gateway pricing
// - binance FX control
// DEPENDS ON:
// - none
// LAST FIX:
// - unified version alignment to v9
// =====================================================

const CREDIT_POLICY = {

  // ============================================
  // GLOBAL FX RATE (CRYPTO)
  // ============================================

  FX: {
    BINANCE_THB_RATE: 34,   // 1 USDT = 34 THB (manual control)
  },

  // ============================================
  // GATEWAY FEE MODEL (optional accounting)
  // ============================================

  GATEWAY_FEES: {

    omise: {
      percent: 3.65,
      fixed_thb: 0
    },

    stripe: {
      percent: 3.65,
      fixed_thb: 0
    },

    truemoney: {
      percent: 3.9,
      fixed_thb: 0
    },

    promptpay: {
      percent: 0,
      fixed_thb: 0
    },

    binance: {
      percent: 0.1,
      fixed_thb: 0
    }

  },

  // ============================================
  // PRODUCT PACKS (UNIFIED FOR ALL GATEWAYS)
  // ============================================

  PRODUCTS: {

    credit_pack_1: {
      name: "Starter Pack",
      price_thb: 99,
      amount_satang: 9900,
      credits: 100
    },

    credit_pack_2: {
      name: "Creator Pack",
      price_thb: 199,
      amount_satang: 19900,
      credits: 220
    },

    credit_pack_3: {
      name: "Pro Pack",
      price_thb: 499,
      amount_satang: 49900,
      credits: 600
    },

    credit_pack_4: {
      name: "Ultra Pack",
      price_thb: 999,
      amount_satang: 99900,
      credits: 1300
    }

  },

  // ============================================
  // ENGINE COST (DEDUCT SYSTEM)
  // ============================================

  ENGINE_COST: {

    generate_image: 2,
    generate_video: 5,
    upscale: 1,
    lip_sync: 4,
    face_swap: 3,
    motion_clone: 6

  },

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  calculateCryptoUSDT(thbAmount) {
    return (thbAmount / this.FX.BINANCE_THB_RATE).toFixed(4);
  },

  calculateGatewayFee(thbAmount, gateway) {

    const feeModel = this.GATEWAY_FEES[gateway];

    if (!feeModel) return 0;

    const percentFee = (thbAmount * feeModel.percent) / 100;
    return percentFee + feeModel.fixed_thb;
  }

};

module.exports = CREDIT_POLICY;
