const express = require('express')
const User = require('../models/User')
const router = express.Router()
const {registerValidation} = require('../validations/validation')
const bcryptjs = require('bcryptjs')

router.post('/register', async(req,res)=>{

    //Validation to check user input
    const {error} = registerValidation(req.body)
    if (error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    //Validation to check is user already exists
    const userExsists = await User.findOne({email:req.body.email})
    if (userExsists){
        return res.status(400).send({message:'User already exists'})
    }

    const salt = await bcryptjs.genSalt(5)
    const hashedPassword = await bcryptjs.hash(req.body.password,salt)
    
    //code to insert user data
    const user = new User({
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword
    })

    try{
        const usertoadd = user.save()
        res.send({
            message: "User registered successfully!",
            user: {
                username: user.username,
                email: user.email,
            },
        })
    }catch(err){
        res.status(400).send({message:err})
    }
})

module.exports = router