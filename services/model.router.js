/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: services/model.router.js
VERSION: v1.0.0
STATUS: production
RESPONSIBILITY:
- route model request to correct engine provider
===================================================== */

const runwayService = require("./runway.service")
// future engines
// const replicateService = require("./replicate.service")
// const pikaService = require("./pika.service")
// const leonardoService = require("./leonardo.service")
// const elevenService = require("./eleven.service")
// const geminiService = require("./gemini.service")

async function routeGenerate(payload){

    const engine = payload.engine

    switch(engine){

        case "runway":
            return await runwayService.generate(payload)

        case "replicate":
            throw new Error("Replicate engine not implemented yet")

        case "pika":
            throw new Error("Pika engine not implemented yet")

        case "leonardo":
            throw new Error("Leonardo engine not implemented yet")

        case "system":
            throw new Error("System engine reserved")

        default:
            throw new Error("Unknown engine")

    }

}

module.exports = {
    routeGenerate
}
