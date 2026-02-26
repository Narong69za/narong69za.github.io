const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.get("/me", async (req,res)=>{

   const userId = req.headers["x-user-id"];

   const user = await db.getUser(userId);

   res.json(user);

});

module.exports = router;
