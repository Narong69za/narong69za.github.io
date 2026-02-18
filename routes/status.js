const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.get("/:id",(req,res)=>{

   db.get(
      "SELECT * FROM projects WHERE id=?",
      [req.params.id],
      (err,row)=>{
         res.json(row);
      }
   );
});

module.exports = router;
