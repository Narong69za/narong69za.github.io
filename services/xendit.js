const { Xendit } = require("xendit-node");

const x = new Xendit({
 secretKey: process.env.XENDIT_SECRET
});

async function createXenditCharge(packageId){

 const invoice = await x.Invoice.create({
   externalID:"order_"+Date.now(),
   amount:150,
   payerEmail:"user@email.com"
 });

 return invoice.invoice_url;

}
