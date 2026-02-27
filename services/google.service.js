const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

exports.generateAuthUrl = (state) => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'openid',
      'email',
      'profile'
    ],
    include_granted_scopes: true,
    state
  });
};

exports.getTokens = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

exports.getUserProfile = async (accessToken) => {
  oauth2Client.setCredentials({ access_token: accessToken });

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2'
  });

  const { data } = await oauth2.userinfo.get();
  return data;
};
