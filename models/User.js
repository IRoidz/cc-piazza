const { date } = require('joi')
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username:{
        type:String,
        require:true,
        min:3,
        max:40
    },
    email:{
        type:String,
        require:true,
        min:6,
        max:256
    },
    password:{
        type:String,
        require:true,
        min:6,
        max:1024
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model(users,userSchema)