let STATE={
engine:"replicate",
mode:"generate",
type:"video"
};

const fileA=document.getElementById("fileA");
const fileB=document.getElementById("fileB");

const previewRedVideo=document.getElementById("preview-red-video");
const previewRedImage=document.getElementById("preview-red-image");

const previewBlueVideo=document.getElementById("preview-blue-video");
const previewBlueImage=document.getElementById("preview-blue-image");

function preview(file,videoEl,imageEl){

if(!file) return;

const url=URL.createObjectURL(file);

if(file.type.startsWith("video/")){
videoEl.src=url;
videoEl.style.display="block";
imageEl.style.display="none";
}

if(file.type.startsWith("image/")){
imageEl.src=url;
imageEl.style.display="block";
videoEl.style.display="none";
}

}

fileA?.addEventListener("change",()=>{
preview(fileA.files[0],previewRedVideo,previewRedImage);
});

fileB?.addEventListener("change",()=>{
preview(fileB.files[0],previewBlueVideo,previewBlueImage);
});
