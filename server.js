const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const {MONGOURL} = require('./db')
const cors = require('cors');
require('./models/user')

const userroute=require('./routes/auth')


app.use(cors({ origin: '#' }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use(bodyParser.json())
app.use('/api/v1',userroute)
app.use(express.json())
app.get('/',(req,res)=>{
  res.send("Hello Guy's Welcome To Mongo Curd Demo for changes")
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
const port =process.env.Port||5000

app.listen(process.env.port || port, () => {
  console.log(`Example app listening on port ${port}`)
})
