const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.post("/signup", (req, res) => {
  try {
    let {
        fullname, email, companyname, password, confirmpassword
    } = req.body
  
    const newuser = new User({
        fullname,
        email,
        companyname,
        password,
        confirmpassword,
    })
    console.log(req.body,newuser);
    User.find({ email: req.body.email }, (err, docs) => {
        if (docs.length > 0) {
            res.send('email already registerd')
        } else {  
            newuser.save(err => {
                if (!err) {
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
router.post('/login',(req,res)=>{
    User.find({email:req.body.email,password:req.body.password},(err,docs)=>{
        if(docs.length>0){
            const user = {
                fullname:docs[0].fullname,
                _id:docs[0]._id,
                email:docs[0].email
            }
            
            res.status(200).json({message:' login successfull',data:user})
            console.log(user)
        }else{
             return res.status(400).json({message:' Invalid Credentials'})
        }
    })
})


module.exports = router