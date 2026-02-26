// ======================================================
// STRIPE ROUTE
// FINAL PRODUCTION
// ======================================================

const express = require("express");
const router = express.Router();

const stripeService = require("../services/stripe.service");


// ============================================
// CREATE CHECKOUT SESSION
// ============================================

router.post("/create-checkout", async (req,res)=>{

    try{

        const { product } = req.body;

        // DEV BYPASS USER (ถ้ายังไม่ใช้ login)
        const userId = req.headers["x-user-id"] || "DEV";

        const session = await stripe.checkout.sessions.create({

   payment_method_types:["card"],

   line_items:[ ... ],

   mode:"payment",

   success_url:"https://sn-designstudio.dev/create.html?payment=success",

   cancel_url:"https://sn-designstudio.dev/create.html?payment=cancel"

});

    }catch(err){

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

});

module.exports = router;
