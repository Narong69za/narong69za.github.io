const fs = require("fs");
const path = require("path");

const presetDir = path.resolve(process.cwd(),"presets");

const presets = {};

try{

   const files = fs.readdirSync(presetDir);

   files.forEach(file => {

      if(!file.endsWith(".js")) return;

      try{

         const fullPath = path.join(presetDir,file);

         const preset = require(fullPath);

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

module.exports = presets;
