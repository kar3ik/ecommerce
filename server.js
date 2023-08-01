const app= require('./app')
const dotenv = require('dotenv')
const connectDB = require('./config/database')


// handle uncaught exceptions
process.on("uncaughtException",(err)=>{
    console.log(`error : ${err.message}`)
    console.log("shutting down server")
    process.exit(1)

})




dotenv.config({path:"config/config.env"})


// dbconnection
connectDB()




const server = app.listen(process.env.PORT,()=>{
    console.log(`server started at ${process.env.PORT}`)
})


// unhandled promise rejection
process.on("unhandled rejection",err=>{
    console.log(`error : ${err.message}`)
    console.log("shutting down server")
    server.close(()=>{
        process.exit(1)
    })

})