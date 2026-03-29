function checkCredits(user,required){

 if(user.credits<required){
  throw new Error("INSUFFICIENT_CREDITS")
 }

}

function deductCredits(user,amount){

 user.credits=user.credits-amount

}
module.exports = { checkCredits, deductCredits };
module.exports = { checkCredits, deductCredits };
