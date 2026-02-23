const express = require("express");
const router = express.Router();
const multer = require("multer");

const createController = require("../controllers/create.controller");

const upload = multer({

   storage:multer.memoryStorage()

});

/*
ULTRA AUTO ENGINE PIPELINE

รับ dynamic files:

template
subject
source
target
image
video
voice
*/

router.post(

   "/render",

   upload.fields([

      { name:"template" },
      { name:"subject" },
      { name:"source" },
      { name:"target" },
      { name:"image" },
      { name:"video" },
      { name:"voice" }

   ]),

   createController.create

);

module.exports = router;
