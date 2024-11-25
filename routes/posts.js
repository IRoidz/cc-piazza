const express = require('express')
const router = express.Router()

const Post = require('../models/Post')

const verify = require('../verifyToken')

const {postValidation} = require('../validations/validation')

// router.get('/', async(req,res)=>{
//     try{
//         const posts = await Post.find()
//         res.send(posts)
//     }catch(err){
//         res.status(400).send({message:err})
//     }
// })

router.get('/', async(req,res)=>{
    const topics = req.query.topics
    if (!topics) {
        return res.status(400).send({message: err.message})
    }

    const topicList = topics.split(',')
    try{
        const posts = await Post.find({ topic: { $in: topicList } })
        //const posts = await Post.find({ topic: { $regex: new RegExp(`^${topic}$`, 'i') } });
        res.send(posts)
    }catch(err){
        res.status(400).send({message:err})
    }
})

router.post('/', verify, async(req,res)=>{

    const {error} = postValidation(req.body)
    if (error){
       return res.status(400).send({message:error['details'][0]['message']})
   }

    const post = Post({
        title: req.body.title,
        topic: req.body.topic,
        body: req.body.body,
        owner: req.user._id
    })
    try{
        const savedPost = await post.save()
        return res.send(savedPost)
    }catch(err){
        res.status(400).send({message:err})
    }
})

module.exports = router