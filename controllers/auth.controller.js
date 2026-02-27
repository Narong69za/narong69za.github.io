const crypto = require('crypto');
const googleService = require('../services/google.service');
const tokenUtil = require('../utils/token.util');

exports.googleRedirect = async (req, res) => {
  const state = crypto.randomBytes(32).toString('hex');

  res.cookie('oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });

  const url = googleService.generateAuthUrl(state);
  return res.redirect(url);
};

exports.googleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    const storedState = req.cookies.oauth_state;

    if (!state || state !== storedState) {
      return res.status(400).json({ error: 'Invalid state' });
    }

    const tokens = await googleService.getTokens(code);
    const profile = await googleService.getUserProfile(tokens.access_token);

    if (!profile.verified_email) {
      return res.status(403).json({ error: 'Email not verified' });
    }

    // TODO: Replace with real DB upsert
    const user = {
      id: profile.id,
      email: profile.email,
      role: 'user',
      subscription: 'free'
    };

    const accessToken = tokenUtil.generateAccessToken(user);
    const refreshToken = tokenUtil.generateRefreshToken(user);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    res.clearCookie('oauth_state');

    return res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

exports.me = async (req, res) => {
  return res.json({ user: req.user });
};

exports.logout = async (req, res) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  return res.json({ message: 'Logged out' });
};
