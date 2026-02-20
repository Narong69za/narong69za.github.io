/*
=====================================
ULTRA ROUTER MASTER FIX
SN DESIGN TEMPLATE ROUTER
=====================================
*/

const express = require("express");
const router = express.Router();

const presetMap = require("../services/preset.map");

/* =====================================
LOAD ALL PRESETS (MASTER MODE)
===================================== */

router.get("/", (req,res)=>{

    res.json({
        success:true,
        presets: presetMap
    });

});

/* =====================================
LOAD SINGLE PRESET
===================================== */

router.get("/:slug",(req,res)=>{

    const slug = req.params.slug;

    const preset = presetMap[slug];

    if(!preset){

        return res.status(404).json({
            error:"preset not found",
            available:Object.keys(presetMap)
        });

    }

    res.json(preset);

});

module.exports = router;
