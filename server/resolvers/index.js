const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nettime = require('nettime')
if(process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}

const saveToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const token =await jwt.sign({userId:user._id,idType:user.idType},process.env.SECRET,{expiresIn: 600});
        await user.tokens.push(token)
        await user.save()
    }catch (e) {
        console.log(e.message);
    }
}

module.exports = {
    signUp: async args => {
        const {id,password} = args.userInput;
        try{
            let user = await User.findById(id);
            if(user){
                throw new Error("User with such id is already exists");
            }

            const hashedPassword = await bcrypt.hash(password,12);

            user = await new User({
                _id:id,
                idType: id.includes("@") ? "mail" : "phone",
                password:hashedPassword
            })

            const token =await jwt.sign({userId:user._id,idType:user.idType},process.env.SECRET,{expiresIn: 600});
            user.tokens.push(token);
            await user.save();
            console.log(token);
            return {
                token
            }
        }catch (e) {
            console.log(e);
        }
    },
    signIn: async args => {
        const {id,password} = args.userInput;
        try{
            const user = await User.findById(id);
            if(!user){
                throw new Error("User does not exists");
            }

            const isMathced = await bcrypt.compare(password,user.password);
            if(!isMathced){
                throw new Error("Incorrect password")
            }
            const token =await jwt.sign({userId:user._id,idType:user.idType},process.env.SECRET,{expiresIn: 600});
            user.tokens.push(token);
            await user.save();
            console.log(token)
            return {token}
        }catch (e) {
            console.log(e.message)
        }
    },
    info: async (args,req) => {
        if(!req.isAuth){
            throw new Error("Unauthorized")
        }
        try {
            await saveToken(req.userId)
            return {_id:req.userId,idType:req.idType}
        }catch (e) {
            console.log(e.message)
        }
    },
    latency:async (args,req) => {
        if(!req.isAuth){
            throw new Error("Unauthorized")
        }
        try {
            const res = await nettime('https://www.google.com')
            await saveToken(req.userId)
            return (res.timings.socketClose[1]/1000000000).toString()

        }catch (e) {
            console.log(e.message)
        }
    },
    logout: async (args,req) => {
        if(!req.isAuth){
            throw new Error("Unauthorized")
        }
        try {
            const user = await User.findById(req.userId);
            if(args.all){
                user.tokens = [];
                await user.save();
            }else{
                console.log(req.token)
                user.tokens = user.tokens.filter(token=>token !== req.token)
                await user.save()
            }
        }catch (e) {
            console.log(e.message)
        }
    }
}