// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: stripe.route.js
// VERSION: 1.1.0
// STATUS: production
// LAST FIX: add auth middleware to prevent redirect
// =====================================================

const express = require("express");
const router = express.Router();

const stripeService = require("../services/stripe.service");
const authMiddleware = require("../middleware/auth");

// =====================================================
// CREATE CHECKOUT SESSION
// =====================================================

router.post("/create-checkout", authMiddleware, async (req,res)=>{

   try{

      const { product } = req.body;

      if(!product){
         return res.status(400).json({ error:"NO PRODUCT" });
      }

      const PRODUCT_MAP = {
         credit_pack_1:{
            name:"Credit Pack",
            price:2000,
            credits:20
         }
      };

      const item = PRODUCT_MAP[product];

      if(!item){
         return res.status(400).json({ error:"INVALID PRODUCT" });
      }

      const session = await stripeService.createCheckout({
         name:item.name,
         price:item.price,
         credits:item.credits,
         userId:req.user.id
      });

      res.json({ url: session.url });

   }catch(err){
      console.error(err);
      res.status(500).json({ error:"STRIPE CREATE FAILED" });
   }

});

module.exports = router;
