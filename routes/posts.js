const express = require('express')
const router = express.Router()

const Post = require('../models/Post')
const verify = require('../verifyToken')
const checkExpiration = require('../checkExpiration')
const {postValidation} = require('../validations/validation')
const checkPostStatus = require('../checkPostStatus')


//view all posts, dynamic endpoint for filtering by topic type (inclusive)
router.get('/', verify, checkExpiration, async(req,res)=>{
    const topics = req.query.topics
    let filter = {status: 'live'}

    // allows filter to be empty, which gives us all posts if we need
    if (topics) {
        const topicList = topics.split(',')
        filter.topic = {$in: topicList}
    }
    try{
        const posts = await Post.find(filter)
        res.send(posts)
    }catch(err){
        res.status(400).send({message:err})
    }
})

router.get('/expired', verify, checkExpiration, async(req,res)=>{
    const topics = req.query.topics
    let filter = {status: 'expired'}

    // allows filter to be empty, which gives us all posts if we need
    if (topics) {
        const topicList = topics.split(',')
        filter.topic = {$in: topicList}}

    try{
        const posts = await Post.find(filter)
        res.send(posts)
    }catch(err){
        res.status(400).send({message:err})
    }
})

router.get('/most-active', verify, async(req,res)=>{
    try{
        //if there are topics in the query then split into array or else return empty array
        const topics = req.query.topics ? req.query.topics.split(',') : []
        //if topics isnt empty then we make filter for those topics or we return empty
        const filter = topics.length > 0 ? {topic: {$in: topics}} : {}

        //create an aggregate to sort by total likes and dislieks by adding a new field totalreactions and sorting it by highest
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
router.post('/:postId/comments', verify, checkExpiration, checkPostStatus, async(req,res)=>{

    try{
        const post = await Post.findById(req.params.postId)
        if (!post) return res.status(404).send({message: 'Post not found'})

        post.comments.push({
            user: req.user._id,
            username: req.user.username,
            comment: req.body.comment,
        })

        const timeLeft = Math.max(0, Math.floor((post.expiration - Date.now()) / 1000)) + ' seconds'

        post.interactions.push({
            user: req.user._id,
            username: req.user.username,
            type: 'comment',
            interactedAt: new Date(),
            timeLeft,
        })

        const savedComment = await post.save()
        res.status(201).send({savedComment})
    }catch(err){
        console.log(err)
        res.status(500).send({message:'error'})
    }
})

// made liking and disliking into one route react for simplicity
router.post('/:postId/react', verify, checkExpiration, checkPostStatus, async(req,res)=>{
    const reaction = req.body.reaction

    if (!['like', 'dislike'].includes(reaction)) {
        return res.status(400).send({ message: 'Invalid reaction type' });
    }

    try{
        const post = await Post.findById(req.params.postId)
        console.log('req.user:', req.user)
        if (!post) return res.status(404).send({message: 'Post not found'})
        
        if (reaction === 'like') {
            post.likes += 1
        } else if (reaction === 'dislike') {
            post.dislikes += 1
        }

        const timeLeft = Math.max(0, Math.floor((post.expiration - Date.now()) / 1000)) + ' seconds'

        post.interactions.push({
            user: req.user._id,
            username: req.user.username,
            type: reaction,
            interactedAt: new Date(),
            timeLeft,
        })

        const savedReaction = await post.save()
        res.status(201).send({savedReaction})
    }catch(err) {
        console.error(err)
        res.status(500).send({message:'error'})
    }
})

module.exports = router