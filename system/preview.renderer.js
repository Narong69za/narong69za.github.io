export function renderOutput(output){

 const video=document.getElementById("preview-red-video")
 const image=document.getElementById("preview-red-image")

 if(output.endsWith(".mp4")){

  video.src=output
  video.style.display="block"
  image.style.display="none"

 }
 else{

  image.src=output
  image.style.display="block"
  video.style.display="none"

 }

}
