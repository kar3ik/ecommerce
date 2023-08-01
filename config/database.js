const mongoose = require('mongoose')
const connectDB=()=>{
    mongoose.connect(process.env.DB_URI)
        .then((data)=>{
        console.log(`mongo db connected ${data.connection.host}`)
            }).catch((err)=>{
        console.log(err)
        })
}

module.exports = connectDB