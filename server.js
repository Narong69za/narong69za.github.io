const express = require("express");

const renderRoute = require("./routes/render");
const statusRoute = require("./routes/status");

require("./db/db");

const app = express();

app.use(express.json());

app.use("/api/render",renderRoute);
app.use("/api/status",statusRoute);

app.listen(process.env.PORT || 10000,()=>{

   console.log("ULTRA ENGINE LOCK ACTIVE");

});
