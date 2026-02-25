const stripe = require("stripe")(process.env.STRIPE_SECRET);
const creditEngine = require("./credit.engine");

async function handleStripeWebhook(req, res) {

   const event = req.body;

   if (event.type === "checkout.session.completed") {

      const session = event.data.object;

      const userId = session.metadata.userId;
      const amount = parseInt(session.metadata.credits);

      await creditEngine.addCredit(userId, amount);
   }

   res.json({ received: true });
}

module.exports = handleStripeWebhook;
