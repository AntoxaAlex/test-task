const mongoose = require("mongoose");

const connectDB = async (dbUrl)=>{
    try {
        await mongoose.connect(dbUrl,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log("Database has been successfully connected")
    }catch (e) {
        console.log('DB did not connected: ' + e.message);
        //Exit process with failure
        process.exit(1);
    }
}

module.exports = connectDB;