/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: controllers/runway.controller.js
VERSION: v1.0.0
STATUS: production
===================================================== */

const runwayService = require("../services/runway.service")

exports.upload = async (req,res)=>{

    try{

        const uri = await runwayService.upload(req)

        res.json({
            success:true,
            uri
        })

    }catch(err){

        console.error(err)

        res.status(500).json({
            success:false
        })

    }

}

exports.generate = async (req,res)=>{

    try{

        const task = await runwayService.generate(req.body)

        res.json(task)

    }catch(err){

        console.error(err)

        res.status(500).json({
            success:false
        })

    }

}

exports.task = async (req,res)=>{

    try{

        const data = await runwayService.getTask(req.params.id)

        res.json(data)

    }catch(err){

        console.error(err)

        res.status(500).json({
            success:false
        })

    }

}
