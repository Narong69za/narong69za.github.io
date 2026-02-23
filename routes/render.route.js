const express = require("express");
const router = express.Router();
const db = require("../db/db");
const multer = require("multer");


// ======================
// MULTER CONFIG
// ======================

const storage = multer.memoryStorage();

const upload = multer({
   storage: storage,
   limits: {
      fileSize: 1024 * 1024 * 500 // 500MB
   }
});


// รับไฟล์ทุก field
const uploadAny = upload.any();


// ======================
// RENDER ROUTE
// ======================

router.post("/render", uploadAny, (req,res)=>{

   try{

      const engine = req.body.engine;
      const alias = req.body.alias;
      const type = req.body.type;
      const prompt = req.body.prompt || "";

      if(!engine || !alias){

         return res.status(400).json({
            status:"error",
            message:"missing engine or alias"
         });

      }

      const id = Date.now().toString();

      // DEBUG LOG (สำคัญมาก)
      console.log("ENGINE:",engine);
      console.log("ALIAS:",alias);
      console.log("FILES:",req.files?.map(f=>f.fieldname));

      db.run(
         "INSERT INTO projects (id,engine,prompt,status) VALUES (?,?,?,?)",
         [id,engine,prompt,"queued"],
         (err)=>{

            if(err){

               console.error(err);

               return res.status(500).json({
                  status:"error",
                  message:err.message
               });

            }

            res.json({
               status:"queued",
               id:id
            });

         }
      );

   }catch(err){

      console.error(err);

      res.status(500).json({
         status:"error",
         message:"internal error"
      });

   }

});

module.exports = router;
