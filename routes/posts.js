const express = require('express')
const router = express.Router()

const Post = require('../models/Post')
const verify = require('../verifyToken')
const {postValidation} = require('../validations/validation')


//view all posts, dynamic endpoint for filtering by topic type (inclusive)
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

router.get('/most-active', verify, async(req,res)=>{
    try{
        const topics = req.query.topics ? req.query.topics.split(',') : []
        const filter = topics.length > 0 ? {topic: {$in: topics}} : {}

        const posts = await Post.aggregate([
            {$match: filter},
            {$addFields: {totalReactions: {$add: ['$likes', '$dislikes']}}},
            {$sort: {totalReactions: -1}}
        ])
        
        res.status(200).send(posts)
    }catch(err){
        res.status(500).send({message: err})
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

//posting comments using the post id
router.post('/:postId/comments', verify, async(req,res)=>{

    try{
        const post = await Post.findById(req.params.postId)
        if (!post) return res.status(404).send({message: 'Post not found'})

        post.comments.push({
            user: req.user._id,
            comment: req.body.comment,
        })

        const savedComment = await post.save()
        res.status(201).send({savedComment})
    }catch(err){
        res.status(500).send({message:err})
    }
})

// made liking and disliking into one route react for simplicity
router.post('/:postId/react', verify, async(req,res)=>{
    const reaction = req.body.reaction

    if (!['like', 'dislike'].includes(reaction)) {
        return res.status(400).send({ message: 'Invalid reaction type' });
    }

    try{
        const post = await Post.findById(req.params.postId)
        if (!post) return res.status(404).send({message: 'Post not found'})
        
        if (reaction === 'like') {
            post.likes += 1
        } else if (reaction === 'dislike') {
            post.dislikes += 1
        }
        const savedReaction = await post.save()
        res.status(201).send({savedReaction})
    }catch(err) {
        res.status(500).send({message:err})
    }
})

module.exports = router