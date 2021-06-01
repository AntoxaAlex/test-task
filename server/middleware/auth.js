const jwt = require("jsonwebtoken");
if(process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}

module.exports = async (req, res, next) =>{
    let decodedToken;
    const authHeader = req.get("Authorization")
    if(!authHeader){
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(" ")[1];
    if(!token || token === ""){
        req.isAuth = false;
        return next();
    }
    try {
        decodedToken = jwt.verify(token,process.env.SECRET);
    }catch (e) {
        req.isAuth = false
        return next();
    }
    if(!decodedToken){
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    req.idType = decodedToken.idType;
    req.token = token;
    next();
}