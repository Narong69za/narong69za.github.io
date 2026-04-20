module.exports = function adminGuard(req,res,next){

    const key = req.headers["x-admin-key"];

    if(key !== "ULTRA_ENGINE_DEV"){
        return res.status(403).json({error:"blocked"});
    }

    next();
}
