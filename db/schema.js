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

    type Order {
        id: ID
        order: [OrderGroup]
        price: Float
        client: ID
        vendor: ID
        created: String
        state: OrderState
    }

    type OrderGroup{
        id: ID
        amount: Int
    }

    type TopClients{
        total: Float
        client: [Client]
    }
    type TopVendors{
        total: Float
        vendor: [User]
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

    input ProductOrderInput{
        id: ID
        amount: Int
    }

    input OrderInput{
        order: [ProductOrderInput]
        price: Float
        client: ID
        state: OrderState
    }

    enum OrderState {
        PENDIENTE
        COMPLETADO
        CANCELADO
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

        #Pedidos
        getOrders: [Order]
        getOrdersVendor: [Order]
        getOrderById(id: ID!) : Order
        getOrdersByState(state: String!) : [Order]

        #Search
        bestClients: [TopClients]
        bestVendors: [TopVendors]
        searchProduct(text: String!) : [Product]
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

        #Pedidos
        newOrder(input: OrderInput) : Order
        updateOrder(id: ID!, input: OrderInput) : Order
        removeOrder(id: ID!) : String
    }
`;
module.exports = typeDefs;