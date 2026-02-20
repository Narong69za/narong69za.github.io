const fs = require("fs");
const path = require("path");

const presetDir = path.join(__dirname,"../presets");

const presets = {};

fs.readdirSync(presetDir).forEach(file => {

   if(file.endsWith(".js")){

      const preset = require(path.join(presetDir,file));

      if(!preset.id){
         throw new Error("PRESET ID MISSING IN "+file);
      }

      presets[preset.id] = preset;

   }

});

module.exports = presets;
