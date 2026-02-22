const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

   destination:function(req,file,cb){

      cb(null,"storage/input/");

   },

   filename:function(req,file,cb){

      const name = Date.now()+"-"+file.originalname;
      cb(null,name);

   }

});

const upload = multer({ storage });

module.exports = upload;
