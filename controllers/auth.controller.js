const googleService = require("../services/google.service");
const tokenUtil = require("../utils/token.util");
const db = require("../db/db");
const { v4: uuidv4 } = require("uuid");

const SECRET = "SN_ULTRA_ENGINE_2026_SECURE_KEY";

exports.googleRedirect = async (req, res) => {
    try { res.redirect(googleService.generateAuthUrl()); } catch (e) { res.redirect("/login.html"); }
};

exports.googleCallback = async (req, res) => {
    try {
        const { code } = req.query;
        const googleUser = await googleService.getUserFromCode(code);
        let user = await db.getUserByEmail(googleUser.email);
        if (!user) {
            await db.createUser({ id: uuidv4(), google_id: googleUser.id, email: googleUser.email, role: "user", credits: 0 });
            user = await db.getUserByEmail(googleUser.email);
        }
        const token = tokenUtil.generateAccessToken({ id: user.id, email: user.email, role: user.role });
        // ดีดไปหน้า create พร้อมส่งกุญแจไปทาง URL
        return res.redirect(\`https://sn-designstudio.dev/create.html?token=\${token}\`);
    } catch (err) { res.redirect("/login.html"); }
};

exports.getMe = async (req, res) => {
    try {
        const user = await db.getUserByEmail(req.user.email);
        res.json({ ok: true, user: { email: user.email, role: user.role, credits: user.credits } });
    } catch (err) { res.status(401).json({ ok: false }); }
};

exports.verifyToken = async (req, res) => {
    try {
        const { token } = req.body;
        const googleUser = await googleService.getUserFromToken(token);
        let user = await db.getUserByEmail(googleUser.email);
        if (!user) {
            await db.createUser({ id: uuidv4(), google_id: googleUser.sub, email: googleUser.email, role: "user", credits: 0 });
            user = await db.getUserByEmail(googleUser.email);
        }
        const accessToken = tokenUtil.generateAccessToken({ id: user.id, email: user.email, role: user.role });
        res.json({ ok: true, token: accessToken });
    } catch (e) { res.status(401).json({ ok: false }); }
};
