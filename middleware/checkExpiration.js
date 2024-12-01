const Post = require('../models/Post')

const checkExpiration = async(req,res,next)=>{
    try{
        const now = new Date()

        await Post.updateMany(
            {expiration: {$lte: now}, status: 'live'},
            {$set: {status: 'expired'}}
        )
        next()
    }catch(err){
        return res.status(500).send({message: err.message})
    }
}

module.exports = checkExpiration