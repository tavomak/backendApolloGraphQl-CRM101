const { gql } = require('apollo-server');

//Schema
const typeDefs = gql`

    # TYPES =====================
    type User {
        id: ID
        name: String
        lastName: String
        email: String
        created: String
    }
    type Token {
        token: String
    }

    type Product {
        id: ID
        name: String
        price: Float
        stock: Int
        created: String
    }

    # INPUTS =====================

    input UserInput {
        name: String!
        lastName: String!
        email: String!
        password: String!
    }
    
    input AuthInput {
        email: String!
        password: String!
    }

    input ProductInput {
        name: String!
        price: Float!
        stock: Int!
    }

    # Queries ======================

    type Query {
        #Usuarios
        getUser(token: String!) : User

        #Productos
        getProducts: [Product]
        getProduct(id: ID!) : Product
    }
    
    # Mutations =====================

    type Mutation {
        #Usuarios
        newUser(input: UserInput) : User
        authUser(input: AuthInput) : Token

        #Productos
        newProduct(input: ProductInput) : Product
        updateProduct(id: ID!, input: ProductInput) : Product
        removeProduct(id: ID!) : String
    }
`;
module.exports = typeDefs;