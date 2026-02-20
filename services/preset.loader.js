const fs = require("fs");
const path = require("path");

console.log("=== PRESET LOADER START ===");

/*
====================================================
USE STABLE PATH (NO process.cwd())
====================================================
*/

const presetDir = path.join(__dirname, "../presets");

console.log("PRESET DIR PATH:", presetDir);

const presets = {};

try {

   if (!fs.existsSync(presetDir)) {
      console.log("PRESET DIR NOT FOUND");
   } else {

      const files = fs.readdirSync(presetDir);

      console.log("FILES FOUND:", files);

      files.forEach(file => {

         if (!file.endsWith(".js")) return;

         try {

            const fullPath = path.join(presetDir, file);

            console.log("LOADING FILE:", fullPath);

            const preset = require(fullPath);

            if (preset && preset.id) {

               presets[preset.id] = preset;

               console.log("LOADED PRESET:", preset.id);

            } else {

               console.log("INVALID PRESET FORMAT:", file);

            }

         } catch (e) {

            console.log("PRESET LOAD ERROR:", file, e.message);

         }

      });

   }

} catch (e) {

   console.log("PRESET DIR ERROR:", e.message);

}

console.log("FINAL PRESETS OBJECT:", presets);

module.exports = presets;
