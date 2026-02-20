const fs = require("fs");
const path = require("path");

/*
=====================================
TRACE START
=====================================
*/

console.log("=== PRESET LOADER START ===");

const presetDir = path.resolve(process.cwd(),"presets");

console.log("PRESET DIR PATH:", presetDir);

const presets = {};

try{

   const files = fs.readdirSync(presetDir);

   console.log("FILES FOUND:", files);

   files.forEach(file => {

      if(!file.endsWith(".js")) return;

      try{

         const fullPath = path.join(presetDir,file);

         console.log("LOADING FILE:", fullPath);

         const preset = require(fullPath);

         console.log("LOADED PRESET:", preset?.id);

         if(preset && preset.id){
            presets[preset.id] = preset;
         }

      }catch(e){
         console.log("PRESET LOAD ERROR:",file,e.message);
      }

   });

}catch(e){

   console.log("PRESET DIR ERROR:",e.message);

}

console.log("FINAL PRESETS OBJECT:", presets);
