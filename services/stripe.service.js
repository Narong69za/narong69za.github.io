// =====================================================
// STRIPE SERVICE
// =====================================================

const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// =====================================================
// CREATE CHECKOUT
// =====================================================

exports.createCheckout = async function(data){

   const session = await stripe.checkout.sessions.create({

      payment_method_types:["card"],

      line_items:[{

         price_data:{

            currency:"thb",

            product_data:{
               name:data.name
            },

            unit_amount:data.price

         },

         quantity:1

      }],

      mode:"payment",

      success_url:"https://sn-designstudio.dev/create.html?payment=success",

      cancel_url:"https://sn-designstudio.dev/create.html?payment=cancel",

      metadata:{
         userId:data.userId,
         credits:data.credits
      }

   });

   return session;

}


// =====================================================
// WEBHOOK CONSTRUCT
// =====================================================

exports.constructWebhookEvent = function(body,sig){

   return stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
   );

}
