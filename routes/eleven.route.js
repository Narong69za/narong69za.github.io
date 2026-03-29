/**
=====================================================
PROJECT: SN DESIGN STUDIO
MODULE: routes/eleven.route.js
VERSION: v1.0.0
STATUS: production
LAYER: API ROUTE

AUTHOR: SN DESIGN ENGINE SYSTEM
CREATED: 2026

RESPONSIBILITY:
- expose ElevenLabs provider API
- receive frontend request
- route to eleven.service.js
- return generated audio buffer

SUPPORTED ENGINE:
ENGINE 12  → multilingual_v2
ENGINE 13  → text_to_sound_v2
ENGINE 14  → sts_v2

DEPENDENCIES:
services/eleven.service.js

ENDPOINT:
POST /api/eleven

REQUEST BODY:
{
  "model": "multilingual_v2",
  "payload": {
      "prompt": "hello world"
  }
}

RESPONSE:
audio/mpeg buffer

=====================================================
*/

import express from "express"
import { runEleven } from "../services/eleven.service.js"

const router = express.Router()

router.post("/eleven", async (req, res) => {

  try {

    const { model, payload } = req.body

    if (!model) {

      return res.status(400).json({
        error: "MODEL_REQUIRED"
      })

    }

    const audioBuffer = await runEleven(model, payload)

    res.setHeader("Content-Type", "audio/mpeg")

    return res.send(audioBuffer)

  } catch (error) {

    console.error("ELEVEN ROUTE ERROR", error)

    return res.status(500).json({
      error: "ELEVEN_API_FAILED"
    })

  }

})

module.exports = router
