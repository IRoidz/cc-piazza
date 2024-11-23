const express = require('express')
const mongoose = require('mongoose')
require('dotenv/config')

const app = express()

app.get('/', (req,res)=>{
    res.send("you're in homepage")
})

mongoose.connect(process.env.DB_CONNECTOR).then(()=>{
    console.log('Your mongoDB connector is on...')
})

app.listen(3000, ()=>{
    console.log('up and running')
})