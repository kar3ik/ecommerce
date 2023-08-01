const ErrorHandler = require('../utils/errorHandler')


module.exports = (err,req,res,next) =>{
    err.statusCode = err.statusCode || 500 
    err.message = err.message || "Internal server error"

    // mongodb error 
    if(err.name === "casteError") {
        const message = `resource not found . invalid ${err.path}`
        err=new ErrorHandler(message,400)
    }

    // duplicate error
    if(err.code ===11000){
        const message=`duplicate ${Object.keys(err.keyValue)} entered`
        err=new ErrorHandler(message,400)
    }

    // wrong jwt
    if(err.name === "jsonWebTokenError") {
        const message = `token invalid`
        err=new ErrorHandler(message,400)
    }

    // jwt expire
    if(err.name === "TokenExpiredError") {
        const message = `token expired`
        err=new ErrorHandler(message,400)
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.stack
    })

}

