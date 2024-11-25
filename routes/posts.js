const express = require('express')
const router = express.Router()

const Post = require('../models/Post')
const verify = require('../verifyToken')
const {postValidation} = require('../validations/validation')


//view all messages, dynamic endpoint for filtering by topic type (inclusive)
router.get('/', verify, async(req,res)=>{
    const topics = req.query.topics
    let filter = {}

    // allows filter to be empty, which gives us all posts if we need
    if (topics) {
        const topicList = topics.split(',')
        filter = {topic: { $in: topicList}}
    }

    try{
        const posts = await Post.find(filter)
        res.send(posts)
    }catch(err){
        res.status(400).send({message:err})
    }
})

// route to make a post
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

router.post('/:postId/comments', verify, async(req,res)=>{

    try{
        const post = await Post.findById(req.params.postId)
        if (!post) return res.status(404).send({message: 'Post not found'})

        post.comments.push({
            user: req.user._id,
            comment: req.body.comment,
        })

        await post.save()
        res.status(201).send({message: 'comment added'})
    }catch(err){
        res.status(500).send({message: err.message})
    }
})

module.exports = router