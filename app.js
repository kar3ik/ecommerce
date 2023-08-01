const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')


app.use(express.json())
app.use(cookieParser())
const errorMiddleware = require('./middleware/error')



// routes import
// const anyname = require('./path of route')
//products only
const product = require('./routes/productRoute')
const user = require("./routes/userRoute")
const order = require('./routes/orderRoute')



// to use routes
// app.use("/",anyname)
// to use all products routes and it starts with "/api/v1/"
app.use("/api/v1", product)
// for users
app.use("/api/v1", user)
//for order
app.use("/api/v1",order)


// middleware for error
app.use(errorMiddleware)


module.exports = app