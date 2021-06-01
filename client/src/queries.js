export const REGISTER_USER = `
    mutation RegisterUser($id: String!,$password: String!){
        signUp(userInput:{
            id: $id,
            password: $password
        }){
            token
        }
    }
`

export const LOGIN_USER = `
    mutation RegisterUser($id: String!,$password: String!){
        signIn(userInput:{
            id: $id,
            password: $password
        }){
            token
        }
    }
`

export const RETURN_ID = `
    query {
        info{
            _id
            idType
        }
    }
`

export const LOGOUT = `
    mutation LogoutUser($all:Boolean!){
        logout(all:$all)
    }
`

export const LATENCY = `
    query GetLatency{
        latency
    }
`