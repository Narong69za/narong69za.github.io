const wallets = {};
const transactions = [];

function getWallet(user){

   if(!wallets[user]){
      wallets[user]={
         balance:0
      };
   }

   return wallets[user];
}

function deposit(user,amount){

   const w = getWallet(user);

   w.balance += amount;

   transactions.push({
      type:"deposit",
      user,
      amount,
      time:Date.now()
   });

}

function withdraw(user,amount){

   const w = getWallet(user);

   if(w.balance < amount){
      throw new Error("not enough balance");
   }

   w.balance -= amount;

   transactions.push({
      type:"withdraw",
      user,
      amount,
      time:Date.now()
   });

}

module.exports={
   wallets,
   transactions,
   deposit,
   withdraw,
   getWallet
};
