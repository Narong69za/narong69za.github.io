const config = require('../config/credit.config.json');
let users = {};

exports.addCredit = async (ip, amount) => {
  const credit = amount * config.conversion;
  if (!users[ip]) users[ip] = 0;
  users[ip] += credit;
  console.log('CREDIT:', ip, users[ip]);
};
