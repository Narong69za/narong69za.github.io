/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: google.service.js
 * VERSION: v1.0.1
 * STATUS: production
 * LAST FIX: fix redirect env variable mismatch
 */

const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

exports.generateAuthUrl = (state) => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
    include_granted_scopes: true,
    state
  });
};

exports.getUserFromCode = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: "v2"
  });

  const { data } = await oauth2.userinfo.get();
  return data;
};
