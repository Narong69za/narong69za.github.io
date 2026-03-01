// ======================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: slip-verify.service.js
// VERSION: 1.0.0
// STATUS: production
// LAST FIX: initial auto slip verification
// ======================================================

const axios = require("axios");

exports.verifySlip = async (fileBuffer) => {

  try {

    const response = await axios.post(
      "https://api.slipok.com/api/line/apikey/YOUR_API_KEY",
      fileBuffer,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    return response.data;

  } catch (err) {
    throw new Error("SLIP_VERIFY_FAILED");
  }

};
