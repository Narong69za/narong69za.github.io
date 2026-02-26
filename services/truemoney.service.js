// =====================================================
// TRUEMONEY SERVICE (STRUCTURE READY)
// =====================================================

const { v4: uuidv4 } = require("uuid");

async function initWalletPayment(amount) {

    if (!amount) {
        throw new Error("AMOUNT_REQUIRED");
    }

    const sessionId = uuidv4();

    // ตอนนี้ยังไม่มี provider จริง
    // ทำโครงสร้าง session ไว้ก่อน

    return {
        success: true,
        sessionId,
        redirectUrl: "https://example-wallet-gateway.com/pay/" + sessionId
    };
}

module.exports = {
    initWalletPayment
};
