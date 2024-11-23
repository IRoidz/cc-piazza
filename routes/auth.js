const express = require('express')
const User = require('../models/User')
const router = express.Router()

router.post('/register', async(req,res)=>{
    
    const user = new User({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password
    })

    try{
        const usertoadd = user.save()
        res.send(usertoadd)
    }catch(err){
        res.status(400).send({message:err})
    }
})

module.exports = router