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

    input UserInput {
        nombre: String!
        apellido: String!
        email: String!
        password: String!
    }
    type Query {
        obtenerCurso: String
    }
    
    type Mutation {
        newUser(input: UserInput) : User
    }
`;
// Query: Se utiliza únicamente para hacer onsultas de lectura a la BBDD (R en CURD)
// Para todo lo demás se utilizan Mutations (C,U,D de CURD) 

//Tipos de DATOS en  GraphQl:
// INT = Números enteros,
// FLOAT = Números Decimales,
// STRING = Cadena de Texto,
// ID= Identificador único,
// BOOLEAN= true o falrse
module.exports = typeDefs;