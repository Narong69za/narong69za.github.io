const tasks=new Map()

export async function createTask(id,engine){

 tasks.set(id,{
  id,
  engine,
  status:"PENDING"
 })

}

export async function getTask(id){

 return tasks.get(id)

}
