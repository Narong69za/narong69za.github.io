console.log("API CORE LOADED");

window.API_BASE = "https://sn-design-api.onrender.com";

window.apiFetch = async function(endpoint, options = {}) {

   try{

      const res = await fetch(window.API_BASE + endpoint,{
         headers:{
            "Content-Type":"application/json"
         },
         ...options
      });

      return await res.json();

   }catch(err){

      console.error("API ERROR:",err);

   }

}
