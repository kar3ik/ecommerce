const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const crypto = require('crypto')


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,"please enter your name"],
        maxLength:[30,"Name cannot exceed 30 characters"],
        minLength:[4,"name should not contain less then 4 char"]

    },
    email:{
        type:String,
        require:[true,"please enter email"],
        unique:true,
        validate:[validator.isEmail,"please enter a valid mail"]
    },
    name:{
        type:String,
        require:[true,"please enter your password"],
        minLength:[8,"password should be greaterthen 8 chars"],
        select:false,

    },
    avatar:
        {
            public_id:{
                type:String,
                require: true
        
            } ,
            url: {
              type:String,
            require: true
            }
        },
        role:{
            type:String,
            default:"user"
        },
        resetPasswordToken:String,
        resetPasswordExpire:Date,


})


userSchema.pre("save", async function(next){

    if(!this.isModified("password")){
        next()
    }
    this.password =await bcrypt.hash(this.password,10)

})

// jwt
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })

}

// compare password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)

}

// forget password
userSchema.methods.getResetPasswordToken= function(){
    const resetToken = crypto.randomBytes(20).toString("hex")

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire = Date.now()+15*60*1000
    return resetToken
}

module.exports=mongoose.model("user", userSchema)