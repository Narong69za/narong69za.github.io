/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: google.service.js
 * VERSION: v11.0.0 (FINAL FIX)
 */

const { google } = require("googleapis");

// ดึงค่าจาก .env แบบรองรับหลายชื่อตัวแปร (กันเหนียว)
const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || process.env.GOOGLE_REDIRECT_URI;

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  CALLBACK_URL
);

exports.generateAuthUrl = (state) => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "openid"
    ],
    include_granted_scopes: true,
    state
  });
};

exports.getUserFromCode = async (code) => {
  // มั่นใจว่าตอนแลก Token เราส่ง Redirect URI ที่ถูกต้องไปด้วย
  const { tokens } = await oauth2Client.getToken({
    code: code,
    redirect_uri: CALLBACK_URL 
  });
  
  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: "v2"
  });

  const { data } = await oauth2.userinfo.get();
  return data;
};

