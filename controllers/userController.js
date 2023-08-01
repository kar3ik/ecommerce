const ErrorHandler = require('../utils/errorHandler')
const asyncErrorHandler  = require('../middleware/asyncError')
const User = require('../models/userModels')
const sendToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')

const registerUser = asyncErrorHandler(async(req,res,next)=>{
    const {name,email,password } = req.body
    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"sample id",
            url:"profilepath"
        }
    })
    sendToken(user,200,res)

})


// login

const loginUser = asyncErrorHandler(async(req,res,next)=>{
    const {email,password} = req.body
    if(!email || !password){
        return next(new ErrorHandler("enter email and password", 400))
    }
    const user =await User.findOne({email}).select("+password")
    if(!user){
        return next(new ErrorHandler("invalid email or password",401))
    }

    const isPasswordMatched =await user.comparePassword(password)
    if(!isPasswordMatched){
        return next(new ErrorHandler("invalid email or password",401))
    }
    sendToken(user,200,res)

})


// logout
const logOut = asyncErrorHandler(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message:"logout successfully"
    })
})


// forgetPassword
const forgotPassword = asyncErrorHandler(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return next(new ErrorHandler("user not found ", 404))
    }
    const resetToken = user.getResetPasswordToken()
    await user.save({validateBeforeSave:false})
    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
    const message = `your password reset token is : ${resetPasswordUrl}`
    try{
        await sendEmail({

            email:user.email,
            subject:`password reset`,
            message,

        })
        res.status(200).json({
            success:true,
            message:`email sent to your mail : ${user.email} `

        })

    }catch(err){
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({validateBeforeSave:false})
        return next(new ErrorHandler(err.message,500))

    }
})


const resetPassword = asyncErrorHandler(async(req,res,next)=>{

    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
    const user = await user.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt:Date.now()}
    })

    if(!user){
        return next(new ErrorHandler("token invalid ", 400))
    }
    if(req.body.password!==req.body.confirmPassword){
        return next(new ErrorHandler("password dosent match ", 400))

    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()
    sendToken(user,200,res)


})

// getuserdetails
const getUserDetails = asyncErrorHandler(async(req,res,next)=>{
    const user = await User.findById(req.user.id)
    res.status(200).json({success:true, user})
})



//updateuserpassword
const updatePassword = asyncErrorHandler(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password")
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
    if(!isPasswordMatched){
        return next(new ErrorHandler("old pass is incorrect",401))
    }
    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler(" pass not matched",401))
    }

    user.password = req.body.newPassword
    await user.save()
    sendToken(user,200,res)
})

// updateprofile
const updateProfile = asyncErrorHandler(async(req,res,next)=>{
    const newUserData={name:req.body.name,
    email:req.body.email,
    }

    const user =await User.findByIdAndUpdate(req.user.id,newUserData,{new:true,runValidators:true,useFindAndModify:false})
    res.status(200).json({
        success:true,
    })
})


//get all users
const getAllUsers = asyncErrorHandler(async(req,res,next)=>{
    const users = await User.find()
    res.status(200).json({
        success:true,
        users
    })
})


// get a user(admin)
const getAUsers = asyncErrorHandler(async(req,res,next)=>{
    const user = await User.findById(req.params.id)
    if(!user){
        return next(new ErrorHandler(`user not exist with id ${req.params.id}`))
    }
    res.status(200).json({
        success:true,
        user
    })
})


// update role(admin)
const updateProfileRole = asyncErrorHandler(async(req,res,next)=>{
    const newUserData={name:req.body.name,
    email:req.body.email,
    role:req.body.role
    }

    const user =await User.findByIdAndUpdate(req.params.id,newUserData,{new:true,runValidators:true,useFindAndModify:false})
    res.status(200).json({
        success:true,
    })
})


// delete role(admin)
const deleteUser = asyncErrorHandler(async(req,res,next)=>{
    const user = User.findById(req.params.id)
    if(!user){
        return next(new ErrorHandler(`user not existe : ${req.params.id}`))
    }
    await user.remove()
    res.status(200).json({
        success:true,
        message:"user deleted successfully"
    })
})



module.exports = { registerUser, loginUser, logOut ,forgotPassword,resetPassword, getUserDetails, 
                    updatePassword, updateProfile, 
                    getAllUsers, getAUsers , updateProfileRole, deleteUser }