const fs = require("fs");
const path = require("path");

console.log("=== PRESET LOADER START ===");

/*
=====================================
IMPORTANT:
ใช้ process.cwd() เพื่อให้ Render หา path ถูก
=====================================
*/

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

         if(preset && preset.id){

            presets[preset.id] = preset;

            console.log("LOADED PRESET:", preset.id);
         }

      }catch(e){

         console.log("PRESET LOAD ERROR:",file,e.message);
      }

   });

}catch(e){

   console.log("PRESET DIR ERROR:",e.message);

}

console.log("FINAL PRESETS OBJECT:", presets);

module.exports = presets;
