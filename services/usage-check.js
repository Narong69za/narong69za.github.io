export default async function handler(req, res) {

if (req.method !== "POST") {

return res.status(405).json({ error: "Method not allowed" });

}


// ======================
// GET CLIENT IP
// ======================

const ip =
req.headers["x-forwarded-for"]?.split(",")[0] ||
req.socket.remoteAddress;


// ======================
// GET GOOGLE TOKEN
// ======================

const { token } = req.body;

if(!token){

return res.status(401).json({ error:"NO LOGIN TOKEN" });

}


// ======================
// VERIFY GOOGLE LOGIN
// ======================

const verify = await fetch(

`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`

);

if(!verify.ok){

return res.status(401).json({ error:"INVALID GOOGLE LOGIN" });

}


// ======================
// USAGE LIMIT ENGINE
// ======================

const today = new Date().toISOString().slice(0,10);

// ⚠️ ตัวอย่าง memory store (เปลี่ยน DB จริงภายหลัง)

global.usageStore = global.usageStore || {};

const key = ip + "_" + today;

if(!global.usageStore[key]){

global.usageStore[key] = 0;

}

if(global.usageStore[key] >= 3){

return res.status(403).json({

limit:true,
message:"FREE LIMIT REACHED"

});

}

global.usageStore[key]++;


// ======================
// OK
// ======================

return res.status(200).json({

success:true,
count:global.usageStore[key]

});

}
