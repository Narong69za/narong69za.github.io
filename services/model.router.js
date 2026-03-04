import * as runway from "../engines/runway.engine.js"
import * as replicate from "../engines/replicate.engine.js"
import * as pika from "../engines/pika.engine.js"
import * as leonardo from "../engines/leonardo.engine.js"

export async function runModel(engine,payload){

 if(engine==="runway") return runway.generate(payload)
 if(engine==="replicate") return replicate.generate(payload)
 if(engine==="pika") return pika.generate(payload)
 if(engine==="leonardo") return leonardo.generate(payload)

 throw new Error("ENGINE NOT FOUND")

}
