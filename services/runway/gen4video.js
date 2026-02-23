exports.run = async ({alias,type,prompt,files,jobID})=>{

   /*
   ULTRA ENGINE MAP
   */

   const MODE_MAP = {

      "dance-motion":"motion_clone",
      "face-swap":"face_swap",
      "dark-viral":"image_to_video",
      "ai-lipsync":"lip_sync"

   };

   const mode = MODE_MAP[alias];

   if(!mode){

      throw new Error("RUNWAY MODE NOT SUPPORTED");

   }

   /*
   MOCK CALL (replace with real runway API later)
   */

   console.log("RUNWAY EXEC:",mode);

   return true;

};
