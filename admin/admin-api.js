async function adminFetch(url){

   const res=await fetch(url,{
      headers:window.ADMIN_HEADERS
   });

   return await res.json();
}
