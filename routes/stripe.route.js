// =====================================================
// STRIPE CHECKOUT ROUTE
// =====================================================

const express = require("express");
const router = express.Router();

const stripeService = require("../services/stripe.service");


// =====================================================
// CREATE CHECKOUT SESSION
// =====================================================

router.post("/create-checkout", async (req,res)=>{

   try{

      const { product, userId } = req.body;

      if(!product){

         return res.status(400).json({ error:"NO PRODUCT" });

      }

      // ⭐ map credit pack
      const PRODUCT_MAP = {

         credit_pack_1:{
            name:"Credit Pack",
            price:10000, // 100 THB (satang)
            credits:100
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
         userId:userId || "guest"

      });

      res.json({

         url: session.url

      });

   }catch(err){

      console.error(err);

      res.status(500).json({

         error:"STRIPE CREATE FAILED"

      });

   }

});

module.exports = router;
