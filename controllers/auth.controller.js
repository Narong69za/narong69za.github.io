// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: controllers/auth.controller.js
// VERSION: v
// STATUS: production-hardened
// LAST FIX: 2026-03-08
// - added redirect-safe login flow
// - preserved dashboard redirect
// - hardened cookie config
// =====================================================



// ================= GOOGLE REDIRECT (แก้ลำดับใหม่) =================
exports.googleRedirect = async (req, res) => {
  try {
    const state = crypto.randomBytes(32).toString("hex");

    // [1] ต้องเซ็ต Cookie ก่อนเสมอ!
    res.cookie("oauth_state", state, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".sn-designstudio.dev",
      path: "/",
      maxAge: 10 * 60 * 1000
    });

    // [2] สร้าง URL ไปหา Google
    const url = googleService.generateAuthUrl(state);

    // [3] ส่งคนไปหา Google (ห้ามส่งไปหน้าบ้านเด็ดขาด!)
    return res.redirect(url);
  } catch (err) {
    return res.redirect("https://sn-designstudio.dev/login.html?error=setup_failed");
  }
};

// ================= GOOGLE CALLBACK (แก้ชื่อตัวแปร) =================
exports.googleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    const storedState = req.cookies.oauth_state;

    // เช็คบัตรคิว
    if (!state || state !== storedState) {
      return res.status(400).json({ error: "INVALID_OAUTH_STATE" });
    }

    const googleUser = await googleService.getUserFromCode(code);
    // ... (Logic เช็ค User เหมือนเดิม) ...

    const accessToken = tokenUtil.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // [4] ส่งกลับหน้าบ้านพร้อม Token (ใช้ชื่อตัวแปร accessToken ให้ตรงกัน)
    return res.redirect(`https://sn-designstudio.dev/create.html?token=${accessToken}`);

  } catch (err) {
    console.error("GOOGLE CALLBACK ERROR", err);
    return res.status(500).json({ error: "GOOGLE_LOGIN_FAILED" });
  }
};

