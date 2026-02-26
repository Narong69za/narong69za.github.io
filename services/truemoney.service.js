// ======================================================
// TRUE MONEY WALLET SERVICE
// ======================================================

exports.createTrueMoneyPayment = async ({amount,userId})=>{

   // placeholder API integration

   return {
      type:"truemoney",
      paymentUrl:`https://truemoney.fake/pay?user=${userId}&amount=${amount}`
   };

};
