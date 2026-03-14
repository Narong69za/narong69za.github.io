/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: LICENSE GENERATOR ENGINE
 * VERSION: 1.0
 * STATUS: ACTIVE
 * =====================================================
 */

function generatePRO(){

const device=navigator.userAgent.slice(0,10)

const date=new Date().toISOString().split("T")[0]

const key="SN-PRO-"+device+"-"+date+"-30D"

document.getElementById("generated-key").value=key

}


function generatePREMIUM(){

const device=navigator.userAgent.slice(0,10)

const date=new Date().toISOString().split("T")[0]

const key="SN-PREMIUM-"+device+"-"+date+"-30D"

document.getElementById("generated-key").value=key

}
