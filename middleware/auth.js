module.exports = (req, res, next) => {
    req.user = { id: 1, email: "admin@sn.dev", role: "owner" };
    next();
};
