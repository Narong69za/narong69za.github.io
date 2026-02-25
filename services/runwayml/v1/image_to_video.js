const axios = require("axios");

exports.run = async ({ prompt, files }) => {

   if (!files || Object.keys(files).length === 0) {
      throw new Error("No file uploaded");
   }

   // 🔥 AUTO PICK FILE (ไม่ต้องสนชื่อ fileA แล้ว)
   const file = files.fileA || Object.values(files)[0];

   if (!file) {
      throw new Error("Image file missing");
   }

   const base64Image = file.buffer.toString("base64");

   const response = await axios.post(
      "https://api.runwayml.com/v1/image_to_video",
      {
         model: "gen-3a-turbo",
         prompt: prompt || "cinematic motion",
         image: `data:${file.mimetype};base64,${base64Image}`
      },
      {
         headers: {
            Authorization: `Bearer ${process.env.RUNWAY_API_KEY}`,
            "Content-Type": "application/json"
         }
      }
   );

   return response.data;
};
