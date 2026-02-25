// db/db.js

let users = {};

exports.getUser = async (id)=>{
  return users[id] || null;
};

exports.createUser = async (user)=>{
  users[user.id] = {
    ...user,
    credits: 20
  };
  return users[user.id];
};

exports.decreaseCredit = async (id,amount)=>{
  if(users[id]){
    users[id].credits -= amount;
  }
};
