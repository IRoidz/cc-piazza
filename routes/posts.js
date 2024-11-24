const express = require('express')
const router = express.Router()

const Post = require('../models/Post')

router.get('/', async(req,res)=>{
    try{
        const posts = await Post.find()
        res.send(posts)
    }catch(err){
        res.status(400).send({message:err})
    }
})

router.post('/', async(req,res)=>{
    const post = Post({
        title: req.body.title,
        topic: req.body.topic,
        body: req.body.body,
        owner: req.body.owner,
    })
    try{
        const savedPost = await post.save()
        return res.send(savedPost)
    }catch(err){
        res.status(400).send({message:err})
    }
})

module.exports = router