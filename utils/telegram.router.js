/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: TELEGRAM COMMAND ROUTER
 * FILE: utils/telegram.router.js
 * VERSION: 1.0.0
 * STATUS: ACTIVE
 * LAST FIX: Command parsing
 * =====================================================
 */

function parseCommand(text = "") {
  if (!text.startsWith("/")) return null;

  const parts = text.split(" ");
  const command = parts[0].toLowerCase();

  return {
    command,
    args: parts.slice(1)
  };
}

module.exports = {
  parseCommand
};
