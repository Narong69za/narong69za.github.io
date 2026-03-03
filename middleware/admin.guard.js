// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: middleware/admin.guard.js
// VERSION: v9.0.0
// STATUS: production-final
// LAYER: security
// RESPONSIBILITY:
// - enforce admin / owner role
// - block unauthorized access
// DEPENDS ON:
// - middleware/auth.js
// LAST FIX:
// - initial production admin guard
// =====================================================

module.exports = function adminGuard(req, res, next) {

  if (!req.user) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  const role = req.user.role;

  if (role === "admin" || role === "owner" || role === "dev") {
    return next();
  }

  return res.status(403).json({ error: "FORBIDDEN" });
};
