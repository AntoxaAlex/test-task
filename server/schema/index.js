const {buildSchema} = require("graphql");

module.exports = buildSchema(`
    schema{
        query: RootQuery,
        mutation: RootMutation
    }
    
    type RootQuery{
        info: User!
        latency: String
    }
    
    type RootMutation{
        signIn(userInput: UserInput):AuthData
        signUp(userInput: UserInput): AuthData
        logout(all:Boolean!): String
    }
    
    type User{
        _id:String!
        idType: String!
        password: String
    }
    
    type AuthData{
        token:String!
    }
    
    input UserInput{
        id: String!
        password: String!
    }
`)