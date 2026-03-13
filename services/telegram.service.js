/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: TELEGRAM BOT SERVICE
 * FILE: services/telegram.service.js
 * VERSION: 1.0.0
 * STATUS: ACTIVE
 * LAST FIX: Telegram polling + command router
 * =====================================================
 */

const axios = require("axios");
const { TELEGRAM_TOKEN } = require("../config/telegram.config");

const BASE = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

async function sendMessage(chatId, text) {
  try {
    await axios.post(`${BASE}/sendMessage`, {
      chat_id: chatId,
      text: text
    });
  } catch (err) {
    console.error("Telegram send error:", err.message);
  }
}

async function getUpdates(offset = 0) {
  const res = await axios.get(`${BASE}/getUpdates`, {
    params: { offset }
  });
  return res.data.result || [];
}

module.exports = {
  sendMessage,
  getUpdates
};
