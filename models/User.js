const { date, required } = require('joi')
const mongoose = require('mongoose')

// minlength, maxlength for String and min, max for Number
const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 40
    },
    email:{
        type: String,
        required: true,
        minlength: 6,
        maxlength: 256
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    date:{
        type: Date,
        default: Date.now
    }
})

//mongoose automatically converts model name to lower case and plural 
module.exports = mongoose.model('User', userSchema)