const express = require("express");
const router = express.Router();
const presetMap = require("../services/preset.map");

/* LIST ALL PRESETS */
router.get("/", (req, res) => {
    const list = Object.keys(presetMap).map(key => ({
        id: key,
        ...presetMap[key]
    }));

    res.json(list);
});

/* GET SINGLE PRESET */
router.get("/:slug", (req, res) => {

    const slug = req.params.slug;
    const preset = presetMap[slug];

    if (!preset) {
        return res.status(404).json({
            error: "preset not found"
        });
    }

    res.json(preset);
});

module.exports = router;
