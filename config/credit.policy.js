// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: config/credit.policy.js
// VERSION: v1.0.0
// STATUS: production
// RESPONSIBILITY:
// - Central credit pricing control
// - Unified product mapping
// =====================================================

module.exports = {

  PRODUCTS: {
    credit_pack_1: {
      price_thb: 99,
      amount_satang: 9900,
      credits: 100
    },
    credit_pack_2: {
      price_thb: 199,
      amount_satang: 19900,
      credits: 220
    }
  },

  ENGINE_COST: {
    generate_image: 2,
    generate_video: 5,
    upscale: 1,
    lip_sync: 4,
    face_swap: 3
  }

};
