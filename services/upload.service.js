export async function uploadFile(file){

 const res=await fetch("/api/upload",{

  method:"POST",
  body:file

 })

 return res.json()

}
