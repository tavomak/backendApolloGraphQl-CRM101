//Import Apollo server
const { ApolloServer } = require('apollo-server');
//Schema
const typeDefs = require('./db/schema');
//Resolvers
const resolvers = require('./db/resolvers');

const conectarDb = require('./config/db');
//Conectar con la BBDD
conectarDb();

//Servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => {
        const miContext = "Hola";
        return {miContext};
    }
});

//Inicializar servidor
server.listen().then( ({url}) => {
    console.log(`Servidor listo en la URL: ${url}`)
});

/* GraphQL
Queries: Se utiliza para leer los registros, es la forma de extraer la informacion exsistente en una BBDD o Rest API. Equivale a la R de CURD.

Mutation: Se utiliza para las otras 3 acciones del CURD; Crear, Actualizar y Borrar registros.

Schema: Describe los tipos de objetos, queries y datos en la aplicacion. Define mediante un Typing si un campo es de tipo string, int, bool, etc. Requiere como minimo un Type Query y un resolver que satisfaga la funcion que esta dentro del query.

Resolvers: Son funciones que retornan los valores que se definieron en el schema. Se encarga de consultar la BBDD y traer el resultado que se mostrar'a en el schema. Siempre son un objeto

*/