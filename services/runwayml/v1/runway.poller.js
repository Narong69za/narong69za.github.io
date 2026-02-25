// =====================================================
// SN DESIGN ENGINE AI
// RUNWAY POLLER — FULL VERSION
// CHECK TASK STATUS UNTIL COMPLETE
// =====================================================

const axios = require("axios");

const RUNWAY_STATUS_ENDPOINT =
  "https://api.dev.runwayml.com/v1/tasks";

const HEADERS = {

   Authorization: `Bearer ${process.env.RUNWAY_API_KEY}`,
   "X-Runway-Version": "2024-11-06",
   "Content-Type": "application/json"

};


// =====================================================
// GET TASK STATUS
// =====================================================

async function getTask(taskId){

   const res = await axios.get(

      `${RUNWAY_STATUS_ENDPOINT}/${taskId}`,

      { headers: HEADERS }

   );

   return res.data;
}


// =====================================================
// POLL UNTIL COMPLETE
// =====================================================

async function poll(taskId, {

   interval = 5000,     // เช็คทุก 5 วิ
   timeout = 300000     // timeout 5 นาที

} = {}){

   const start = Date.now();

   while(true){

      const task = await getTask(taskId);

      console.log("RUNWAY STATUS:", task.status);

      // ===============================
      // SUCCESS
      // ===============================

      if(task.status === "SUCCEEDED"){

         return task;
      }

      // ===============================
      // FAIL
      // ===============================

      if(task.status === "FAILED"){

         throw new Error("RUNWAY TASK FAILED");
      }

      // ===============================
      // TIMEOUT
      // ===============================

      if(Date.now() - start > timeout){

         throw new Error("RUNWAY POLLER TIMEOUT");
      }

      await new Promise(r => setTimeout(r, interval));
   }
}


module.exports = {

   poll

};
