const express = require("express");
const cors = require("cors");

const { create } = require("../controllers/create.controller");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/render", create);

const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
   console.log("ULTRA ENGINE RUNNING:",PORT);
});
