/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: services/binance.rate.service.js
 * VERSION: v9.0.0
 * STATUS: production
 * LAST FIX:
 * - added real-time binance rate fetch
 * - added in-memory cache
 * - add-only module (no system modification)
 * =====================================================
 */

const axios = require("axios");

let cachedRate = 36;
let lastFetch = 0;

exports.getTHBRate = async () => {

  const now = Date.now();

  if(now - lastFetch < 60000){
    return cachedRate;
  }

  try{

    const r = await axios.get(
      "https://api.binance.com/api/v3/ticker/price?symbol=USDTTHB"
    );

    cachedRate = Number(r.data.price);
    lastFetch = now;

  }catch(err){

    console.warn("BINANCE RATE FAIL USING CACHE");

  }

  return cachedRate;

};
