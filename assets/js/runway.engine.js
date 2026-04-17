/* =====================================================
FILE: /assets/js/runway.engine.js
===================================================== */

export async function runRunway(endpoint,payload){

const res = await fetch(
"https://api.dev.runwayml.com"+endpoint,
{
method:"POST",
headers:{
"Authorization":"Bearer "+RUNWAY_API_KEY,
"X-Runway-Version":"2024-11-06",
"Content-Type":"application/json"
},
body:JSON.stringify(payload)
}
)

return res.json()

}
