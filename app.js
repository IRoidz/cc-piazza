const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv')

app.get('/', (req,res)=>{
    res.send("you're in homepage")
})

app.listen(3000, ()=>{
    console.log('up and running')
})