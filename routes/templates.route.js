const express = require("express");
const router = express.Router();

const presetMap = require("../services/preset.map");

/*
=====================================
ULTRA AUTO PRESET SYSTEM
=====================================
*/

/* GET ALL PRESETS (AUTO SCAN) */

router.get("/",(req,res)=>{

    res.json({
        success:true,
        presets:presetMap
    });

});

/* GET SINGLE PRESET */

router.get("/:slug",(req,res)=>{

    const slug = req.params.slug;

    const preset = presetMap[slug];

    if(!preset){

        return res.status(404).json({
            error:"preset not found"
        });

    }

    res.json(preset);

});

module.exports = router;
