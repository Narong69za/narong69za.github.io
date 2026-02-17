module.exports = {

   async run(job){

      console.log("ENGINE START:",job.engine);

      // simulate render process
      for(let i=1;i<=10;i++){

         await new Promise(r=>setTimeout(r,500));

      }

      return {

         status:"complete",
         progress:100

      };

   }

};
