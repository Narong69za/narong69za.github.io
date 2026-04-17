/* =====================================================
FILE: /assets/js/credit.engine.js
===================================================== */

import {CTA_MODEL_MASTER} from "./cta.model.master.js"

export function calculateCredit(cta,duration){

const model = CTA_MODEL_MASTER[cta]

let credit = model.credit_base || 0

if(model.credit_per_sec && duration){

credit += duration * model.credit_per_sec

}

return credit

}
