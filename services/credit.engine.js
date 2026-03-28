export function checkCredits(user,required){

 if(user.credits<required){
  throw new Error("INSUFFICIENT_CREDITS")
 }

}

export function deductCredits(user,amount){

 user.credits=user.credits-amount

}
