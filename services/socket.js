const WebSocket = require("ws");

let wss;

function startSocket(server){

   wss = new WebSocket.Server({server});

   wss.on("connection",(ws,req)=>{

      const adminKey = req.headers["x-admin"];

      if(adminKey !== "true"){
         ws.close();
         return;
      }

      ws.send(JSON.stringify({
         type:"system",
         message:"ULTRA ADMIN CONNECTED"
      }));

   });

}

function broadcast(data){

   if(!wss) return;

   wss.clients.forEach(client=>{
      if(client.readyState === 1){
         client.send(JSON.stringify(data));
      }
   });

}

module.exports = {startSocket,broadcast};
