const fs = require("fs");
const path = require("path");
const MODEL_ROUTER = require("./preset.map");

const presetDir = path.resolve(process.cwd(),"presets");

const presets = {};

fs.readdirSync(presetDir).forEach(file=>{

   if(!file.endsWith(".js")) return;

   const preset = require(path.join(presetDir,file));

   if(!preset || !preset.id) return;

   const modelConfig = MODEL_ROUTER[preset.id];

   if(!modelConfig){
      console.log("MODEL NOT FOUND:",preset.id);
      return;
   }

   presets[preset.id] = {
      ...preset,
      ...modelConfig
   };

   console.log("PRESET LOADED:",preset.id);

});

module.exports = presets;
