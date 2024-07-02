const mongoose = require('mongoose');

mongoose.connect(process.env.DB_HOST)
.then(()=>{
    console.log("Database connected.....")
}).catch((err)=>{
    console.log("Error establishing database connection")
})