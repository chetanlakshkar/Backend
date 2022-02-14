const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const User = require('../models/user')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const sendgridtransport = require('nodemailer-sendgrid-transport')
const { response } = require('express')
const bcrypt = require('bcryptjs/dist/bcrypt')
const jwt = require('jsonwebtoken')


const transporter = nodemailer.createTransport(sendgridtransport({
    auth:{
        api_key:"SG.vHzPXoIKS5uuuOZSiwgIIg.VorgaxzvoJ2H1ugHwZBUcJaZmPP7pZSjEAGEiYZxiho"
    }
}))


router.post("/signup", (req, res) => {
  try {
    let {
        fullname, email, companyname, password, confirmpassword
    } = req.body
    console.log(req.body);
    const newuser = new User({
        fullname,
        email,
        companyname,
        password,
        confirmpassword,
    })
    console.log(newuser)
    User.find({ email: req.body.email }, (err, docs) => { 
        if (docs.length > 0) {
            res.send('email already registerd  ')
        }else if(password!=confirmpassword){
            res.send('password and confirm password are not same')
        }
        else {  
            newuser.save(err => {
                if (!err) {
                    transporter.sendMail({
                        to:newuser.email,
                        from:'khatriankur14@gmail.com',
                        subject:'signup success',
                        html:"<h1>welcome to feedfleet</h1>"
                    })
                    res.send('User Registration Success')
                } else {
                    res.send('something went wrong')
                }
            })
        }
        if (err) {
            return res.send(400).json({ message: 'something went wrong' })
        }
    })



  } catch (error) {
      console.log(error.message);
      res.send(error.message)
  }
    
})
router.post('/login',async(req,res)=>{
    /*User.find({email:req.body.email,password:req.body.password},(err,docs)=>{
        if(docs.length>0){
            const user = {
                fullname:docs[0].fullname,
                _id:docs[0]._id,
                email:docs[0].email
            }
            res.send(user)
            console.log(user)
        }else{
             return res.status(400).json({message:'Invalid Credentials'})
        }
    })*/
    try{
        const {email,password}=req.body
        if(!email||!password){
            return res.status(400).json({error:'please filled the data'})
        }
        const userlogin = await User.findOne({email:email}) 
        if(userlogin){
            const ismatch = await bcrypt.compare(password,userlogin.password)
            const token =await userlogin.generateAuthToken()
            console.log(token)
            res.cookie('jwtoken',token,{
                expires:new Date(Date.now()+25892000000),
                httpOnly:true
            })
            if(!ismatch){
                res.status(400).json({error:'invelid credantial'})
            }else{
                localStorage.setItem('jwt',token)
                res.json({message:'user signin successfull',token:token})
            }
        }else{
            res.status(400).json({error:'invelid credentials'})
        }
    }catch(err){
        console.log(err)
    }
})

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User dont exists with that email"})
            }
            user.resettoken=token
            user.expiretoken=Date.now() + 3600000
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"khatriankur14@gmail.com",
                    subject:'password reset',
                    html:`<p>you requested for password reset</p>
                    <h5>click in this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>`
                })
                response.json({message:"check your email"})
            })
        })
    })
})

router.post('/new-password',(req,res)=>{
    const newpassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resettoken:sentToken,expiretoken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        user.password = newpassword
        user.resettoken = undefined
        user.expiretoken = undefined
        user.save().then((saveduser)=>{
            response.json({message:"password updated success"})
        })
    }).catch(err=>{
        console.log(err)
    })
})


module.exports = router