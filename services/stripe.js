const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET);

async function createStripeCheckout(packageId){

 const session = await stripe.checkout.sessions.create({

   payment_method_types:["card"],

   line_items:[{
     price_data:{
       currency:"usd",
       product_data:{ name:"AI Credits" },
       unit_amount:500 // $5
     },
     quantity:1
   }],

   mode:"payment",

   success_url:"https://designstudio.dev/success",
   cancel_url:"https://designstudio.dev/cancel"

 });

 return session.url;

     }
