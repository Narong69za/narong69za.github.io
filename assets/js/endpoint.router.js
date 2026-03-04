/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: endpoint.router.js
VERSION: v9.0.0
STATUS: production
LAYER: api-router

CREATED: 2026
AUTHOR: SN DESIGN ENGINE SYSTEM

RESPONSIBILITY:
- route CTA engine → API endpoint
- read model config from CTA_MODEL_MASTER
- provide endpoint + method + provider mapping

USED BY:
- payload.builder.js
- runway.service.js
- create.js

DEPENDS ON:
- /assets/js/cta.model.master.js

DESCRIPTION:
Central routing layer that maps UI CTA engine IDs
to their respective AI provider endpoints.

This ensures the UI (ENGINE 1-14) connects
correctly to Runway / Replicate / Pika / Leonardo
without hardcoding endpoints inside services.

===================================================== */

import { CTA_MODEL_MASTER } from "./cta.model.master.js"

export function getEndpointConfig(ctaId){

    const cfg = CTA_MODEL_MASTER[ctaId]

    if(!cfg){

        throw new Error("Invalid CTA ID: "+ctaId)

    }

    return {

        provider: cfg.provider || cfg.engine || "runway",

        endpoint: cfg.endpoint || null,

        method: cfg.method || "POST",

        model: cfg.model || null,

        task_endpoint: cfg.task_endpoint || "/v1/tasks/{id}"

    }

}
