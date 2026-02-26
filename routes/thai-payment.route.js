const express = require("express");
const router = express.Router();

const thaiqr = require("../services/thaiqr.service");
const truemoney = require("../services/truemoney.service");

router.post("/promptpay", async(req,res)=>{

    const { amount, userId } = req.body;

    const qr = await thaiqr.generate(amount,userId);

    res.json({
        qr
    });

});

router.post("/truemoney", async(req,res)=>{

    const { amount, userId } = req.body;

    const redirectUrl = await truemoney.createPayment(amount,userId);

    res.json({
        redirectUrl
    });

});

module.exports = router;
