require("dotenv").config();

const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());

/* ==============================
   STATIC ROOT SERVE
============================== */

app.use(express.static(__dirname)); // serve ROOT html

/* ==============================
   API ROUTER
============================== */

app.use('/api', require('./api/api.route'));

/* ==============================
   ROOT INDEX
============================== */

app.get('/', (req,res)=>{
   res.sendFile(path.join(__dirname,'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
   console.log("SN DESIGN SERVER RUNNING:",PORT);
});
