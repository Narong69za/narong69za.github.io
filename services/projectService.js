const db = require("../db/db");

module.exports = {

   create(job){

      return new Promise((resolve,reject)=>{

         db.run(
            `INSERT INTO jobs VALUES(?,?,?,?,?,?,?)`,
            [
               job.id,
               job.templateID,
               job.engine,
               job.duration,
               "queued",
               0,
               Date.now()
            ],
            err=> err ? reject(err) : resolve(job)
         );

      });

   },

   update(id,data){

      return new Promise((resolve,reject)=>{

         db.run(
            `UPDATE jobs SET status=?, progress=? WHERE id=?`,
            [data.status,data.progress,id],
            err=> err ? reject(err) : resolve()
         );

      });

   },

   get(id){

      return new Promise((resolve,reject)=>{

         db.get(
            `SELECT * FROM jobs WHERE id=?`,
            [id],
            (err,row)=> err ? reject(err) : resolve(row)
         );

      });

   }

};
