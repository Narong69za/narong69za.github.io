/* =====================================================
FILE: /assets/js/upload.service.js
===================================================== */

export async function uploadFile(file){

const res = await fetch(
"https://api.dev.runwayml.com/v1/uploads",
{
method:"POST",
headers:{
"Authorization":"Bearer "+RUNWAY_API_KEY,
"X-Runway-Version":"2024-11-06",
"Content-Type":"application/json"
},
body:JSON.stringify({
filename:file.name,
type:"ephemeral"
})
}
)

return res.json()

}
