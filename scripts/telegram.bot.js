/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: TELEGRAM BOT RUNNER
 * FILE: scripts/telegram.bot.js
 * VERSION: 1.0.0
 * STATUS: ACTIVE
 * LAST FIX: Polling loop + command handling
 * =====================================================
 */

const { sendMessage, getUpdates } = require("../services/telegram.service");
const { parseCommand } = require("../utils/telegram.router");

let offset = 0;

async function runBot() {
  console.log("Telegram Bot Started");

  while (true) {
    try {
      const updates = await getUpdates(offset);

      for (const update of updates) {
        offset = update.update_id + 1;

        const msg = update.message;
        if (!msg) continue;

        const chatId = msg.chat.id;
        const text = msg.text || "";

        const cmd = parseCommand(text);

        if (!cmd) continue;

        switch (cmd.command) {

          case "/start":
            await sendMessage(chatId, "SN DESIGN BOT READY");
            break;

          case "/status":
            await sendMessage(chatId, "ENGINE STATUS: ONLINE");
            break;

          case "/id":
            await sendMessage(chatId, `CHAT ID: ${chatId}`);
            break;

          default:
            await sendMessage(chatId, "Unknown command");
        }
      }

    } catch (err) {
      console.error("Bot error:", err.message);
    }

    await new Promise(r => setTimeout(r, 2000));
  }
}

runBot();
