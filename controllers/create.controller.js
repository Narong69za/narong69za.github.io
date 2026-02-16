const MODEL_ROUTER = require('../config/model.router');
const aiService = require('../services/ai.service');

module.exports = async (req,res)=>{

    const { model, input } = req.body;

    const config = MODEL_ROUTER[model];

    if(!config){
        return res.status(400).json({error:"Model not found"});
    }

    const result = await aiService.run(config.model, input);

    res.json(result);
}
