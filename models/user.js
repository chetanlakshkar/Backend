const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    companyname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resettoken:String,
    expiretoken:Date,
    confirmpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})


userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,12)
        this.confirmpassword=await bcrypt.hash(this.confirmpassword,12)
    }
    next()
})
userSchema.methods.generateAuthToken=async function(){
    try{
        let token = jwt.sign({_id:this._id},'ankurkhatrikhatrichetnachetanlakshkarrishabhbhoopendrashuklafdsjfjdfjdjfkjsdjfjksjkfjk')
        this.tokens=this.tokens.concat({token:token})
        await this.save()
        return token
        
    }catch(error){
        console.log(error)
    }
}
const User = mongoose.model('users',userSchema)
module.exports=User