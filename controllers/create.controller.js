const modelRouter = require("../models/model.router");

exports.create = async (req,res)=>{

   try{

      const { engine, alias, type, prompt } = req.body;

      const user = { id:"DEV-BYPASS" };

      const files = {};

      if(req.files){
         req.files.forEach(f=>{
            files[f.fieldname] = f;
         });
      }

      console.log("FILES DEBUG:", Object.keys(files));

      if(!files.fileA){
         throw
