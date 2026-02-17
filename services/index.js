// ==============================
// SN DESIGN STUDIO API SERVER
// ULTRA FINAL BUILD
// ==============================

const express = require("express");
const cors = require("cors");

const app = express();


// ==============================
// BASIC CONFIG
// ==============================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

// IMPORTANT: Render ต้องใช้ PORT env
const PORT = process.env.PORT || 10000;


// ==============================
// GLOBAL LOGGER (ADD ONLY)
// ==============================

app.use((req,res,next)=>{

console.log(
"[API]",
req.method,
req.url
);

next();

});


// ==============================
// HEALTH CHECK
// ==============================

app.get("/", (req,res)=>{
    res.send("🔥 SN DESIGN SERVER ONLINE 🔥");
});

app.get("/api/status/server",(req,res)=>{
    res.json({
        status:"online",
        server:"SN DESIGN API",
        time: new Date()
    });
});


// ==============================
// PREVIEW ROUTE
// (ใช้ตอน preview motion)
// ==============================

app.post("/api/preview", async(req,res)=>{

    console.log("PREVIEW REQUEST");

    try{

        const { image } = req.body;

        if(!image){
            return res.status(400).json({
                error:"no image"
            });
        }

        // fake preview response (ทดสอบก่อน)
        res.json({
            status:"preview-ok",
            preview:"generated"
        });

    }catch(err){

        console.error(err);

        res.status(500).json({
            error:"preview fail"
        });
    }
});


// ==============================
// CREATE / RENDER ROUTE
// ==============================

app.post("/api/render", async(req,res)=>{

    console.log("CREATE CLICKED");

    try{

        const data = req.body || {};

        console.log("DATA:", data);

        /*
        ตรงนี้คือจุดต่อ AI engine จริง
        ตอนนี้ return success ก่อน
        */

        res.json({
            status:"render-started",
            video:"processing",
            engine:"ULTRA DIRECT MODE",
            time:Date.now()
        });

    }catch(err){

        console.error(err);

        res.status(500).json({
            error:"render fail"
        });
    }
});


// ==============================
// 404 API HANDLER (ADD ONLY)
// ==============================

app.use("/api",(req,res)=>{

res.status(404).json({
error:true,
message:"API route not found"
});

});


// ==============================
// START SERVER
// ==============================

app.listen(PORT,"0.0.0.0",()=>{

    console.log("=================================");
    console.log("SN DESIGN API RUNNING");
    console.log("PORT:", PORT);
    console.log("=================================");

});
