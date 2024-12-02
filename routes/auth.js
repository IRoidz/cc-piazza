const express = require('express')
const User = require('../models/User')
const router = express.Router()

const {registerValidation, loginValidation} = require('../validations/validation')

const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

router.post('/register', async(req,res)=>{

    //Validation to check user input
    const {error} = registerValidation(req.body)
    if (error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    //Validation to check is user already exists
    const userExists = await User.findOne({email:req.body.email})
    if (userExists){
        return res.status(400).send({message:'User already exists'})
    }

    //generate a hashed password with salt for enhanced security
    const salt = await bcryptjs.genSalt(5)
    const hashedPassword = await bcryptjs.hash(req.body.password,salt)
    
    //code to insert user data
    const user = new User({
        username: req.body.username.toLowerCase(),
        email: req.body.email.toLowerCase(),
        password: hashedPassword
    })

    try{
        const savedUser = await user.save()
        return res.send({
            message: "User registered successfully!",
            user: {
                username: user.username,
                email: user.email,
            },
        })
    }catch(err){
        return res.status(400).send({message:err})
    }
})

router.post('/login', async(req,res)=>{

     //Validation to check user input
     const {error} = loginValidation(req.body)
     if (error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

     //Validation to check if user exists
    const userExists = await User.findOne({email:req.body.email})
    if (!userExists){
        return res.status(400).send({message:'User does not exist'})
    }

     // Validation to check user password
     const passwordValidation = await bcryptjs.compare(req.body.password,userExists.password)
     if(!passwordValidation){
         return res.status(400).send({message:'Password is incorrect'})
     }

     const token = jsonwebtoken.sign({_id:userExists._id, username: userExists.username}, process.env.TOKEN_SECRET)
     res.header('auth-token', token).send({'auth-token':token})

})

module.exports = router