const userModels = require('../models/userModels')
const ErrorHandler = require('../utils/errorHandler')
const asyncErrorHandler = require('./asyncError')
const jwt = require('jsonwebtoken')

const isAuthenticatedUser = asyncErrorHandler(async(req,res,next)=>{
    const token = req.cookie
    if(!token){
        return next(new ErrorHandler("please login to access thi resource",401))
    }
    const decodedData = jwt.verify(token,process.env.JWT_SECRET)
    req.user = await userModels.findById(decodedData._id)
    next()
    

})
const authorizeRoles = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role : ${req.user.role} is not allowed to access this resource`,403))

        }
    }
    next()
}
module.exports = {isAuthenticatedUser,authorizeRoles}