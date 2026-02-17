const db = require("../db/db");

exports.createProject = (data)=>{

   return new Promise((resolve,reject)=>{

      const id = "job_"+Date.now();

      db.run(
      `INSERT INTO projects
      (id,templateID,engine,duration,status,progress,creditUsed,eta)
      VALUES (?,?,?,?,?,?,?,?)`,
      [
         id,
         data.templateID,
         data.engine || "motion-ai",
         data.duration || 30,
         "queued",
         0,
         0,
         "waiting"
      ],
      err=>{
         if(err) reject(err);
         else resolve(id);
      });

   });

};

exports.getProject = (id)=>{

   return new Promise((resolve,reject)=>{

      db.get(
         `SELECT * FROM projects WHERE id=?`,
         [id],
         (err,row)=>{
            if(err) reject(err);
            else resolve(row);
         });

   });

};
