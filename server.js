const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const {MONGOURL} = require('./db')
require('./models/user')
const userroute=require('./routes/auth')
app.use(bodyParser.json())
app.use('/api/v1',userroute)
app.use(express.json())
app.get('/',(req,res)=>{
  res.send("Hello Guy's Welcome To Mongo Curd Application")
})
const mongoose = require('mongoose')
mongoose.connect(MONGOURL,{
  useNewUrlParser:true,
  useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
  console.log('mongodb connected')
})
mongoose.connection.on('error',(err)=>{
  console.log('error',err)
})
const port =5000

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})