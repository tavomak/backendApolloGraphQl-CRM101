//Import Apollo server
const { ApolloServer, gql } = require('apollo-server');

//Servidor
const server = new ApolloServer();


//Inicializar servidor
server.listen().then( ({url}) => {
    console.log(`Servidor listo en la URL: ${url}`)
});