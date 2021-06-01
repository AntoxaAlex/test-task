const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    _id:{
        type: String,
        required: true
    },
    idType:{
        type:String,
        required:true
    },
    password:{
        type: String,
        required: true
    },
    tokens:[
        {
            type: String
        }
    ]
})

module.exports = mongoose.model("User",userSchema)