// ==============================
// SN DESIGN STUDIO API + WEBSITE
// ULTRA FINAL ONE FILE
// ==============================

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// ==============================
// BASIC CONFIG
// ==============================

app.use(cors());
app.use(express.json());

// IMPORTANT: Render ใช้ PORT env
const PORT = process.env.PORT || 10000;


// ==============================
// SERVE WEBSITE (สำคัญมาก)
// ==============================

app.use(express.static(path.join(__dirname,"../public")));


// ==============================
// ROOT WEBSITE
// ==============================

app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname,"../public/index.html"));
});


// ==============================
// HEALTH CHECK
// ==============================

app.get("/api/status/server",(req,res)=>{
    res.json({
        status:"online",
        server:"SN DESIGN API",
        time: new Date()
    });
});


// ==============================
// PREVIEW ROUTE
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

        res.json({
            status:"render-started",
            video:"processing"
        });

    }catch(err){

        console.error(err);
