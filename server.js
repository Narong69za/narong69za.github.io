require("dotenv").config();

const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());

app.use(express.static(__dirname)); // serve html root

app.use('/api', require('./api/api.route'));

app.get('/', (req,res)=>{
   res.sendFile(path.join(__dirname,'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
   console.log("SN DESIGN SERVER RUNNING:",PORT);
});
