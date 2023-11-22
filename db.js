const mongoose = require('mongoose')

module.exports = mongoose.connect('mongodb://127.0.0.1:27017/Movie_Rental')
.then(()=>{
    console.log('DB Connection Successful')
}).catch((error)=>{
    console.log('DB Connection Failed!!..',error.message)
})  