function errHandle(err,req,res,next){
    if(err){
        res.status(500).json({
            error:{
                message : "Something went wrong..."
            }
        })
    }
}

module.exports = errHandle