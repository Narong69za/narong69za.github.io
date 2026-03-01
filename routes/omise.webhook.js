// ======================================================
// MODULE: omise.webhook.js
// VERSION: 1.0.0
// ======================================================

const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.post("/", async (req,res)=>{

  const event = req.body;

  if(event.key === "charge.complete"){

    const charge = event.data;

    if(charge.status === "successful"){

      const userId = charge.metadata.userId;
      const credits = parseInt(charge.metadata.credits);

      await db.addCredit(userId, credits);

      console.log("CREDIT ADDED:", credits);

    }

  }

  res.sendStatus(200);

});

module.exports = router;
