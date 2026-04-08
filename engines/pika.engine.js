export async function generate(payload){

 const res=await fetch("/api/pika/generate",{
  method:"POST",
  headers:{ "Content-Type":"application/json" },
  body:JSON.stringify(payload)
 })

 return res.json()

}
