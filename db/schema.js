const { gql } = require('apollo-server');

//Schema
const typeDefs = gql`

    type User {
        id: ID
        nombre: String
        apellido: String
        email: String
        creado: String
    }
    type Token {
        token: String
    }

    input UserInput {
        nombre: String!
        apellido: String!
        email: String!
        password: String!
    }
    
    input AuthInput {
        email: String!
        password: String!
    }

    type Query {
        getUser(token: String!) : User
    }
    
    type Mutation {
        newUser(input: UserInput) : User
        authUser(input: AuthInput) : Token
    }
`;
module.exports = typeDefs;