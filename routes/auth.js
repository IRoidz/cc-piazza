const express = require('express')
const User = require('../models/User')
const router = express.Router()

const {registerValidation, loginValidation} = require('../validations/validation')

const bcryptjs = require('bcryptjs')

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

     //Validation to check is user already exists
    const userExists = await User.findOne({email:req.body.email})
    if (!userExists){
        return res.status(400).send({message:'User does not exist'})
    }

     // Validation to check user password
     const passwordValidation = await bcryptjs.compare(req.body.password,userExists.password)
     if(!passwordValidation){
         return res.status(400).send({message:'Password is incorrect'})
     }

     //placeholder
     return res.send("You logged in")

})

module.exports = router