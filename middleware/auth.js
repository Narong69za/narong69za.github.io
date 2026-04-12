module.exports = (req, res, next) => {
    // โหมดถอดปลั๊ก: ให้ผ่าน 100% และจำลองข้อมูล User ไว้ให้ระบบอื่นทำงานได้
    req.user = { 
        id: "1", 
        email: "test_admin@sn-designstudio.dev", 
        role: "owner" 
    };
    next();
};
