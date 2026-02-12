const express = require('express');
const router = express.Router();

if(!process.env.OMISE_PUBLIC || !process.env.OMISE_SECRET){

  console.log("OMISE NOT READY - PAYMENT DISABLED");

  router.post('/create',(req,res)=>{
    res.json({error:"Payment not ready"});
  });

  module.exports = router;
  return;
}

const Omise = require('omise');

const omise = Omise({
  publicKey: process.env.OMISE_PUBLIC,
  secretKey: process.env.OMISE_SECRET
});

router.post('/create', async (req, res) => {

  try{

    const charge = await omise.charges.create({
      amount: req.body.amount * 100,
      currency: 'thb',
      source: { type: 'promptpay' }
    });

    res.json({
      qr: charge.source.scannable_code.image.download_uri,
      chargeId: charge.id
    });

  }catch(err){

    console.error(err);
    res.status(500).json({error:"payment error"});

  }

});

module.exports = router;
