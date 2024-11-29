const mongoose = require('mongoose')
const User = require('./User')
const { required } = require('joi')

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
        enum: ['politics', 'health', 'sport', 'tech'],
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
        default: () =>{
            const expirationDate = new Date()
            expirationDate.setMinutes(expirationDate.getMinutes() + 15)
            return expirationDate
        },
    },
    status:{
        type: String,
        enum: ['live', 'expired'],
        default: 'live',
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
        default: 0,
    },
    comments:[
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            username: { type: String, required: true},
            comment: { type: String, required: true},
            createdAt: { type: Date, default: Date.now},
        },
    ],
    interactions: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            username: { type: String, required: true },
            type: { type: String, enum: ['like', 'dislike', 'comment'], required: true },
            content: { type: String }, // For comments only
            interactedAt: { type: Date, default: Date.now },
        },
    ]
})

//mongoose automatically converts model name to lower case and plural
module.exports = mongoose.model('Post', postSchema)