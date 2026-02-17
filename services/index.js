const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

const ROOT = path.join(__dirname,"..");

/* STATIC */

app.use("/assets", express.static(path.join(ROOT,"assets")));
app.use(express.static(ROOT));

/* ROOT */

app.get("/",(req,res)=>{
   res.sendFile(path.join(ROOT,"index.html"));
});

/* API */

app.post("/api/render",(req,res)=>{
   console.log("RENDER REQUEST OK");
   res.json({ status:"ok" });
});

/* AUTO HTML ROUTER */

app.get(/^\/(?!api).*/, (req,res,next)=>{

   let requestPath = req.path;

   if(!requestPath.includes(".")){
      requestPath += ".html";
   }

   const filePath = path.join(ROOT,requestPath);

   res.sendFile(filePath,(err)=>{
      if(err) next();
   });

});

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{
   console.log("ULTRA ROUTER READY",PORT);
});
