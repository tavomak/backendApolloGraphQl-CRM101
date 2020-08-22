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

    type Client {
        id: ID
        name: String
        lastName: String
        company: String
        email: String
        phone: String
        vendor: ID
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

    input ClientInput{
        name: String!
        lastName: String!
        company: String!
        email: String!
        phone: String
    }

    # Queries ======================

    type Query {
        #Usuarios
        getUser(token: String!) : User

        #Productos
        getProducts: [Product]
        getProduct(id: ID!) : Product

        #Clientes
        getClient(id: ID!): Client
        getClients: [Client]
        getClientsVendor: [Client]
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

        #Clientes
        newClient(input: ClientInput) : Client
        updateClient(id: ID!, input: ClientInput) : Client
        removeClient(id: ID!) : String
    }
`;
module.exports = typeDefs;