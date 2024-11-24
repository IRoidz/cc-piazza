const mongoose = require('mongoose')
const User = require('./User')

// minlength, maxlength for String and min, max for Number
const postSchema = mongoose.Schema({
    title:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 1000
    },
    topic:{
        type: [String],
        enum: ['Politics', 'Health', 'Sport', 'Tech'],
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    body:{
        type: String,
        required: true,
        maxlength: 3000
    },
    expiration:{
        type: Date,
        required: true
    },
    status:{
        type: String,
        enum: ['Live', 'Expired'],
        default: 'Live',
        required: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes:{
        type: Number,
        default:0
    },
    dislikes:{
        type: Number,
        default: 0
    },
    comments:[
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            comment: { type: String, required: true},
            createdAt: { type: Date, default: Date.now},
        },
    ],
})

//mongoose automatically converts model name to lower case and plural
module.exports = mongoose.model('Post', postSchema)