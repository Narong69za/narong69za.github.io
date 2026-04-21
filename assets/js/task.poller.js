/* =====================================================
FILE: /assets/js/task.poller.js
===================================================== */

export async function pollTask(taskId){

while(true){

const res = await fetch(
"https://api.dev.runwayml.com/v1/tasks/"+taskId,
{
headers:{
"x-session-id":"Bearer "+RUNWAY_API_KEY,
"X-Runway-Version":"2024-11-06"
}
}
)

const data = await res.json()

if(data.status==="SUCCEEDED") return data
if(data.status==="FAILED") throw new Error(data.failure)

await new Promise(r=>setTimeout(r,5000))

}

}
