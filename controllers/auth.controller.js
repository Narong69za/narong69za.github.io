const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none", // สำคัญมากสำหรับการคุยข้าม Subdomain
  domain: ".sn-designstudio.dev", // จุดข้างหน้าคือหัวใจ
  path: "/",
  partitioned: true // [ADD] เพื่อให้บราวเซอร์รุ่นใหม่ยอมรับคุกกี้
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

    const accessToken = tokenUtil.generateAccessToken({ id: user.id, email: user.email, role: user.role });
    
    // [FIX] เซตคุกกี้ให้ชัวร์ก่อน Redirect
    res.cookie("access_token", accessToken, { ...COOKIE_OPTIONS, maxAge: 24 * 60 * 60 * 1000 });
    
    // ล้าง State เก่า
    res.clearCookie("oauth_state", COOKIE_OPTIONS);

    // จบงาน: ดีดกลับหน้าจัดการ
    return res.redirect(`https://sn-designstudio.dev/create.html`);
  } catch (err) {
    console.error("AUTH_ERROR:", err);
    return res.redirect("https://sn-designstudio.dev/login.html?error=auth_failed");
  }
};

