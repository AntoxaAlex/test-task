const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const {graphqlHTTP} = require("express-graphql");
const mySchema = require("./schema/index")
const myResolvers = require("./resolvers/index")
const connectDB = require("./database/index")
const isAuth = require("./middleware/auth")
if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}
const port = process.env.PORT || 4000;
const dbUrl = process.env.DBURL;


app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","POST,GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers","Content-Type, Authorization");
    if(req.method === "OPTIONS"){
        return res.sendStatus(200);
    }
    next();
})

app.use(isAuth)

app.use("/graphql",graphqlHTTP({
    schema:mySchema,
    rootValue:myResolvers,
    graphiql:true
}))

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
    connectDB(dbUrl)
})