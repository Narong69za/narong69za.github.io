// =====================================================
// SN DESIGN ENGINE AI
// ULTRA DB MEMORY VERSION
// CREDIT + FREE USAGE READY
// =====================================================


// =========================
// USER STORE (MEMORY)
// =========================

let users = {};


// =========================
// FREE USAGE STORE (IP BASED)
// =========================

let freeUsage = {};


// =====================================================
// USER FUNCTIONS
// =====================================================

exports.getUser = async (id)=>{

  return users[id] || null;

};


exports.createUser = async (user)=>{

  users[user.id] = {

    ...user,
    credits: user.credits || 20

  };

  return users[user.id];

};


// =====================================================
// CREDIT SYSTEM
// =====================================================

exports.useCredit = async (id, amount)=>{

  if(!users[id]) return false;

  if(users[id].credits < amount) return false;

  users[id].credits -= amount;

  return true;

};


exports.addCredit = async (id, amount)=>{

  if(!users[id]) return;

  users[id].credits += amount;

};


// =====================================================
// FREE USAGE SYSTEM
// =====================================================

exports.getFreeUsage = async (ip, date)=>{

  const key = ip + "_" + date;

  return freeUsage[key] || null;

};


exports.addFreeUsage = async (ip, date)=>{

  const key = ip + "_" + date;

  freeUsage[key] = {

    ip,
    date,
    count: 1

  };

};


exports.incrementFreeUsage = async (ip, date)=>{

  const key = ip + "_" + date;

  if(freeUsage[key]){

    freeUsage[key].count++;

  }

};



// =====================================================
// DEBUG (OPTIONAL)
// =====================================================

exports._debugUsers = ()=>users;
exports._debugFreeUsage = ()=>freeUsage;
