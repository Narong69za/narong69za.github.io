// ======================================================
// STRIPE SERVICE
// ======================================================

require("dotenv").config();
const Stripe = require("stripe");

if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY NOT FOUND");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const CREDIT_PRODUCTS = {
  credit_pack_1: {
    name: "AI Credit Pack 100",
    credits: 100,
    price: 19900
  }
};

exports.createCheckout = async ({ product, userId }) => {

  if (!CREDIT_PRODUCTS[product]) {
    throw new Error("INVALID PRODUCT");
  }

  const item = CREDIT_PRODUCTS[product];

  const session = await stripe.checkout.sessions.create({

    payment_method_types: ["card"],

    mode: "payment",

    line_items: [
      {
        price_data: {
          currency: "thb",
          product_data: {
            name: item.name
          },
          unit_amount: item.price
        },
        quantity: 1
      }
    ],

    success_url: process.env.STRIPE_SUCCESS_URL,
    cancel_url: process.env.STRIPE_CANCEL_URL,

    metadata: {
      userId: userId || "DEV",
      credits: item.credits
    }

  });

  return session;
};
