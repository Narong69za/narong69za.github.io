/*
====================================================
ULTRA ENGINE MAP
SN DESIGN STUDIO — FINAL STRUCTURE
ADD ONLY SAFE VERSION
====================================================

หน้าที่:
- map template CTA → replicate model
- server.js จะ require ไฟล์นี้

IMPORTANT:
ห้ามเปลี่ยน key เพราะ create.html ยิง template key มาแล้ว
====================================================
*/

const ENGINE_MAP = {

  /*
  ==================================
  DANCE MOTION
  ==================================
  */

  "dance-motion":{

    name:"Dance Motion",

    /*
    ใส่ replicate model ที่คุณเลือกจริง
    ตัวอย่าง:
    "owner/model:version"
    */

    model:"REPLACE_WITH_REAL_MODEL",

    type:"video"

  },


  /*
  ==================================
  AI LIPSYNC
  ==================================
  */

  "ai-lipsync":{

    name:"AI LipSync",

    model:"REPLACE_WITH_REAL_MODEL",

    type:"video"

  },


  /*
  ==================================
  DARK VIRAL
  ==================================
  */

  "dark-viral":{

    name:"Dark Viral",

    model:"REPLACE_WITH_REAL_MODEL",

    type:"video"

  },


  /*
  ==================================
  FACE SWAP
  ==================================
  */

  "face-swap":{

    name:"Face Swap",

    model:"REPLACE_WITH_REAL_MODEL",

    type:"image"

  }

};


module.exports = ENGINE_MAP;
