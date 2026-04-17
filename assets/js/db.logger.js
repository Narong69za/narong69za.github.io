/* =====================================================
FILE: /assets/js/db.logger.js
===================================================== */

export function logTask(data){

console.log("TASK LOG",{

task_id:data.id,
model:data.model,
status:data.status,
created:data.createdAt

})

}
