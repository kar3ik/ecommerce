class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode

        Error.captureStackTrace(this,this.constructor)
    }
}


// to use errorhandler , need to create a middleware
module.exports = ErrorHandler