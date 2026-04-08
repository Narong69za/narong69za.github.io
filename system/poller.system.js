export function startPolling(taskId,callback){

 const interval=setInterval(async()=>{

  const res=await fetch("/api/runway/task/"+taskId)

  const data=await res.json()

  if(data.status==="SUCCEEDED"){

   clearInterval(interval)
   callback(data)

  }

  if(data.status==="FAILED"){

   clearInterval(interval)

  }

 },5000)

}
