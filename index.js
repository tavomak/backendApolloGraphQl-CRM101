//Import Apollo server
const { ApolloServer } = require('apollo-server');
//Schema
const typeDefs = require('./db/schema');
//Resolvers
const resolvers = require('./db/resolvers');
//Librería para Web Tokens
const jwt = require('jsonwebtoken');
//Firma del token, creada en las varialbes de entornos
require('dotenv').config({path: 'variables.env'});

const conectarDb = require('./config/db');
//Conectar con la BBDD
conectarDb();

//Servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        const token = req.headers['authorization'] || '';
        //console.log(token);
        if (token) {
            try {
                const user = jwt.verify(token, process.env.SECRETA);
                //console.log(user);
                return{
                    user
                }
            } catch (error) {
                console.log('Error', error)
            }
        }
    }
});

//Inicializar servidor
server.listen().then( ({url}) => {
    console.log(`Servidor listo en la URL: ${url}`)
});