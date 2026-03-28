/*
================================
ULTRA USER STORE
ADD ONLY SAFE
================================
*/

const USERS = {};

function getUser(email){

  if(!USERS[email]){

    USERS[email]={
      email,
      credit:0,
      freeUsed:0
    };

  }

  return USERS[email];
}

module.exports = { getUser };
