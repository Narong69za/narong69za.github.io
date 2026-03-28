/* =====================================================
MODULE: runway.engine
===================================================== */

import { createTask } from "../services/task.service.js"

export async function generate(payload){

 const res=await fetch("https://api.dev.runwayml.com/v1/image_to_video",{

  method:"POST",

  headers:{
   "Authorization":"Bearer "+process.env.RUNWAY_API_KEY,
   "X-Runway-Version":"2024-11-06",
   "Content-Type":"application/json"
  },

  body:JSON.stringify({

   promptText:payload.promptText,
   ratio:"1280:720",
   duration:4,
   model:"gen4.5"

  })

 })

 const data=await res.json()

 await createTask(data.id,"runway")

 return data
}
