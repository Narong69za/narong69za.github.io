const express = require("express");
const router = express.Router();

const admin = require("../controllers/admin.controller");

const ADMIN_SECRET = process.env.ADMIN_SECRET;

function guard(req,res,next){

  const key = req.headers["x-admin-key"];

  if(!key || key !== ADMIN_SECRET){
    return res.status(403).json({error:"Unauthorized"});
  }

  next();
}

router.get("/users", guard, admin.getUsers);
router.post("/credit/add", guard, admin.addCredit);
router.post("/credit/remove", guard, admin.removeCredit);
router.get("/overview", guard, admin.getOverview);

module.exports = router;
