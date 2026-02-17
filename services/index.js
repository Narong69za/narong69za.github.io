// ==============================
// SN DESIGN STUDIO API SERVER
// ULTRA FINAL BUILD
// ==============================

const express = require("express");
const cors = require("cors");

const app = express();

// ===== BASIC CONFIG =====

app.use(cors());
app.use(express.json());

// IMPORTANT: Render ต้องใช้ PORT env
const PORT = process.env.PORT || 10000;


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

        const data = req.body;

        console.log("DATA:", data);

        // fake render result
        res.json({
            status:"render-started",
            video:"processing"
        });

    }catch(err){

        console.error(err);

        res.status(500).json({
            error:"render fail"
        });
    }
});


// ==============================
// START SERVER
// ==============================

app.listen(PORT,()=>{

    console.log("=================================");
    console.log("SN DESIGN API RUNNING");
    console.log("PORT:", PORT);
    console.log("=================================");

});
