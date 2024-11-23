const express = require('express')
const router = express.Router()

const User = require('../models/User')
const verify = require('../verifyToken')

router.get('/', verify, async(req,res)=>{
    try{
        const users = await User.find()
        res.send(users)
    }catch(err){
        res.status(400).send({message:err})
    }
})

module.exports = router